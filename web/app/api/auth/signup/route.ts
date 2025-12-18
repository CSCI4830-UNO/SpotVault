import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'
import { userInfo } from 'os';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username required' },
        { status: 400 }
      );
    }
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    const { data: logindata, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      return NextResponse.json({ error: loginError }, { status: 401 })
    }
    if (!logindata.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }
    //create a user record to collect user info.
    const { error: userError } = await supabase.from('users').insert({ id: logindata.user.id, username });
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .insert({
        user_id: logindata.user.id,
        name: 'Favorites',
        description: 'For your favorite spots!',
      })
      .select('id')
      .single()

    if (!listData || listError) {
      throw listError
    }

    // Attach favorites list to user
    const { error: updateError } = await supabase
      .from('users')
      .update({ favorites_list_id: listData.id })
      .eq('id', logindata.user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      user: {
        id: logindata.user.id,
        username: username,
        favoriteListId: listData.id,
      }
    }, { status: 200 });
  } catch (err) {
    console.error('error signing up:', err)
    return NextResponse.json(
      { error: 'Failed to sign up due to internal server error.' },
      { status: 500 }
    )
  }
}
