import { LogOut, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">ChatIA Libre</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{user.name}</span>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Tokens: {user.tokens || 0}
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </>
        ) : (
          <div className="text-gray-500">Mode Invité</div>
        )}
      </div>
    </header>
  );
};

export default Header;