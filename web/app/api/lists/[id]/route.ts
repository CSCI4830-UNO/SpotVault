import transformSpotResponse from '@/lib/api';
import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server'

// GET single list with its items
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const userId = request.nextUrl.searchParams.get('user_id')
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const { data: listInfo, error: listError } = await supabase
      .from('lists')
      .select('id, user_id, name, description, created_at, updated_at')
      .eq('user_id', userId ? userId : user.id)
      .eq('id', id)
      .single()

    if (!listInfo || listError) {
      console.log(listError)
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }
    // Get list_items (link to spot) for the list. 
    const { data: listItems, error: listitemsError } = await supabase
      .from('list_items')
      .select('spots(spot_id, creator_id, longitude, latitude, name, is_public, created_at, tags, description )')
      .eq('list_id', id)
    if (listitemsError) throw listitemsError
    const spotIds = listItems.map(item => item.spots.spot_id)
    // now I have the ids I need the user_spots that match both the ids, and the user_spot
    const { data: user_spots, error: user_spotsError } = await supabase
      .from('user_spots')
      .select('*')
      .in('spot_id', spotIds)
      .eq('user_id', userId ? userId : user.id)
    console.log(user_spots)
    if (user_spotsError) throw user_spotsError
    const spotsWithUserData = listItems.map(listItem => {
      const userSpot = user_spots.find(us => us.spot_id === listItem.spots.spot_id)
      return transformSpotResponse(listItem.spots, userSpot, [])
    })
    console.log(spotsWithUserData)
    console.log("wow!")
    const fullList = {
      id: listInfo.id,
      name: listInfo.name,
      description: listInfo.description,
      spotIds: spotIds,
      createdAt: listInfo.created_at,
      updatedAt: listInfo.updated_at,
      userId: listInfo.user_id,
      spots: spotsWithUserData,
    }
    return NextResponse.json(fullList)
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
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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

    if (list.user_id !== user.id) {
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
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Delete list (cascade deletes list_items via ON DELETE CASCADE)
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('user_id', user.id)
      .eq('id', id)

    if (error) {

      return NextResponse.json({ error: 'List not found.' }, { status: 401 })
    }
    return NextResponse.json({ message: 'List deleted' })
  } catch (err) {
    console.error('Error deleting list:', err)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}
