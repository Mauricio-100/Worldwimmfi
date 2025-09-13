import { MessageSquare, Home, Key, Settings, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'chat', label: 'Chat IA', icon: MessageSquare },
    ...(user ? [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'tokens', label: 'Gestion Tokens', icon: Key },
      { id: 'settings', label: 'Paramètres', icon: Settings },
    ] : [
      { id: 'login', label: 'Connexion', icon: LogIn },
    ])
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">ChatIA Libre</h2>
        <p className="text-gray-400 text-sm">Interface ChatGPT-like</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">À propos</h3>
        <p className="text-gray-400 text-sm">
          Chattez avec l'IA gratuitement. Connectez-vous pour débloquer plus de fonctionnalités.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;