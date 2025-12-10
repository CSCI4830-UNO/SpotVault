import { getSupabaseClient } from '@/lib/supabase';
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
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.log('error getting spots: ', err);
    return NextResponse.json(
      { error: 'Internal server error. failed to fetch spots.' },
      { status: 500 }
    );
  }
}
