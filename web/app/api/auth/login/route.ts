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
    if (!data || error) {
      return NextResponse.json(
        { error: error?.message ?? 'Invalid login credentials' },
        { status: 401 }
      );
    }
    const { data: userInfo, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    if (userError || !userInfo) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: userInfo.id,
        username: userInfo.username,
        favoriteListId: userInfo.favorites_list_id,
      }
    }, { status: 200 });
  } catch (err) {
    console.log('error getting spots: ', err);
    return NextResponse.json(
      { error: 'Internal server error. failed to fetch spots.' },
      { status: 500 }
    );
  }
}
