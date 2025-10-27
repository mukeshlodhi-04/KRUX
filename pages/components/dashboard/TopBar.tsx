
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AppContext';
import { LogOut, Bell, UserCircle } from 'lucide-react';
import type { Agent } from '../../../types';

interface TopBarProps {
  agent: Agent | null;
}

const TopBar: React.FC<TopBarProps> = ({ agent }) => {
  const navigate = useNavigate();
  const { authDispatch } = useAuth();

  const handleLogout = () => {
    authDispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border flex-shrink-0">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary dark:text-dark-primary">Support Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground rounded-full hover:bg-accent dark:hover:bg-dark-accent">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
            <UserCircle size={24} />
            <span className="font-semibold">{agent?.name}</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground rounded-full hover:bg-accent dark:hover:bg-dark-accent">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
