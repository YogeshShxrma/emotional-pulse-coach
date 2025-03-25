
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setApiKey, getApiKey } from "@/utils/openaiService";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApiKeyInputProps {
  onKeySet: () => void;
  quotaExceeded?: boolean;
}

const ApiKeyInput = ({ onKeySet, quotaExceeded = false }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const [isShowingApiKey, setIsShowingApiKey] = useState(false);

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
      <h3 className="text-lg font-medium mb-2">OpenAI API Key</h3>
      
      {quotaExceeded && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The current API key has exceeded its quota. Please enter a different API key to continue using the chat.
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        A default API key is provided, but it may have limited quota. You can use your own key for uninterrupted service. Your key will be stored locally in your browser.
      </p>
      <div className="flex gap-2 flex-col sm:flex-row">
        <Input
          type={isShowingApiKey ? "text" : "password"}
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsShowingApiKey(!isShowingApiKey)} className="whitespace-nowrap">
            {isShowingApiKey ? "Hide Key" : "Show Key"}
          </Button>
          <Button onClick={handleSaveKey}>Save Key</Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
