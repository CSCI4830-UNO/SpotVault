import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

//requires authentication + a user_spot_id to comment to.
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.spot_id || !body.text || !body.creator_id) {
      return NextResponse.json(
        { error: 'spot_id and creator_id and text are required.' },
        { status: 400 }
      )
    }
    const { data: userSpot, error: userSpotError } = await supabase
      .from('user_spots')
      .select('id')
      .eq('spot_id', body.spot_id)
      .eq('user_id', body.creator_id)
      .single()
    if (!userSpot || userSpotError) {
      return NextResponse.json(
        { error: 'Spot not Found' },
        { status: 404 }
      )
    }
    //working spot, working user_spot.
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        user_spot_id: userSpot.id,
        user_id: user.id,
        content: body.text
      })
      .select('id, content, created_at, users(username)')
      .single()
    if (commentError) throw commentError
    return NextResponse.json({
      id: comment.id,
      text: comment.content,
      username: comment.users.username,
      createdAt: comment.created_at,
    })
  } catch (err) {
    console.error('Error creating comment:', err)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
