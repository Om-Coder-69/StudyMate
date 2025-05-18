
// src/app/auth/callback/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/'; // Default redirect to home

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin).toString());
    }
  }

  // return the user to an error page with instructions
  console.error('Auth callback error or no code');
  return NextResponse.redirect(new URL('/auth/login?error=Could not authenticate user', requestUrl.origin).toString());
}
