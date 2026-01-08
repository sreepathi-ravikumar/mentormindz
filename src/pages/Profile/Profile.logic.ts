import { saveUserProfile } from '../../services/firestore.service'

export async function updateProfileField(userId: string, field: string, value: any) {
  try {
    await saveUserProfile(userId, {
      profile: {
        [field]: value,
      },
    })
    return true
  } catch (error) {
    console.error(`Failed to update ${field}:`, error)
    return false
  }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  return /^\d{10,}$/.test(phone.replace(/\D/g, ''))
}

export function calculateAge(dob: string): number {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}
