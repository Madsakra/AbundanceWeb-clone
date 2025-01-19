import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,User } from 'firebase/auth';
import { auth, db} from '@/firebase-config';
import { doc, getDoc } from 'firebase/firestore';



export type AccountDetails = {
  name:string,
  email:string,
  role:string,
  image?:string,
  certificationURL?:string,
  resumeURL?:string,

}



interface AuthContextType {
  user: User | null
  login: (email:string,password:string) => any;
  logout: () => void;
  setLoading:(load:boolean)=>void
  loading: boolean; // Add loading state
  accountDetails:AccountDetails | null;
  setAccountDetails: (acc:AccountDetails)=>void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [accountDetails,setAccountDetails] = useState<AccountDetails |null>(null)
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);

      if (user) {
      
              const docRef = doc(db, "accounts", user.uid);
              const docSnap = await getDoc(docRef);
              // check if the user is normal user
              if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setAccountDetails(docSnap.data() as AccountDetails);
            
              }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  



  const login = async (email:string,password:string) => {
      
    try {
        setLoading(true);
        const userCredentials = await signInWithEmailAndPassword(auth,email,password);
        if (userCredentials.user)
        {
          alert("Login Successful");
        }
        console.log(userCredentials.user);
        setUser(userCredentials.user)
        setLoading(false);
        return userCredentials;

   
      } catch (error) {
          alert(error);
          return false;
      }
  };

 
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAccountDetails(null);
    alert("Logout successful")
  };






  return (
    <AuthContext.Provider value={{ user, login, logout ,setLoading
    ,loading , accountDetails, setAccountDetails}}>
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