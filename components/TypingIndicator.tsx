
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 justify-start w-full">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground flex items-center justify-center">
        <Bot size={20} />
      </div>
      <div className="bg-muted dark:bg-dark-muted p-3 rounded-lg rounded-bl-none flex items-center space-x-1.5">
        <span className="w-2 h-2 bg-muted-foreground dark:bg-dark-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-muted-foreground dark:bg-dark-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-muted-foreground dark:bg-dark-muted-foreground rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
