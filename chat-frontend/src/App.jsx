import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TokenManagement from './components/TokenManagement';
import { useAuth } from './hooks/useAuth';

function App() {
  const [activeView, setActiveView] = useState('chat');
  const [authView, setAuthView] = useState('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user && activeView === 'login') {
      return <Login onSwitchToRegister={() => setAuthView('register')} />;
    }
    
    if (!user && activeView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }

    switch (activeView) {
      case 'chat':
        return <ChatInterface />;
      case 'dashboard':
        return <Dashboard />;
      case 'tokens':
        return <TokenManagement />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p>Page de paramètres en construction.</p>
            </div>
          </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;