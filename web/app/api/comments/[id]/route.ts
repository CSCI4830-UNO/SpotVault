
import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { id } = params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    //verifying ownership
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (comment.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    //deleting comment
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ message: 'Comment deleted' })
  } catch (err) {
    console.error('Error deleting comment:', err)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
