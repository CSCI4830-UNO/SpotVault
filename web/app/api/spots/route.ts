//this file defines routes that require no parameters
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

//gets all the spots.
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('spots')
      .select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (err) {
    console.log('error getting spots: ', err);
    return NextResponse.json(
      { error: 'Internal server error. failed to fetch spots.' },
      { status: 500 }
    );
  }
}
//creates a new spot. adding users in a bit.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.longitude || !body.latitude) {
      return NextResponse.json(
        { error: 'longitude and latitude required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('spots')
      .insert({
        longitude: body.longitude,
        latitude: body.latitude,
        comments: body.comments || []
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
//logs in the current user.
//logs out the current user.
//posts a new spot with the current user
