import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

//gets you the people you follow.
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id required, pass as query parameter.' },
        { status: 400 }
      )
    }
    let query = supabase.from('followers').select('*').eq('follower_id', userId)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error fetching followers:', err)
    return NextResponse.json(
      { error: 'Failed to fetch followers' },
      { status: 500 }
    )
  }
}

//use this to follow someone, pass the following id in the body of the request.
export async function POST(request: NextRequest) {
  try {
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    if (!body.following_id) {
      return NextResponse.json(
        { error: 'following_id required' },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from('followers')
      .insert({
        follower_id: session.user.id,
        following_id: body.following_id
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error creating follower:', err)
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

//unfollow a user, pass id in body as following_id
export async function DELETE(request: NextRequest) {
  try {
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.following_id) {
      return NextResponse.json(
        { error: 'following_id required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', session.user.id)
      .eq('following_id', body.following_id)

    if (error) throw error
    return NextResponse.json({ message: 'Unfollowed' })
  } catch (err) {
    console.error('Error unfollowing:', err)
    return NextResponse.json(
      { error: 'Failed to unfollow' },
      { status: 500 }
    )
  }
}
