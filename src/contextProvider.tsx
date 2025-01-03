import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCookie, removeCookie,setCookie } from 'typescript-cookie'
import axios from "axios";
import { api_endpoint } from './utils';


// Define the user type
interface User {
  id: number;
  username:string;
  role:string;
  subscription:string;
  email:string;
  password_hash:string;
  is_verify:boolean;
  created_at:string;
  updated_at:string;
}

interface AuthContextType {
  user: User | null;
  login: (email:string,password:string) => any;
  logout: () => void;
  loading: boolean; // Add loading state
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  const fetchAuthStatus = async () => {
    
    try{
      const currentCookie = getCookie("token");
      console.log("Token:", currentCookie);
      const response = await axios.get(`${api_endpoint}/api/v1/user/auth/status`, {
        headers: {
          Authorization: `${currentCookie}`,
        },
      });
      const data = response.data;
      console.log(data.user);
      setUser(data.user);

    }


    catch(err)
    {
      console.error("Failed to fetch authentication status:",err);
      // setAuthStatus(null);
    }
  
    finally {
      setLoading(false); // Set loading to false after the request is complete
    }}



useEffect(() => {
    fetchAuthStatus();
  }, []);





  
  const login = async (email:string,password:string) => {
      try {
        const response = await axios.post(`${api_endpoint}/api/v1/user/auth/login`, {
          email: email,
          password: password,
        });
        console.log("Login successful:", response.data.token);
        setCookie("token",response.data.token);
        fetchAuthStatus();

        
        return response.data
      
      } catch (error) {
        return error
      }
  };

  const logout = () => {
    removeCookie('token'); // Remove the user data from the cookie
    setUser(null);
    alert("Logged Out Successfully")
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