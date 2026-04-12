import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MotoristaPayload = {
  nome?: string;
  cpf?: string;
  cnh?: string;
  telefone?: string;
  email?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
  foto_url?: string;
};

function limparDocumento(valor: string) {
  return String(valor || "").replace(/\D/g, "");
}

function limparTexto(valor: unknown) {
  return String(valor || "").trim();
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Variáveis do Supabase ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("motoristas_aurora")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao buscar motorista.",
          error: error.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Motorista não encontrado.",
          motorista: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Motorista carregado com sucesso.",
        motorista: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao buscar motorista.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as MotoristaPayload;

    const payload = {
      nome: limparTexto(body.nome),
      cnh: limparTexto(body.cnh),
      telefone: limparDocumento(body.telefone || ""),
      email: limparTexto(body.email),
      cep: limparDocumento(body.cep || ""),
      logradouro: limparTexto(body.logradouro),
      numero: limparTexto(body.numero),
      complemento: limparTexto(body.complemento),
      bairro: limparTexto(body.bairro),
      cidade: limparTexto(body.cidade),
      estado: limparTexto(body.estado).toUpperCase().slice(0, 2),
      observacoes: limparTexto(body.observacoes),
      foto_url: limparTexto(body.foto_url),
    };

    if (!payload.nome) {
      return NextResponse.json(
        {
          success: false,
          message: "Nome é obrigatório.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("motoristas_aurora")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao atualizar motorista.",
          error: error.message,
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Motorista não encontrado para atualização.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Motorista atualizado com sucesso.",
        motorista: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao atualizar motorista.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}