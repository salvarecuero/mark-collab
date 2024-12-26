import { createClient } from "@/lib/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/user/reset-password`,
  });

  if (error) {
    return NextResponse.json({ ...error });
  }

  return NextResponse.json({
    message: "Check your email for a link to reset your password.",
  });
}
