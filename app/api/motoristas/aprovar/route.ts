import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase não configurado.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id || "").trim();
    const acao = String(body.acao || "").trim().toLowerCase();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID obrigatório." },
        { status: 400 }
      );
    }

    let status = "pendente";
    let ativo = false;

    if (acao === "aprovar") {
      status = "aprovado";
      ativo = true;
    }

    if (acao === "reprovar") {
      status = "reprovado";
      ativo = false;
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("motoristas_aurora")
      .update({
        status,
        ativo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao atualizar motorista.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Motorista ${status} com sucesso.`,
        motorista: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}