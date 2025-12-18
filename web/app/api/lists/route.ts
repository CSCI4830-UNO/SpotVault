import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

// GET all lists for authenticated user. 
// This only retrieves list data, not spot data. 
// To view spot data, use api/lists/[id] and pass a specific list id.
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const query_userId = request.nextUrl.searchParams.get('query_userId')

    const { data, error } = await supabase
      .from('lists')
      .select('id, name, description, created_at, updated_at, list_items(spot_id)')
      .eq('user_id', query_userId ? query_userId : user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    const full_data = data.map((list: any) => ({
      id: list.id,
      name: list.name,
      description: list.description,
      createdAt: list.created_at,
      updatedAt: list.updated_at,
      userId: list.user_id,
      spotIds: list.list_items.map((item: any) => item.spot_id), // CHANGE: Extract spotIds from nested data
    }))
    console.log(full_data)

    return NextResponse.json(full_data)
  } catch (err) {
    console.error('Error fetching lists:', err)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    )
  }
}

// POST create new list
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { error: 'List name required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description || null,
        created_at: body.created_at,
        updated_at: body.updated_at,
      })
      .select()
      .single()

    if (error) throw error
    const newlist = {
      id: data.id,
      spots: [],
      userId: data.user_id,
      name: data.name,
      description: data.description || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      spotIds: [],
    }
    return NextResponse.json(newlist, { status: 201 })
  } catch (err) {
    console.error('Error creating list:', err)
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    )
  }
}
