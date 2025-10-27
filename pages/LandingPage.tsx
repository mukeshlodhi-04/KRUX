
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-background p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-dark-primary">
          KRUX Finance Support
        </h1>
        <p className="mt-4 text-lg text-muted-foreground dark:text-dark-muted-foreground">
          Your trusted partner in financial services.
        </p>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link to="/login/customer" className="group p-8 border border-border dark:border-dark-border rounded-lg shadow-sm hover:shadow-lg hover:border-primary dark:hover:border-dark-primary transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center text-primary dark:text-dark-primary mb-4">
            <MessageSquare size={32} />
            <h2 className="text-2xl font-semibold ml-4">Customer Chat</h2>
          </div>
          <p className="text-muted-foreground dark:text-dark-muted-foreground mb-6">
            Get instant help with your loan applications, check your status, and ask questions.
          </p>
          <div className="flex items-center text-primary dark:text-dark-primary font-medium">
            Start Conversation
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        <Link to="/login/agent" className="group p-8 border border-border dark:border-dark-border rounded-lg shadow-sm hover:shadow-lg hover:border-primary dark:hover:border-dark-primary transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center text-primary dark:text-dark-primary mb-4">
            <Shield size={32} />
            <h2 className="text-2xl font-semibold ml-4">Support Dashboard</h2>
          </div>
          <p className="text-muted-foreground dark:text-dark-muted-foreground mb-6">
            Agent portal to manage customer conversations, view tickets, and provide support.
          </p>
          <div className="flex items-center text-primary dark:text-dark-primary font-medium">
            Agent Login
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </main>
      
      <footer className="mt-16 text-center text-muted-foreground dark:text-dark-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} KRUX Finance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
