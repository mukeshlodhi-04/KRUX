
import React from 'react';
import { useAuth, useChat } from '../contexts/AppContext';
import TicketList from './components/dashboard/TicketList';
import ChatPanel from './components/dashboard/ChatPanel';
import TopBar from './components/dashboard/TopBar';

const SupportDashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { chatState } = useChat();

  const activeTicket = chatState.tickets.find(t => t.id === chatState.activeTicketId);

  return (
    <div className="h-screen w-screen flex flex-col bg-muted dark:bg-dark-muted">
      <TopBar agent={authState.user} />
      <div className="flex-1 flex overflow-hidden">
        <TicketList tickets={chatState.tickets} activeTicketId={chatState.activeTicketId} />
        <main className="flex-1 flex flex-col">
          {activeTicket ? (
            <ChatPanel ticket={activeTicket} agent={authState.user} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground">
              <p className="text-lg">Select a ticket to start the conversation.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SupportDashboardPage;
