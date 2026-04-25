import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, payment_reference, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("am_financial")
      .update({
        repass_status: "repassed",
        driver_repassed_at: new Date().toISOString(),
        payment_reference: payment_reference || null,
        payment_notes: notes || "Repasse confirmado ao motorista.",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Repasse marcado como realizado ao motorista.",
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro inesperado ao marcar repasse." },
      { status: 500 }
    );
  }
}
