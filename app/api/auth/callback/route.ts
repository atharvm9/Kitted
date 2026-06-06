import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(`${origin}/onboarding?error=no_code`)
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/onboarding?error=session`)
  }
  const user = data.session.user
  const params = new URLSearchParams({
    name: user.user_metadata?.full_name ?? user.email ?? '',
    email: user.email ?? '',
    avatar: user.user_metadata?.avatar_url ?? '',
  })
  return NextResponse.redirect(`${origin}/auth-bridge?${params}`)
}
