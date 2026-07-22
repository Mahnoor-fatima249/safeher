import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  try {
    const { mapLink } = await req.json();
    
    // Initialize server-side Supabase client to fetch caller's emergency contacts
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: contacts } = await supabaseAdmin.from('emergency_contacts').select('phone_number');

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ success: false, message: 'No emergency contacts found.' });
    }

    const messageBody = `EMERGENCY ALERT: I am in danger! My live tracking location: ${mapLink}`;

    // Loop through saved contacts and send automated Twilio SMS
    const smsPromises = contacts.map((contact) => 
      client.messages.create({
        body: messageBody,
        from: twilioPhone,
        to: contact.phone_number
      })
    );

    await Promise.all(smsPromises);

    return NextResponse.json({ success: true, dispatched: contacts.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}