import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { User, Note, Attachment } from '@/types';
import { FIREBASE_CONFIG } from './firebase';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication services
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithGithub = async (): Promise<UserCredential> => {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

export const listenToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// User services
export const createUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: userData.createdAt || Date.now()
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  }

  return null;
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData);
};

// Note services
export const createNote = async (userId: string, noteData: Omit<Note, 'id'>): Promise<string> => {
  const notesRef = collection(db, 'users', userId, 'notes');
  const docRef = await addDoc(notesRef, {
    ...noteData,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  return docRef.id;
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  const notesRef = collection(db, 'users', userId, 'notes');
  const q = query(notesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Note, 'id'>
  }));
};

export const updateNote = async (userId: string, noteId: string, noteData: Partial<Note>): Promise<void> => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteRef, {
    ...noteData,
    updatedAt: Date.now()
  });
};

export const deleteNote = async (userId: string, noteId: string): Promise<void> => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
};

// Storage services
export const uploadAttachment = async (
  userId: string,
  noteId: string,
  file: Blob | ArrayBuffer,
  fileName: string,
  fileType: string
): Promise<string> => {
  const storageRef = ref(storage, `users/${userId}/notes/${noteId}/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteAttachment = async (
  userId: string,
  noteId: string,
  fileName: string
): Promise<void> => {
  const storageRef = ref(storage, `users/${userId}/notes/${noteId}/${fileName}`);
  await deleteObject(storageRef);
};

export default {
  auth,
  db,
  storage,
  signIn,
  signUp,
  signInWithGoogle,
  signInWithGithub,
  logOut,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  uploadAttachment,
  deleteAttachment
};
