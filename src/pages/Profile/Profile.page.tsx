import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUserProfile, saveUserProfile } from '../../services/firestore.service'
import { GRADES, SUBJECTS } from '../../utils/constants'
import styles from './Profile.styles.module.css'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    fullName: '',
    preferredName: '',
    standard: '',
    dob: '',
    country: 'India',
    interests: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSheet, setShowSheet] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    try {
      const userProfile = await getUserProfile(user.uid)
      if (userProfile?.profile) {
        setProfile(userProfile.profile)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)

    try {
      await saveUserProfile(user.uid, {
        profile,
      })
      setTimeout(() => setSaving(false), 1000)
    } catch (error) {
      console.error('Failed to save profile:', error)
      setSaving(false)
    }
  }

  const addInterest = () => {
    const interest = pr
