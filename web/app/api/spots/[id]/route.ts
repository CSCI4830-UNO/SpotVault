//this file contains routes that require an [id] parameter
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import transformSpotResponse from '@/lib/api';

//get specific spot
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  //no need to get session,instead rls will check the access permissions.
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const { id } = params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    //gets the spot
    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .select('*')
      .eq('spot_id', id)
      .or(`is_public.eq.true,creator_id.eq.${user?.id || 'null'}`)
      .single();
    if (spotError || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }

    //get the user_spot relatedto the sopt.
    const { data: userSpot } = await supabase
      .from('user_spots')
      .select('*')
      .eq('spot_id', id)
      .or(`is_public.eq.true,user_id.eq.${user.id}`)//public or owner condition.
      .order('created_at', { ascending: false })
      .single()
    //got userspot

    // Get comments for the user_spot
    let comments = []
    if (userSpot) {
      const { data: commentData } = await supabase
        .from('comments')
        .select('id, content, user_id, created_at, users(username)')
        .eq('user_spot_id', userSpot.id)
        .order('created_at', { ascending: false })
      //list of comments to do with the user_spot.
      if (commentData) {
        for (let i = 0; i < commentData.length; i++) {
          const c = commentData[i]
          comments.push({
            id: c.id,
            content: c.content,
            username: c.users.username || 'Unknown',
            created_at: c.created_at,
          })
        }
      }
    }
    return NextResponse.json(transformSpotResponse(spot, userSpot, comments))
  } catch (err) {
    console.error('Error fetching spot:', err);
    return NextResponse.json(
      { error: 'Spot not found' },
      { status: 404 }
    );
  }
}

//update spot
export async function PUT(request: NextRequest, { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseClient()
    //probably should make a ote of it but supabse just keep saying these re insecure
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const body = await request.json();
    //verifying ownership
    const { data: spot, error: fetchError } = await supabase
      .from('spots')
      .select('*')
      .eq('spot_id', id)
      .single()

    if (fetchError || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }

    if (spot.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // idk whether rls isn't working or not but whatever no time so here we are.
    if (spot.is_public && body.is_public === false) {
      return NextResponse.json(
        { error: 'Cannot unpublish a public spot' },
        { status: 403 }
      )
    }

    //get the relevant userSpot (refactored version has only one userspot associated with each spot. they're a 1-1 for no reason.)
    const { data: userSpot, error: userSpotFindError } = await supabase
      .from('user_spots')
      .select('*')
      .eq('spot_id', id)
      .eq('user_id', user.id)
      .single()

    if (userSpotFindError) throw userSpotFindError

    //nnow that spot and userspot both exist. 
    //make the updateto the spot
    const { data: updatedSpot, error: updateError } = await supabase
      .from('spots')
      .update({
        name: body.name || spot.name,
        is_public: body.is_public !== undefined ? body.is_public : spot.is_public,
        tags: body.tags || spot.tags
      })
      .eq('spot_id', id)
      .select()
      .single()
    if (updateError) throw updateError


    let updatedUserSpot = userSpot
    // Update the relevant user_spot (unique pair, spot_id, user_id assumed.)
    if (userSpot) { //some of the spots from my old testcases don't one attached to them, and they were causing some errors.
      const { data: updatedUserSpot, error: userSpotUpdateError } = await supabase  // CHANGED: Capture return
        .from('user_spots')
        .update({
          notes: body.description != undefined ? body.description : userSpot.notes,
          pictures: body.photos || userSpot.pictures,
          is_public: body.is_public != undefined ? body.is_public : userSpot.is_public,
        })
        .eq('id', userSpot.id)
        .select('*')
        .single()
      if (userSpotUpdateError) throw userSpotUpdateError
    }
    return NextResponse.json(transformSpotResponse(updatedSpot, updatedUserSpot, []))
  } catch (err) {
    console.error('Error updating spot:', err);
    return NextResponse.json(
      { error: 'Failed to update spot' },
      { status: 500 }
    );
  }
}
//delete spot
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    //delete cascades, thankfully, so nothing too special here.
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .select('spot_id, creator_id',)
      .eq('spot_id', id)
      .single()

    if (spotError || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 })
    }
    if (spot.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    const { error } = await supabase
      .from('spots')
      .delete()
      .eq('spot_id', id);

    //remember, since it's delete, it cascades.
    //
    if (error) throw error;
    return NextResponse.json({ message: 'Spot deleted' });
  } catch (err) {
    console.error('Error deleting spot:', err);
    return NextResponse.json(
      { error: 'Failed to delete spot' },
      { status: 500 }
    );
  }
}
