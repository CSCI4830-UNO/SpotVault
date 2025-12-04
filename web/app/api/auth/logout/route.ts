import { logout } from '@/lib/auth'
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
    const { error } = await logout()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ message: "logged out" }, { status: 200 });
  } catch (err) {
    console.log('failed to log out: ', err);
    return NextResponse.json(
      { error: 'failed to log out' },
      { status: 500 }
    );
  }
}
