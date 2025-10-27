
import React from 'react';
import { useChat } from '../../../contexts/AppContext';
import type { Ticket, TicketStatus } from '../../../types';
import { MessageSquare, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  activeTicketId: string | null;
}

const statusConfig: { [key in TicketStatus]: { icon: React.ReactNode; color: string } } = {
  open: { icon: <AlertTriangle size={16} />, color: 'text-red-500' },
  'in-progress': { icon: <MessageSquare size={16} />, color: 'text-blue-500' },
  resolved: { icon: <CheckCircle2 size={16} />, color: 'text-green-500' },
  escalated: { icon: <AlertTriangle size={16} />, color: 'text-yellow-500' },
};

const TicketItem: React.FC<{ ticket: Ticket; isActive: boolean; onSelect: () => void }> = ({ ticket, isActive, onSelect }) => {
  const { icon, color } = statusConfig[ticket.status];
  const lastMessage = ticket.messages[ticket.messages.length - 1];
  const timeAgo = new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      onClick={onSelect}
      className={`p-3 cursor-pointer border-l-4 ${isActive ? 'border-primary bg-accent dark:bg-dark-accent' : 'border-transparent hover:bg-accent dark:hover:bg-dark-accent'}`}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-sm truncate">{ticket.customerName}</h3>
        <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">{timeAgo}</span>
      </div>
      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground truncate">
        {lastMessage?.sender.role === 'bot' ? '[BOT]' : lastMessage?.sender.name}: {lastMessage?.text}
      </p>
      <div className={`flex items-center gap-1 mt-2 text-xs ${color}`}>
        {icon}
        <span className="capitalize">{ticket.status}</span>
      </div>
    </div>
  );
};

const TicketList: React.FC<TicketListProps> = ({ tickets, activeTicketId }) => {
  const { chatDispatch } = useChat();

  const handleSelectTicket = (ticketId: string) => {
    chatDispatch({ type: 'SELECT_TICKET', payload: { ticketId } });
  };
  
  const openTickets = tickets.filter(t => t.status !== 'resolved').sort((a,b) => b.updatedAt - a.updatedAt);

  return (
    <aside className="w-80 bg-card dark:bg-dark-card border-r border-border dark:border-dark-border flex flex-col">
        <div className="p-4 border-b border-border dark:border-dark-border">
            <h2 className="font-bold text-lg">Conversations ({openTickets.length})</h2>
        </div>
      <div className="flex-1 overflow-y-auto">
        {openTickets.length > 0 ? (
            openTickets.map(ticket => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                isActive={ticket.id === activeTicketId}
                onSelect={() => handleSelectTicket(ticket.id)}
              />
            ))
        ) : (
            <div className="p-4 text-center text-muted-foreground dark:text-dark-muted-foreground">
                <p>No active conversations.</p>
            </div>
        )}
      </div>
    </aside>
  );
};

export default TicketList;
