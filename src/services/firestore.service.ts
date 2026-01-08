import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import { getFirebaseServices } from '../app/bootstrap'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: number
  preferences: {
    language: string
    mode: string
    tone: string
    theme: string
  }
}

export interface ChatHistory {
  id: string
  userId: string
  prompt: string
  response: string
  videoUrl?: string
  createdAt: number
}

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>) {
  const { db } = getFirebaseServices()
  const userRef = doc(db, 'users', uid)

  await setDoc(userRef, profile, { merge: true })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { db } = getFirebaseServices()
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  return (userSnap.data() as UserProfile) || null
}

export async function updateUserPreferences(
  uid: string,
  preferences: Partial<UserProfile['preferences']>
) {
  const { db } = getFirebaseServices()
  const userRef = doc(db, 'users', uid)

  await updateDoc(userRef, {
    'preferences': preferences,
  })
}

export async function saveChatHistory(userId: string, chat: Omit<ChatHistory, 'id'>) {
  const { db } = getFirebaseServices()
  const chatRef = collection(db, 'chats')

  const docRef = await addDoc(chatRef, {
    ...chat,
    userId,
    createdAt: Date.now(),
  })

  return docRef.id
}

export async function getChatHistory(userId: string): Promise<ChatHistory[]> {
  const { db } = getFirebaseServices()
  const chatsRef = collection(db, 'chats')
  const q = query(chatsRef, where('userId', '==', userId))

  const querySnap = await getDocs(q)
  const chats: ChatHistory[] = []

  querySnap.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() } as ChatHistory)
  })

  return chats.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteChatHistory(chatId: string) {
  const { db } = getFirebaseServices()
  const chatRef = doc(db, 'chats', chatId)

  await deleteDoc(chatRef)
}