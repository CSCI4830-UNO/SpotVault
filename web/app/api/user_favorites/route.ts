import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id query param required' },
        { status: 400 }
      )
    }
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*, spots(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error fetching favorites:', err)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.spot_id) {
      return NextResponse.json({ error: 'spot_id required' }, { status: 400 })
    }
    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .select('spot_id, is_public, creator_id')
      .eq('spot_id', body.spot_id)
      .single()

    if (spotError || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }
    //all of this is taken care of by rls. in actuality I just screwed my testcases so I didnt realize that it was fine anyways, but here we are.
    if (!spot.is_public && spot.creator_id !== session.user.id) {
      console.log("\n\n\n\ninaccessible spot accessed\n\n\n\n")
      return NextResponse.json(
        { error: 'Cannot favorite inaccessible spot' },
        { status: 403 }
      )
    }
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: session.user.id,
        spot_id: body.spot_id
      }).select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error creating favorite:', err)
    return NextResponse.json(
      { error: 'Failed to create favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.spot_id) {
      return NextResponse.json({ error: 'spot_id required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('spot_id', body.spot_id)

    if (error) throw error
    return NextResponse.json({ message: 'Favorite deleted' })
  } catch (err) {
    console.error('Error deleting favorite:', err)
    return NextResponse.json(
      { error: 'Failed to delete favorite' },
      { status: 500 }
    )
  }
}
