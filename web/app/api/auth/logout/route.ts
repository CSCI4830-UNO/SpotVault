import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    //why did I have the email & password here?
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
