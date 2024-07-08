import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const useAuth = () => {
    const [user, setUser] = useState({} || null);
    
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    
    return user;
  };
   
  export default useAuth;