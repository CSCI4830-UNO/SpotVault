import { signUp } from '@/lib/auth'
import { login } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username required' },
        { status: 400 }
      );
    }
    const { data, error } = await signUp(email, password)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    const { data: logindata, error: loginError } = await login(email, password);
    if (loginError) {
      return NextResponse.json({ error: loginError }, { status: 401 })
    }
    //create a user record to collect user info.
    if (logindata.user) {
      const { error: userError } = await supabase.from('users').insert({ id: logindata.user.id, username });
      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.log('error signing up: ', err);
    return NextResponse.json(
      { error: 'Failed to sign up due to internal server error.' },
      { status: 500 }
    );
  }
}
