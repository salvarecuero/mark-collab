import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({
      message:
        error.message === "email_not_confirmed"
          ? "Please check your email for verification."
          : error.message,
    });
  }

  return NextResponse.json({ data });
}
