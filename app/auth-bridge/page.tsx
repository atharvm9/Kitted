'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Bridge() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const name = params.get('name') ?? ''
    const email = params.get('email') ?? ''
    const avatar = params.get('avatar') ?? ''
    localStorage.setItem('kitted_user', JSON.stringify({
      name,
      email,
      avatar,
      provider: 'google',
      createdAt: Date.now(),
    }))
    router.replace('/boms')
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontFamily: 'Geist, sans-serif', color: '#6c797f',
      fontSize: '14px',
    }}>
      Signing you in…
    </div>
  )
}

export default function AuthBridgePage() {
  return (
    <Suspense>
      <Bridge />
    </Suspense>
  )
}
