import { supabase } from "@/integrations/supabase/client";

export interface MentalStateAnalysis {
  overallMood: string;
  moodTrends: {
    direction: 'improving' | 'declining' | 'stable';
    confidence: number;
  };
  commonPatterns: {
    preferredActivities: string[];
    effectiveCoping: string[];
    frequentTriggers: string[];
    communicationPrefs: string;
  };
  recommendations: string[];
  insights: string[];
}

export const analyzeMentalStateHistory = async (userId: string, days: number = 30): Promise<MentalStateAnalysis> => {
  try {
    // Get mental state data from the last N days
    const { data: mentalStates, error } = await supabase
      .from('user_mental_states')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: true });

    if (error) throw error;

    if (!mentalStates || mentalStates.length === 0) {
      return {
        overallMood: 'neutral',
        moodTrends: { direction: 'stable', confidence: 0 },
        commonPatterns: {
          preferredActivities: [],
          effectiveCoping: [],
          frequentTriggers: [],
          communicationPrefs: 'supportive'
        },
        recommendations: ['Start chatting with the AI to build your mental health profile'],
        insights: ['No data available yet. Continue using the app to get personalized insights.']
      };
    }

    // Analyze mood trends
    const moodScores = mentalStates.map(state => {
      const moodValues = {
        'very_happy': 5,
        'positive': 4,
        'neutral': 3,
        'negative': 2,
        'anxious': 2,
        'depressed': 1
      };
      return moodValues[state.mood as keyof typeof moodValues] || 3;
    });

    const recentMoods = moodScores.slice(-7); // Last 7 entries
    const olderMoods = moodScores.slice(0, -7);
    
    const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    const olderAvg = olderMoods.length > 0 ? olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length : recentAvg;
    
    const moodChange = recentAvg - olderAvg;
    let moodDirection: 'improving' | 'declining' | 'stable' = 'stable';
    let confidence = Math.abs(moodChange) * 20; // Convert to percentage

    if (moodChange > 0.3) {
      moodDirection = 'improving';
    } else if (moodChange < -0.3) {
      moodDirection = 'declining';
    }

    // Extract common patterns
    const allPreferredActivities = mentalStates.flatMap(state => state.preferred_activities || []);
    const allCopingMechanisms = mentalStates.flatMap(state => state.coping_mechanisms || []);
    const allTriggers = mentalStates.flatMap(state => state.triggers || []);
    
    const frequencyCount = (arr: string[]) => {
      const counts: Record<string, number> = {};
      arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });
      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([item]) => item);
    };

    const preferredActivities = frequencyCount(allPreferredActivities);
    const effectiveCoping = frequencyCount(allCopingMechanisms);
    const frequentTriggers = frequencyCount(allTriggers);

    // Most common communication style
    const communicationStyles = mentalStates.map(state => state.communication_style).filter(Boolean);
    const communicationPrefs = communicationStyles.length > 0 ? 
      communicationStyles.sort((a,b) => 
        communicationStyles.filter(v => v === b).length - communicationStyles.filter(v => v === a).length
      )[0] : 'supportive';

    // Overall mood assessment
    const overallMood = recentAvg >= 4 ? 'positive' : 
                      recentAvg >= 3 ? 'neutral' : 
                      recentAvg >= 2 ? 'struggling' : 'needs support';

    // Generate recommendations based on patterns
    const recommendations: string[] = [];
    
    if (moodDirection === 'declining') {
      recommendations.push('Consider scheduling a check-in with a mental health professional');
      if (effectiveCoping.length > 0) {
        recommendations.push(`Try your usual coping strategies: ${effectiveCoping.join(', ')}`);
      }
    }
    
    if (preferredActivities.length > 0) {
      recommendations.push(`Engage in activities you enjoy: ${preferredActivities.join(', ')}`);
    }
    
    if (frequentTriggers.length > 0) {
      recommendations.push(`Be mindful of your triggers: ${frequentTriggers.join(', ')}`);
    }

    recommendations.push('Continue regular check-ins to track your progress');

    // Generate insights
    const insights: string[] = [];
    
    if (moodDirection === 'improving') {
      insights.push('Your mood has been trending upward - great progress!');
    } else if (moodDirection === 'declining') {
      insights.push('Your mood has been trending downward. This is normal - consider extra self-care.');
    }
    
    if (effectiveCoping.length > 0) {
      insights.push(`You respond well to: ${effectiveCoping.join(', ')}`);
    }
    
    if (mentalStates.length >= 10) {
      insights.push(`You've been consistent with tracking for ${days} days - this helps build self-awareness`);
    }

    return {
      overallMood,
      moodTrends: { direction: moodDirection, confidence: Math.min(confidence, 100) },
      commonPatterns: {
        preferredActivities,
        effectiveCoping,
        frequentTriggers,
        communicationPrefs
      },
      recommendations,
      insights
    };

  } catch (error) {
    console.error('Error analyzing mental state history:', error);
    throw error;
  }
};

export const getMoodInsightsForCheckIn = async (userId: string) => {
  try {
    const analysis = await analyzeMentalStateHistory(userId, 7); // Last 7 days
    
    return {
      suggestion: analysis.recommendations[0] || 'Take a moment to reflect on how you\'re feeling today',
      moodTrend: analysis.moodTrends.direction,
      preferredCoping: analysis.commonPatterns.effectiveCoping[0] || null,
      overallState: analysis.overallMood
    };
  } catch (error) {
    console.error('Error getting mood insights:', error);
    return {
      suggestion: 'Take a moment to reflect on how you\'re feeling today',
      moodTrend: 'stable' as const,
      preferredCoping: null,
      overallState: 'neutral'
    };
  }
};