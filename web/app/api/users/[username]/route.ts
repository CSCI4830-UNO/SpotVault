import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const supabase = await getSupabaseClient()
    const { username } = await params;
    let query = supabase.from('users').select('*').eq('username', username);

    const { data, error } = await query.single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
