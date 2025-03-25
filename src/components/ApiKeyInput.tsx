
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setApiKey, getApiKey } from "@/utils/openaiService";
import { toast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved.",
      });
      onKeySet();
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 rounded-lg border shadow-sm mb-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-2">Set OpenAI API Key</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        To use the AI chat features, please enter your OpenAI API key. Your key will be stored locally in your browser.
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSaveKey}>Save Key</Button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
