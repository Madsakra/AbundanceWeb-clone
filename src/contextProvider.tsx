import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

// Define the user type
interface User {
  id: string;
  email: string;
  role?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean; // Add loading state
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state



useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after checking the cookie
  }, []);

  const login = (user: User) => {
    Cookies.set('user', JSON.stringify(user)); // Store the user data in a cookie
    setUser(user);
  };

  const logout = () => {
    Cookies.remove('user'); // Remove the user data from the cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};