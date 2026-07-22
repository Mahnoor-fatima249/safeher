import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('recording') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No recording blob provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileName = `evidence-${Date.now()}.webm`;
    const { error } = await supabaseAdmin.storage.from('sos-recordings').upload(fileName, buffer, {
      contentType: 'video/webm'
    });

    if (error) throw error;

    return NextResponse.json({ success: true, fileName });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}