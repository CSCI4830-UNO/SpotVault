//this file defines some api routes using the supabase client
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

//gets all the spots.
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from('spots').select('user_spots(id, user_id, pictures, notes, created_at, updated_at)');
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.log('error getting spots: ', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
//logs in the current user.
//logs out the current user.
//posts a new spot with the current user
