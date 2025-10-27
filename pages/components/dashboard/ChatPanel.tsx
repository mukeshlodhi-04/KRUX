
import React, { useState, useEffect, useRef } from 'react';
import type { Ticket, Agent, Message } from '../../../types';
import ChatMessage from '../../../components/ChatMessage';
import { useAuth, useChat } from '../../../contexts/AppContext';
import { Send, CornerDownLeft, CheckCircle2, ArrowUpCircle } from 'lucide-react';
import { QUICK_REPLIES } from '../../../constants';

interface ChatPanelProps {
  ticket: Ticket;
  agent: Agent | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ ticket, agent }) => {
  const { chatDispatch } = useChat();
  const { authState } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket && agent && !ticket.agentId) {
        chatDispatch({ type: 'ASSIGN_AGENT', payload: { ticketId: ticket.id, agentId: agent.id }});
    }
  }, [ticket, agent, chatDispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !agent) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: text,
      sender: agent,
      timestamp: Date.now(),
    };

    chatDispatch({ type: 'SEND_MESSAGE', payload: { ticketId: ticket.id, message } });
    setInputValue('');
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(inputValue);
  };

  const handleResolveTicket = () => {
    chatDispatch({ type: 'UPDATE_TICKET_STATUS', payload: { ticketId: ticket.id, status: 'resolved' } });
  }

  const handleEscalateTicket = () => {
    chatDispatch({ type: 'UPDATE_TICKET_STATUS', payload: { ticketId: ticket.id, status: 'escalated' } });
  }

  return (
    <div className="flex-1 flex flex-col bg-background dark:bg-dark-background">
      <header className="p-4 border-b border-border dark:border-dark-border bg-card dark:bg-dark-card flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{ticket.customerName}</h2>
          <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">Ticket ID: {ticket.id}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleEscalateTicket} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border dark:border-dark-border rounded-md hover:bg-accent dark:hover:bg-dark-accent">
                <ArrowUpCircle size={16} className="text-yellow-500" /> Escalate
            </button>
            <button onClick={handleResolveTicket} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border dark:border-dark-border rounded-md hover:bg-accent dark:hover:bg-dark-accent">
                <CheckCircle2 size={16} className="text-green-500" /> Resolve
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {ticket.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.sender.id === agent?.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t border-border dark:border-dark-border bg-card dark:bg-dark-card">
        <div className="mb-2 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply, index) => (
                <button 
                    key={index} 
                    onClick={() => handleSendMessage(reply)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs bg-muted dark:bg-dark-muted rounded-full hover:bg-accent dark:hover:bg-dark-accent text-muted-foreground dark:text-dark-muted-foreground"
                >
                    <CornerDownLeft size={12} /> {reply}
                </button>
            ))}
        </div>
        <form onSubmit={handleFormSubmit} className="flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-border dark:border-dark-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-background dark:bg-dark-background"
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground hover:bg-primary-dark dark:hover:bg-dark-primary-dark transition-colors disabled:opacity-50"
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPanel;
