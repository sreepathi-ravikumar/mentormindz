import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirebaseServices } from '../../app/bootstrap'

export async function handleEmailLogin(email: string, password: string) {
  const { auth } = getFirebaseServices()
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message.replace('Firebase: ', ''))
  }
}

export async function handleGoogleLogin() {
  const { auth } = getFirebaseServices()
  const provider = new GoogleAuthProvider()
  
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error: any) {
    throw new Error(error.message.replace('Firebase: ', ''))
  }
}
