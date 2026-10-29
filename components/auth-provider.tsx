'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

type AuthContextType = { user: User | null; isAdmin: boolean; adminCheckError: string | null; loading: boolean; signIn: (email:string,password:string)=>Promise<void>; signUp:(name:string,email:string,password:string)=>Promise<void>; signOut:()=>Promise<void>; resetPassword:(email:string)=>Promise<void> }
const AuthContext = createContext<AuthContextType | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,setUser] = useState<User|null>(null); const [isAdmin,setIsAdmin] = useState(false); const [adminCheckError,setAdminCheckError] = useState<string|null>(null); const [loading,setLoading] = useState(true)
  useEffect(() => onAuthStateChanged(auth, async (next) => { setUser(next); setAdminCheckError(null); try { setIsAdmin(next ? (await getDoc(doc(db, 'admins', next.uid))).exists() : false) } catch (error) { console.error('Unable to verify admin access:', error); setIsAdmin(false); setAdminCheckError(error instanceof Error && 'code' in error ? String((error as { code?: string }).code) : 'unknown-error') } finally { setLoading(false) } }), [])
  const signIn = (email:string,password:string) => signInWithEmailAndPassword(auth,email,password).then(() => undefined)
  const signUp = async (name:string,email:string,password:string) => { const cred = await createUserWithEmailAndPassword(auth,email,password); await updateProfile(cred.user, { displayName: name }); await setDoc(doc(db,'users',cred.user.uid),{ name,email,role:'user',createdAt:serverTimestamp() }) }
  return <AuthContext.Provider value={{user,isAdmin,adminCheckError,loading,signIn,signUp,signOut:()=>firebaseSignOut(auth),resetPassword:(email)=>sendPasswordResetEmail(auth,email)}}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider missing'); return value }
