import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
export async function DELETE(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', session.user.id).eq('following_id', username)
    if (error) throw error
    return NextResponse.json({ message: 'Unfollowed' })
  } catch (err) {
    console.error('Error unfollowing:', err)
    return NextResponse.json(
      { error: 'Failed to unfollow' },
      { status: 500 }
    )
  }
}
