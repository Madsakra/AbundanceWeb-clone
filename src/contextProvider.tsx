import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,User } from 'firebase/auth';
import { auth } from '@/firebase-config';




interface AuthContextType {
  user: User | null
  login: (email:string,password:string) => any;
  logout: () => void;
  loading: boolean; // Add loading state
  forcedLogged:()=>void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  
  const login = async (email:string,password:string) => {
      try {

        const userCredentials = await signInWithEmailAndPassword(auth,email,password);
        console.log(userCredentials.user);

        
        setUser(userCredentials.user)

      
      } catch (error) {
          alert(error);
      }
  };

 
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    alert("Logged Out Successfully");
  };

  const forcedLogged = async()=>{
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout ,loading , forcedLogged}}>
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