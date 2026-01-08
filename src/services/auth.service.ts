import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseServices } from '../app/bootstrap'

export async function registerUser(email: string, password: string, displayName: string) {
  const { auth } = getFirebaseServices()

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName })

  return userCredential.user
}

export async function loginUser(email: string, password: string) {
  const { auth } = getFirebaseServices()

  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function logoutUser() {
  const { auth } = getFirebaseServices()
  await signOut(auth)
}

export async function updateUserProfile(displayName: string, photoURL?: string) {
  const { auth } = getFirebaseServices()
  const user = auth.currentUser

  if (user) {
    await updateProfile(user, { displayName, photoURL })
  }
}