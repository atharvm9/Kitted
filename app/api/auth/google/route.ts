import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/api/auth/callback` },
  })
  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/onboarding?error=oauth_init`)
  }
  return NextResponse.redirect(data.url)
}
