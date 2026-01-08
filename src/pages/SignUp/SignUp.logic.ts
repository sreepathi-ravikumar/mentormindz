import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirebaseServices } from '../../app/bootstrap'
import { saveUserProfile } from '../../services/firestore.service'

export async function handleEmailSignup(email: string, password: string) {
  const { auth } = getFirebaseServices()
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    await saveUserProfile(userCredential.user.uid, {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: email.split('@')[0],
      createdAt: Date.now(),
      preferences: {
        language: 'English',
        mode: 'Simple Learn',
        tone: '#6366f1',
        theme: 'system',
      },
    })
    
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message.replace('Firebase: ', ''))
  }
}

export async function handleGoogleSignup() {
  const { auth } = getFirebaseServices()
  const provider = new GoogleAuthProvider()
  
  try {
    const result = await signInWithPopup(auth, provider)
    
    // Create user profile in Firestore
    await saveUserProfile(result.user.uid, {
      uid: result.user.uid,
      email: result.user.email!,
      displayName: result.user.displayName || 'User',
      photoURL: result.user.photoURL || undefined,
      createdAt: Date.now(),
      preferences: {
        language: 'English',
        mode: 'Simple Learn',
        tone: '#6366f1',
        theme: 'system',
      },
    })
    
    return result.user
  } catch (error: any) {
    throw new Error(error.message.replace('Firebase: ', ''))
  }
}
