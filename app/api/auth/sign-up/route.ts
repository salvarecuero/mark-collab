import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json();
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const {
    error: authError,
    data: { user },
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { error: dbError } = await supabase.from("profiles").insert({
    id: user?.id,
    full_name: fullName,
  });

  if (dbError) {
    await supabase.auth.admin.deleteUser(user?.id || "");
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Thanks for signing up! Please check your email for verification.",
  });
}
