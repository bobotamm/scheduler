import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsyGF3SxTdKzyyAYd0GmGQ7gel05DrkJk",
  authDomain: "scheduler-1b274.firebaseapp.com",
  databaseURL: "https://scheduler-1b274-default-rtdb.firebaseio.com",
  projectId: "scheduler-1b274",
  storageBucket: "scheduler-1b274.appspot.com",
  messagingSenderId: "378067286527",
  appId: "1:378067286527:web:559b504845741d71270fca",
  measurementId: "G-MDGFK9F6MJ"
};

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (devMode) { console.log(`loading ${path}`); }
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (devMode) { console.log(val); }
      setData(transform ? transform(val) : val);
      setLoading(false);
      setError(null);
    }, (error) => {
      setData(null);
      setLoading(false);
      setError(error);
    });
  }, [path, transform]);

  return [data, loading, error];
};

export const setData = (path, value) => (
  set(ref(database, path), value)
);

// authentication
export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

// sign out
const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

// sign in/out
export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};

// export const useUserState = () => useAuthState(firebase.auth());

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);