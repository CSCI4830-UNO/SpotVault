//this file contains routes that require an [id] parameter
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
//get specific spot
export async function GET(request: NextRequest, { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
    const { id } = params;
    const body = await request.json();

    if (!body.longitude || !body.latitude) {
      return NextResponse.json(
        { error: 'longitude and latitude required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('spots')
      .update({
        longitude: body.longitude,
        latitude: body.latitude,
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
    const { id } = params;

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
