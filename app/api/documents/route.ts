import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, content, userId } = await request.json();
  const supabase = await createClient();

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .insert({
      title,
      content,
      owner_id: userId,
      is_public: false,
    })
    .select()
    .single();

  if (documentError) {
    return NextResponse.json({ error: documentError.message }, { status: 400 });
  }

  const { error: collaboratorError } = await supabase
    .from("collaborators")
    .insert({
      document_id: document.id,
      user_id: userId,
      permission_level: "author",
    });

  if (collaboratorError) {
    // Rollback document creation
    await supabase.from("documents").delete().eq("id", document.id);
    return NextResponse.json(
      { error: collaboratorError.message },
      { status: 400 }
    );
  }

  return NextResponse.json(document);
}
