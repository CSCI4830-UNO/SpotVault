//this file defines routes that require no parameters
import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

//gets all the spots visible to the user.
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('spots')
      .select('*')
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.log('error fetching spots: ', err);
    return NextResponse.json(
      { error: 'Internal server error. failed to fetch spots.' },
      { status: 500 }
    );
  }
}

//creates a new spot
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )

    }
    const body = await request.json();

    if (!body.longitude || !body.latitude || !body.name) {
      return NextResponse.json(
        { error: 'longtitude, latitude and name required' },
        { status: 400 }
      );
    }
    //create spot
    const { data, error } = await supabase
      .from('spots')
      .insert({
        creator_id: session.user.id,
        longitude: body.longitude,
        latitude: body.latitude,
        name: body.name,
        is_public: body.is_public || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error creating spot:', err);
    return NextResponse.json(
      { error: 'Failed to create spot' },
      { status: 500 }
    );
  }
}
