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

    const conviteId = String(body.id || "").trim();
    const acao = String(body.acao || "").trim().toLowerCase();

    if (!conviteId) {
      return NextResponse.json(
        { success: false, message: "ID do convite é obrigatório." },
        { status: 400 }
      );
    }

    if (!["aceitar", "recusar"].includes(acao)) {
      return NextResponse.json(
        { success: false, message: "Ação inválida. Use aceitar ou recusar." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: convite, error: erroConvite } = await supabase
      .from("motorista_convites")
      .select("*")
      .eq("id", conviteId)
      .maybeSingle();

    if (erroConvite || !convite) {
      return NextResponse.json(
        {
          success: false,
          message: "Convite não encontrado.",
          error: erroConvite?.message || null,
        },
        { status: 404 }
      );
    }

    if (convite.status !== "enviado") {
      return NextResponse.json(
        {
          success: false,
          message: "Este convite não está mais disponível.",
          convite,
        },
        { status: 409 }
      );
    }

    if (acao === "recusar") {
      const { data, error } = await supabase
        .from("motorista_convites")
        .update({
          status: "recusado",
          recusado_em: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", conviteId)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao recusar convite.",
            error: error.message,
          },
          { status: 500 }
        );
      }

      await supabase
        .from("motoristas_aurora")
        .update({
          disponivel: true,
          em_servico: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", convite.motorista_id);

      return NextResponse.json(
        {
          success: true,
          message: "Convite recusado. Você continua disponível para outros chamados.",
          convite: data,
        },
        { status: 200 }
      );
    }

    const { data: motorista, error: erroMotorista } = await supabase
      .from("motoristas_aurora")
      .select("id, nome, status, ativo, disponivel, em_servico")
      .eq("id", convite.motorista_id)
      .maybeSingle();

    if (erroMotorista || !motorista) {
      return NextResponse.json(
        {
          success: false,
          message: "Motorista não encontrado.",
          error: erroMotorista?.message || null,
        },
        { status: 404 }
      );
    }

    if (!motorista.ativo || motorista.status !== "aprovado") {
      return NextResponse.json(
        {
          success: false,
          message: "Motorista ainda não está aprovado para aceitar serviços.",
        },
        { status: 403 }
      );
    }

    if (motorista.em_servico || !motorista.disponivel) {
      return NextResponse.json(
        {
          success: false,
          message: "Motorista já está em serviço ou indisponível.",
        },
        { status: 409 }
      );
    }

    const { data: aceite, error: erroAceite } = await supabase
      .from("motorista_convites")
      .update({
        status: "aceito",
        aceito_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conviteId)
      .eq("status", "enviado")
      .select("*")
      .single();

    if (erroAceite) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao aceitar convite.",
          error: erroAceite.message,
        },
        { status: 500 }
      );
    }

    await supabase
      .from("motorista_convites")
      .update({
        status: "cancelado",
        updated_at: new Date().toISOString(),
      })
      .eq("service_id", convite.service_id)
      .neq("id", conviteId)
      .eq("status", "enviado");

    await supabase
      .from("motoristas_aurora")
      .update({
        disponivel: false,
        em_servico: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", convite.motorista_id);

    return NextResponse.json(
      {
        success: true,
        message: "Serviço aceito com sucesso. Os demais convites foram encerrados.",
        convite: aceite,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao responder convite.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}