import { signUp } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    const { data, error } = await signUp(email, password)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.log('error signing up: ', err);
    return NextResponse.json(
      { error: 'internal server error failed to sign up.' },
      { status: 500 }
    );
  }
}
