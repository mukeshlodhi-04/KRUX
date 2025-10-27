
export type UserRole = 'customer' | 'agent' | 'bot';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface Agent extends User {
  role: 'agent';
  status: 'online' | 'offline' | 'busy';
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: User;
  isTyping?: boolean;
}

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  agentId?: string;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | Agent | null;
}

export interface ChatState {
  tickets: Ticket[];
  activeTicketId: string | null;
}

export interface AppState {
  auth: AuthState;
  chat: ChatState;
}

export type AppAction =
  | { type: 'LOGIN'; payload: { user: User | Agent } }
  | { type: 'LOGOUT' }
  | { type: 'START_CHAT'; payload: { customer: User; initialMessage: Message } }
  | { type: 'SELECT_TICKET'; payload: { ticketId: string } }
  | { type: 'SEND_MESSAGE'; payload: { ticketId: string; message: Message } }
  | { type: 'UPDATE_TICKET_STATUS'; payload: { ticketId: string; status: TicketStatus } }
  | { type: 'ASSIGN_AGENT'; payload: { ticketId: string; agentId: string } }
  | { type: 'SET_TYPING'; payload: { ticketId: string; isTyping: boolean } }
  | { type: 'LOAD_STATE'; payload: AppState };

