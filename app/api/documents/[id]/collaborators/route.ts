import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get collaborators for a document
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id: documentId } = params;

  const { data, error } = await supabase
    .from("collaborators")
    .select(
      `
      *,
      profile:profiles!user_id(
        full_name
      )
    `
    )
    .eq("document_id", documentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

// Add a collaborator
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { email, permission = "editor" } = await request.json();
  const supabase = await createClient();
  const { id: documentId } = params;

  // Get user by email using the RPC function
  const { data: userIdData, error: userError } = await supabase
    .rpc("get_user_id_by_email", { email })
    .single<{ id: string }>();

  const userId = userIdData?.id;

  if (userError || !userId) {
    return NextResponse.json(
      { error: "User not found with this email" },
      { status: 404 }
    );
  }

  // Create the collaborator
  const { data, error } = await supabase.from("collaborators").insert({
    document_id: documentId,
    user_id: userId,
    permission_level: permission,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
