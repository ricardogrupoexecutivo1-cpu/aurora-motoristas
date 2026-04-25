import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, payment_method, payment_reference, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("am_financial")
      .update({
        payment_status: "received",
        platform_received_at: new Date().toISOString(),
        payment_method: payment_method || "PIX",
        payment_reference: payment_reference || null,
        payment_notes: notes || "Recebimento confirmado pela Aurora",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Pagamento marcado como recebido pela Aurora.",
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro inesperado ao marcar recebimento." },
      { status: 500 }
    );
  }
}
