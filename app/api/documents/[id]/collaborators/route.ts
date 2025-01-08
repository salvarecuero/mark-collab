import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

// Get collaborators for a document
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: documentId } = await params;

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, permission = "editor" } = await request.json();
  const supabase = await createClient();
  const { id: documentId } = await params;

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: documentId } = await params;
  const { collaboratorId } = await request.json();

  if (!collaboratorId) {
    return NextResponse.json(
      { error: "Collaborator ID is required" },
      { status: 400 }
    );
  }

  // Combined delete and fetch operation
  const { data: deletedCollaborator, error: deleteError } = await supabase
    .from("collaborators")
    .delete()
    .eq("id", collaboratorId)
    .eq("document_id", documentId)
    .select("user_id")
    .single();

  if (deleteError) {
    return NextResponse.json(
      { error: "Error deleting collaborator" },
      { status: 500 }
    );
  }

  // Broadcast to document channel
  await supabase.channel(`collaborators-${documentId}`).send({
    type: "broadcast",
    event: "collaborator_deleted",
    payload: {
      document_id: documentId,
      id: collaboratorId,
    },
  });

  // Broadcast to user channel using the user_id from the delete operation
  await supabase.channel(`collaborators-${deletedCollaborator?.user_id}`).send({
    type: "broadcast",
    event: "collaborator_deleted",
    payload: {
      document_id: documentId,
      user_id: deletedCollaborator.user_id,
    },
  });

  return NextResponse.json({ message: "Collaborator deleted successfully" });
}
