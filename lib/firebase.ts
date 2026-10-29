import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.apiKey || 'AIzaSyD-IdwzilbpqvunL3oasrW9kQcZCZ1Jgx8',
  authDomain: 'kazi-a68fd.firebaseapp.com',
  projectId: 'kazi-a68fd',
  storageBucket: 'kazi-a68fd.firebasestorage.app',
  messagingSenderId: '591575075549',
  appId: '1:591575075549:web:ffc182dcd1c4e7c1326934',
  measurementId: 'G-PD6GQJXH6C',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => isSupported().then((supported) => supported && getAnalytics(firebaseApp))).catch(() => undefined)
}
