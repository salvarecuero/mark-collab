import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, content, userId } = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      content,
      owner_id: userId,
      is_public: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
