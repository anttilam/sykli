import './App.css'
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './config/firebase-config'
import { LandingPage } from './pages/index';
import useAuth from './hooks/useAuth';

function App() {
  
  const user = useAuth();

  const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
    }
    catch (err) {
        console.error(err);
    }
}

  return (
    <>
      <h1>Sykli Kartoitus</h1>
      <div>
            {!user ?
                (
                    <button onClick={signInWithGoogle}>Kirjaudu sisään Google tilillä</button>
                )
                : (
                    <LandingPage />
                )
            }
        </div>
    </>
  )
}

export default App
