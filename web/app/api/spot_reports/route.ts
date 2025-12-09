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
    if (!body.spot_id || !body.reason) {
      return NextResponse.json(
        { error: 'spot_id and reason required' },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from('spot_reports')
      .insert({
        user_id: session.user.id,
        spot_id: body.spot_id,
        reason: body.reason
      })

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error reporting spot:', err)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
