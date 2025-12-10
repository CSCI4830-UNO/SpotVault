import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    //now thinking user_spot had a better name-- visits, but it's too late to refactor it now...
    //using search param so we can fetch comments for a user_spot
    const userSpotId = request.nextUrl.searchParams.get('user_spot_id')
    if (!userSpotId) {
      return NextResponse.json(
        { error: 'user_spot_id query param required' },
        { status: 400 }
      )
    }
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('user_spot_id', userSpotId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

//requires authentication + a user_spot_id to comment to.
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.user_spot_id || !body.content) {
      return NextResponse.json(
        { error: 'user_spot_id and content required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_spot_id: body.user_spot_id,
        user_id: session.user.id,
        content: body.content
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error creating comment:', err)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
