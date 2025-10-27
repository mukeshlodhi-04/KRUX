
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';
import { MOCK_CUSTOMERS, MOCK_AGENTS } from '../constants';
import { LogIn, ChevronLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: 'customer' | 'agent' }>();
  const navigate = useNavigate();
  const { authDispatch } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'customer' && role !== 'agent') {
        navigate('/');
    }
  }, [role, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let user = null;

    if (role === 'customer') {
      user = MOCK_CUSTOMERS.find(c => c.phone === identifier);
      if (user) {
        authDispatch({ type: 'LOGIN', payload: { user } });
        navigate('/customer-chat');
      } else {
        setError('Invalid phone number. Please use a number from the sample credentials.');
      }
    } else if (role === 'agent') {
      user = MOCK_AGENTS.find(a => a.name.toLowerCase().split(' ')[0] === identifier.toLowerCase());
      if (user) {
        authDispatch({ type: 'LOGIN', payload: { user } });
        navigate('/support-dashboard');
      } else {
        setError('Invalid username. Please use a name from the sample credentials.');
      }
    }
  };

  const isCustomer = role === 'customer';
  const title = isCustomer ? 'Customer Login' : 'Agent Login';
  const label = isCustomer ? 'Phone Number' : 'Username';
  const placeholder = isCustomer ? '+919876543210' : 'amit.kumar';
  const inputType = isCustomer ? 'tel' : 'text';

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-dark-muted p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground mb-4">
            <ChevronLeft size={16} className="mr-1"/>
            Back to Home
        </Link>
        <div className="bg-card dark:bg-dark-card p-8 rounded-lg shadow-lg border border-border dark:border-dark-border">
          <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
          <p className="text-center text-muted-foreground dark:text-dark-muted-foreground mb-6">Welcome to KRUX Finance</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium mb-2">
                {label}
              </label>
              <input
                id="identifier"
                type={inputType}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-background dark:bg-dark-background"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground py-2 px-4 rounded-md hover:bg-primary-dark dark:hover:bg-dark-primary-dark transition-colors font-semibold"
              >
                <LogIn size={18} className="mr-2"/>
                Login
              </button>
            </div>
          </form>
          <div className="mt-6 text-xs text-muted-foreground dark:text-dark-muted-foreground text-center">
            <h4 className="font-semibold mb-2">Sample Credentials:</h4>
            {isCustomer ? (
                <ul>
                    <li>Rahul: +919876543210</li>
                    <li>Priya: +919876543211</li>
                </ul>
            ) : (
                <ul>
                    <li>Agent: amit.kumar</li>
                    <li>Senior Agent: sneha.singh</li>
                </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
