import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

//get all user_spots for a user. use user parameter to get user_spots for a speific user or spot
export async function GET(request: NextRequest) {
  try {
    // NOTE: sometimes you want to get another user, and sometimes you'll randomly go to a user's page, so 
    // I left this as query based instead of session based. rls should take care of the permissions.
    // other search param is for when you click on a spot.
    const userId = request.nextUrl.searchParams.get('user_id')
    const spotId = request.nextUrl.searchParams.get('spot_id')
    let query = supabase.from('user_spots').select('*')
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (spotId) {
      query = query.eq('spot_id', spotId)
    }
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error fetching user_spots:', err)
    return NextResponse.json(
      { error: 'Failed to fetch user_spots' },
      { status: 500 }
    )
  }
}

//create new user_spot. requires spot_id
export async function POST(request: NextRequest) {
  try {
    const { session, error: sessionError } = await getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json()
    if (!body.spot_id) {
      return NextResponse.json({ error: 'spot_id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_spots')
      .insert({
        user_id: session.user.id,
        spot_id: body.spot_id,
        pictures: body.pictures || null,
        notes: body.notes || null,
        is_public: body.is_public || false
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error creating user_spot:', err)
    return NextResponse.json(
      { error: 'Failed to create user_spot' },
      { status: 500 }
    )
  }
}
