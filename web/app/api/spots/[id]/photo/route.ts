// NOTE: seperated this one cuz tbh i'm getting kinda tired of apis and 
// i dont even know how pictures work fully yet so im not gonna try and 
// make it part of the normal update one. also from what I see in the 
// console, it seems like they just make a seperate get request for a url
// every time so i think its supposed to be like this?

import { getSupabaseClient } from "@/lib/supabase";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  //no need to get session,instead rls will check the access permissions.
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const { id } = await params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    if (!body.photoDataUrl || !body.photos) {
      return NextResponse.json(
        { error: 'photoDataUrl required. array of photourls photos required (empty is allowed).' },
        { status: 400 }
      )
    }
    //so apparently the url we get here is like a long url where the part after the comma is the image in base 64...
    const base64Data = body.photoDataUrl.split(',')[1] //this is the part in base64, the part after the comma.
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid photoDataUrl format' },
        { status: 400 }
      )
    }
    const buffer = Buffer.from(base64Data, 'base64')//you create a buffer from an encoding and a clump of data.
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid photoDataUrl format' },
        { status: 400 }
      )
    }
    const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    //and then we upload!
    const { error: uploadError } = await supabase.storage
      .from('pictures')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      })
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'photoDataUrl required.' },
        { status: 485 }//idk what that means I just need a code so I can see what goes wrong here so it doesn't just say bad request. 
      )
    }
    const { data, error } = await supabase.storage.from('pictures').createSignedUrl(fileName, 31536000) //exp in one year. project isn't gonna last that long anyway. 
    if (!data || error) throw error
    return NextResponse.json({
      url: data.signedUrl,
    }, { status: 201 })
  } catch (err) {
    console.error('failed to upload photo', err)
    return NextResponse.json(
      { error: 'failed to upload photo.' },
      { status: 500 }
    )
  }
}
//apparently I don't need to respond to the get, since it's a public url...
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = params
    //next.js is telling me to await, but the linter says its pointless. ¯\_(ツ)_/¯
    const body = await request.json()
    if (!body.photoDataUrl) {
      return NextResponse.json(
        { error: 'photoDataUrl required.' },
        { status: 400 }
      )
    }

    const filePath = body.photoUrl.split('/spot-photos/')[1]//apparently this extracts the filepath from the url, and then we just 

    // Delete from storage
    const { error: pathError } = await supabase.storage
      .from('spot-photos')
      .remove([filePath])
    if (pathError) throw pathError
    const { error: deleteError } = await supabase.storage
      .from('spot-photos')
      .remove([filePath])
    if (deleteError) throw deleteError
    return NextResponse.json({ message: 'Photo deleted' })
  } catch (err) {
    console.error('failed to delete photo', err)
    return NextResponse.json(
      { error: 'failed to delete photo.' },
      { status: 500 }
    )
  }
}

