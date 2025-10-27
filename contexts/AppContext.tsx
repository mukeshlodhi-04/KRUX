
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import type { AppState, AppAction, User, Agent, Message, Ticket, TicketStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { BOT_USER } from '../constants';

const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
  chat: {
    tickets: [],
    activeTicketId: null,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: { isAuthenticated: true, user: action.payload.user } };
    case 'LOGOUT':
      return { ...state, auth: { isAuthenticated: false, user: null } };
    case 'START_CHAT': {
        const { customer, initialMessage } = action.payload;
        const existingTicket = state.chat.tickets.find(t => t.customerId === customer.id && t.status !== 'resolved');
        if (existingTicket) {
            return {
                ...state,
                chat: {
                    ...state.chat,
                    activeTicketId: existingTicket.id,
                }
            };
        }
        const newTicket: Ticket = {
            id: `ticket-${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            status: 'open',
            priority: 'medium',
            subject: `Chat with ${customer.name}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [initialMessage],
        };
        return {
            ...state,
            chat: {
                ...state.chat,
                tickets: [...state.chat.tickets, newTicket],
                activeTicketId: newTicket.id,
            }
        };
    }
    case 'SELECT_TICKET':
      return {
        ...state,
        chat: { ...state.chat, activeTicketId: action.payload.ticketId },
      };
    case 'SEND_MESSAGE': {
        const { ticketId, message } = action.payload;
        return {
            ...state,
            chat: {
                ...state.chat,
                tickets: state.chat.tickets.map(ticket => 
                    ticket.id === ticketId
                        ? { ...ticket, messages: [...ticket.messages.filter(m => !m.isTyping), message], updatedAt: Date.now() }
                        : ticket
                ),
            },
        };
    }
    case 'SET_TYPING': {
        const { ticketId, isTyping } = action.payload;
        return {
            ...state,
            chat: {
                ...state.chat,
                tickets: state.chat.tickets.map(ticket => {
                    if (ticket.id !== ticketId) return ticket;
                    
                    const newMessages = ticket.messages.filter(m => !m.isTyping);
                    if (isTyping) {
                        newMessages.push({
                            id: `typing-${Date.now()}`,
                            sender: BOT_USER,
                            text: '',
                            timestamp: Date.now(),
                            isTyping: true,
                        });
                    }
                    return { ...ticket, messages: newMessages };
                })
            }
        };
    }
    case 'UPDATE_TICKET_STATUS': {
        const { ticketId, status } = action.payload;
        return {
            ...state,
            chat: {
                ...state.chat,
                tickets: state.chat.tickets.map(ticket => 
                    ticket.id === ticketId
                        ? { ...ticket, status, updatedAt: Date.now() }
                        : ticket
                ),
            },
        };
    }
    case 'ASSIGN_AGENT': {
        const { ticketId, agentId } = action.payload;
        return {
            ...state,
            chat: {
                ...state.chat,
                tickets: state.chat.tickets.map(ticket =>
                    ticket.id === ticketId && !ticket.agentId
                        ? { ...ticket, agentId, status: 'in-progress' }
                        : ticket
                ),
            },
        };
    }
    case 'LOAD_STATE':
        return action.payload;
    default:
      return state;
  }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedState, setStoredState] = useLocalStorage<AppState>('krux-finance-app', initialState);
  const [state, dispatch] = useReducer(appReducer, storedState);
  
  useEffect(() => {
    setStoredState(state);
  }, [state, setStoredState]);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  const { state, dispatch } = useContext(AppContext);
  return { authState: state.auth, authDispatch: dispatch };
};

export const useChat = () => {
    const { state, dispatch } = useContext(AppContext);
    return { chatState: state.chat, chatDispatch: dispatch };
};
