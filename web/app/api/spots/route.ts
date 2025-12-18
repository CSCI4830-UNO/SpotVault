import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import transformSpotResponse from '@/lib/api'

//get all spots + user_spot data for a particular user
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    //
    //last time I just put everything into seperate routes. now i know how dumb that was yay!

    const browse = request.nextUrl.searchParams.get('browse') === 'true'          //public spots only
    const userId = request.nextUrl.searchParams.get('user_id')                    //spots by a specific user
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100')    //pagination limit
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')    //pagination limit

    let query = supabase
      .from('spots')
      .select('*')
      .or(`is_public.eq.true,creator_id.eq.${user.id || 'null'}`)

    // Browse: all public spots
    if (browse) {
      query = query.eq('is_public', true)
    }

    // Filter by creator
    if (userId) {
      query = query.eq('creator_id', userId)
    }

    const { data: spots, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Aggregate with user_spots (most recent accessible one, though there should only be one)
    const aggregated = await Promise.all(
      spots.map(async (spot) => {
        const { data: userSpots } = await supabase
          .from('user_spots')
          .select('*')
          .eq('spot_id', spot.spot_id)
          .or(`is_public.eq.true,user_id.eq.${user.id || 'null'}`)
          .order('created_at', { ascending: false })
          .limit(1)

        return transformSpotResponse(spot, userSpots?.[0] || null)
      })
    )

    return NextResponse.json(aggregated)
  } catch (err) {
    console.error('Error fetching spots:', err)
    return NextResponse.json(
      { error: 'Failed to fetch spots' },
      { status: 500 }
    )
  }
}

//creates a new spot
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json();
    //basic info
    if (!body.longitude || !body.latitude || !body.name) {
      return NextResponse.json(
        { error: 'longtitude, latitude and name required' },
        { status: 400 }
      );
    }
    //create spot& then userspot with the same id. distribute iformation.
    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .insert({
        creator_id: user.id,
        longitude: body.longitude,
        latitude: body.latitude,
        name: body.name,
        is_public: body.is_public || false,
        tags: body.tags || [],
      })
      .select('*')
      .single();
    if (spotError) throw spotError
    //now the related user_spot
    const { data: userSpot, error: userSpotError } = await supabase
      .from('user_spots')
      .insert({
        user_id: user.id,
        spot_id: spot.spot_id,
        notes: body.description || null,
        pictures: body.photos || null,
        is_public: body.is_public || false,
      })
      .select('*')
      .single()
    if (userSpotError) throw userSpotError
    //combine the two and send informtion. no comments in this one, only used to update.
    return NextResponse.json(
      transformSpotResponse(spot, userSpot, []),
      { status: 201 }
    )
  } catch (err) {
    console.error('Error creating spot:', err);
    return NextResponse.json(
      { error: 'Failed to create spot' },
      { status: 500 }
    );
  }
}

