import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

// POST add spot to list
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: listId } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const body = await request.json()

    if (!body.spot_id) {  // Changed from user_spot_id
      return NextResponse.json(
        { error: 'spot_id required' },
        { status: 400 }
      )
    }

    // Verify list ownership
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('id', listId)
      .single()

    if (listError || !list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify spot exists and is visible to user
    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .select('spot_id')
      .eq('spot_id', body.spot_id)
      .single()

    if (spotError || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }

    // Add to list
    const { data, error } = await supabase
      .from('list_items')
      .insert({
        list_id: listId,
        spot_id: body.spot_id  // Changed from user_spot_id
      })
      .select()
      .single()

    if (error) {
      // Check if it's unique constraint (already in list). Not sure if I actually added this on the db will check later
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Spot already in list' },
        )
      }
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error adding item to list:', err)
    return NextResponse.json(
      { error: 'Failed to add item to list' },
      { status: 500 }
    )
  }
}
