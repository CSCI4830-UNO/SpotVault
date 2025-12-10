import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

// DELETE remove spot from list
export async function DELETE(request: NextRequest, { params }: { params: { id: string; spot_id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: listId, spot_id: spotId } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯

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

    // Delete item
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('list_id', listId)
      .eq('spot_id', spotId)

    if (error) throw error
    return NextResponse.json({ message: 'Item removed from list' })
  } catch (err) {
    console.error('Error removing item from list:', err)
    return NextResponse.json(
      { error: 'Failed to remove item from list' },
      { status: 500 }
    )
  }
}
