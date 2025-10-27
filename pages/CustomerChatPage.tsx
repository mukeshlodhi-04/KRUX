
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useChat } from '../contexts/AppContext';
import ChatMessage from '../components/ChatMessage';
import { Send, LogOut } from 'lucide-react';
import { getBotResponse } from '../services/geminiService';
import type { Message } from '../types';
import { BOT_USER } from '../constants';

const CustomerChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { authState, authDispatch } = useAuth();
  const { chatState, chatDispatch } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = authState.user;
  const activeTicket = chatState.tickets.find(t => t.id === chatState.activeTicketId);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'customer') {
      navigate('/login/customer');
    } else {
        const customerTicket = chatState.tickets.find(t => t.customerId === authState.user?.id && t.status !== 'resolved');
        if (!customerTicket) {
             const welcomeMessage: Message = {
                id: `msg-${Date.now()}`,
                text: "Hello! Welcome to KRUX Finance. How can I help you with your loan today?",
                sender: BOT_USER,
                timestamp: Date.now(),
            };
            chatDispatch({ type: 'START_CHAT', payload: { customer: authState.user, initialMessage: welcomeMessage }});
        } else {
            chatDispatch({ type: 'SELECT_TICKET', payload: { ticketId: customerTicket.id } });
        }
    }
  }, [authState, navigate, chatDispatch, chatState.tickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUser || !activeTicket) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: currentUser,
      timestamp: Date.now(),
    };
    
    chatDispatch({ type: 'SEND_MESSAGE', payload: { ticketId: activeTicket.id, message: userMessage } });
    setInputValue('');
    chatDispatch({ type: 'SET_TYPING', payload: { ticketId: activeTicket.id, isTyping: true } });

    const updatedHistory = [...activeTicket.messages, userMessage];
    const botResponseText = await getBotResponse(updatedHistory);

    if (botResponseText === 'TRANSFER_TO_AGENT') {
        chatDispatch({ type: 'UPDATE_TICKET_STATUS', payload: { ticketId: activeTicket.id, status: 'open' } });
        const agentMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          text: "You've been connected to our support queue. An agent will be with you shortly.",
          sender: BOT_USER,
          timestamp: Date.now(),
        };
        chatDispatch({ type: 'SET_TYPING', payload: { ticketId: activeTicket.id, isTyping: false } });
        chatDispatch({ type: 'SEND_MESSAGE', payload: { ticketId: activeTicket.id, message: agentMessage } });
    } else {
        const botMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          text: botResponseText,
          sender: BOT_USER,
          timestamp: Date.now(),
        };
        chatDispatch({ type: 'SET_TYPING', payload: { ticketId: activeTicket.id, isTyping: false } });
        chatDispatch({ type: 'SEND_MESSAGE', payload: { ticketId: activeTicket.id, message: botMessage } });
    }
  };

  const handleLogout = () => {
    authDispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-dark-background">
      <header className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-sm">
        <h1 className="text-xl font-bold text-primary dark:text-dark-primary">KRUX Finance Chat</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground hidden sm:inline">
                Welcome, {currentUser?.name}
            </span>
            <button onClick={handleLogout} className="p-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground rounded-full hover:bg-accent dark:hover:bg-dark-accent">
                <LogOut size={20}/>
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {activeTicket?.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.sender.id === currentUser?.id} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-border dark:border-dark-border bg-card dark:bg-dark-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
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

export default CustomerChatPage;
