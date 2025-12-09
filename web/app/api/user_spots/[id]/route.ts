import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

//get details of a specific user spot, like when someone clicks on a listing.
export async function GET(request: NextRequest, { params }: { params: { id: String } }) {
  try {
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { data, error } = await supabase.from('user_spots').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching user_spot:', err)
    return NextResponse.json(
      { error: 'User spot not found' },
      { status: 404 }
    )
  }
}
//update/modify a user_spot 
export async function PUT(request: NextRequest, { params }: { params: { id: String } }) {
  try {
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { session, error: sessionError } = await getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json()
    const { data, error } = await supabase
      .from('user_spots')
      .update({
        pictures: body.pictures,
        notes: body.notes,
        is_public: body.is_public
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error updating user_spot:', err)
    return NextResponse.json(
      { error: 'Failed to update user_spot' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { error } = await supabase.from('user_spots').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'User spot deleted' })
  } catch (err) {
    console.error('Error deleting user_spot:', err)
    return NextResponse.json(
      { error: 'Failed to delete user_spot' },
      { status: 500 }
    )
  }
}
