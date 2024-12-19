import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  const { userId, permission = "read" } = await request.json();
  const { id: documentId } = await segmentData.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collaborators")
    .insert({
      document_id: documentId,
      user_id: userId,
      permission_level: permission,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ...error });
  }

  return NextResponse.json(data);
}
