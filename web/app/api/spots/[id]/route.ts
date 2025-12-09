//this file contains routes that require an [id] parameter
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

//get specific spot
export async function GET(request: NextRequest, { params }: { params: { id: string } }
) {
  //no need to get session,instead rls will check the access permissions.
  try {
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯

    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .eq('spot_id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching spot:', err);
    return NextResponse.json(
      { error: 'Spot not found' },
      { status: 404 }
    );
  }
}

//update spot
export async function PUT(request: NextRequest, { params }: { params: { id: string } }
) {
  try {
    const { session, error: sessionError } = await getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const body = await request.json();


    const { data, error } = await supabase
      .from('spots')
      .update({
        name: body.name,
        is_public: body.is_public,
      })
      .eq('spot_id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error updating spot:', err);
    return NextResponse.json(
      { error: 'Failed to update spot' },
      { status: 500 }
    );
  }
}
//delete spot
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { error } = await supabase
      .from('spots')
      .delete()
      .eq('spot_id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Spot deleted' });
  } catch (err) {
    console.error('Error deleting spot:', err);
    return NextResponse.json(
      { error: 'Failed to delete spot' },
      { status: 500 }
    );
  }
}
