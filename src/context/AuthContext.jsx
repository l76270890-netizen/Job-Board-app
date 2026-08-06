import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, storage } from "../firebase"; 

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, name, role = "jobseeker") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (name) await updateProfile(user, { displayName: name });
    
    const userRef = doc(db, "users", user.uid);
    const newUserData = {
      uid: user.uid,
      name: name || "",
      email: user.email,
      role: role,
      createdAt: serverTimestamp()
    };
    await setDoc(userRef, newUserData);
    setUserData(newUserData);
    return userCredential;
  };

  const login = async (email, password, role = "jobseeker") => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { role: role }); // update role on login
    
    const snap = await getDoc(userRef);
    setUserData(snap.data());
    return userCredential;
  };

  const loginWithGoogle = async (role = "jobseeker") => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    
    if(!snap.exists()){
      const newUserData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: role,
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, newUserData);
      setUserData(newUserData);
    } else {
      await updateDoc(userRef, { role: role });
      const updatedSnap = await getDoc(userRef);
      setUserData(updatedSnap.data());
    }
    return result;
  }
  
  const logout = () => signOut(auth);

  const updateUserProfile = async (file) => {
    if (!currentUser || !file) return;
    const storageRef = ref(storage, `profilePics/${currentUser.uid}`);
    const snap = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snap.ref);
    await updateProfile(currentUser, { photoURL });
    setCurrentUser({ ...currentUser, photoURL }); 
    
    await setDoc(doc(db, "users", currentUser.uid), { photoURL }, { merge: true });
    setUserData(prev => ({...prev, photoURL}));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => { 
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setUserData({ 
            uid: user.uid, 
            name: user.displayName || "", 
            email: user.email, 
            role: "jobseeker" 
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = { currentUser, userData, signup, login, loginWithGoogle, logout, updateUserProfile }; 

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
