import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function PUT(request: Request, segmentData: { params: Params }) {
  const { title, content, is_public } = await request.json();
  const { id: documentId } = await segmentData.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .update({ title, content, is_public })
    .eq("id", documentId)
    .select();

  if (error) {
    return NextResponse.json({ ...error });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  const { id: documentId } = await segmentData.params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    return NextResponse.json({ ...error });
  }

  return NextResponse.json({ message: "Document deleted successfully" });
}
