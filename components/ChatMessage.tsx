
import React from 'react';
import type { Message } from '../types';
import { Bot, User } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const { text, sender, timestamp, isTyping } = message;

  const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser
    ? 'bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground'
    : 'bg-muted dark:bg-dark-muted';
  const bubbleRadius = isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none';

  if (isTyping) {
    return <TypingIndicator />;
  }
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end gap-2 ${alignment} w-full`}>
      {!isCurrentUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground flex items-center justify-center">
            {sender.role === 'bot' ? <Bot size={20} /> : <User size={20}/>}
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${bubbleColor} ${bubbleRadius}`}>
        <p className="text-sm break-words">{text}</p>
        <p className={`text-xs mt-1 opacity-70 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
