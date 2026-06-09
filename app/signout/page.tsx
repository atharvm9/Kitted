'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignOutPage() {
  useEffect(() => {
    async function doSignOut() {
      localStorage.removeItem('kitted_user')
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.replace('/onboarding')
    }
    doSignOut()
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontFamily: 'Geist, sans-serif', color: '#6c797f',
      fontSize: '14px',
    }}>
      Signing out…
    </div>
  )
}
