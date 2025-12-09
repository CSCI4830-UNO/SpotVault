//user_spot_reports
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    if (!body.user_spot_id || !body.reason) {
      return NextResponse.json(
        { error: 'user_spot_id and reason required' },
        { status: 405 }
      )
    }
    const { data, error } = await supabase
      .from('user_spot_reports')
      .insert({
        user_id: session.user.id,
        user_spot_id: body.user_spot_id,
        reason: body.reason
      })

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Something went wrong, failed to report user_spot: ', err)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
