import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const servicoId = body.servico_id;

    if (!servicoId) {
      return NextResponse.json(
        { success: false, message: "servico_id é obrigatório." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("servicos")
      .update({
        status_financeiro: "pago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", servicoId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Serviço marcado como pago.",
      servico: data,
    });
  } catch (error) {
    console.error("ERRO AO MARCAR SERVIÇO COMO PAGO:", error);

    return NextResponse.json(
      { success: false, message: "Erro inesperado ao marcar serviço como pago." },
      { status: 500 }
    );
  }
}
