import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

// GET single list with its items
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯

    // Get list
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (listError || !list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // Get list items (spot_ids only, not actual spots.). 
    const { data: items, error: itemsError } = await supabase
      .from('list_items')
      .select('spots(*)')
      .eq('list_id', id)

    if (itemsError) throw itemsError

    const spots = items.map(item => item.spots)

    return NextResponse.json({
      id: list.id,
      user_id: list.user_id,
      name: list.name,
      description: list.description,
      created_at: list.created_at,
      updated_at: list.updated_at,
      spots: spots
    })
  } catch (err) {
    console.error('Error fetching list:', err)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}

// PUT update list
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verify ownership
    const { data: list, error: fetchError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update list
    const { data, error } = await supabase
      .from('lists')
      .update({
        name: body.name,
        description: body.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error updating list:', err)
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    )
  }
}

// DELETE list
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const { data: list, error: fetchError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete list (cascade deletes list_items via ON DELETE CASCADE)
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ message: 'List deleted' })
  } catch (err) {
    console.error('Error deleting list:', err)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}
