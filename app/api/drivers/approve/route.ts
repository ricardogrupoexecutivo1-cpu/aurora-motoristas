import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: Request) {
  const body = await request.json();

  const { id, status, notes, admin } = body;

  if (!id || !status) {
    return NextResponse.json(
      { ok: false, message: "Dados inválidos." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("am_drivers")
    .update({
      security_status: status,
      security_notes: notes,
      approved_by: admin || "admin",
      approved_at: new Date().toISOString(),
      status: status === "aprovado" ? "aprovado" : "em_analise",
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, driver: data });
}