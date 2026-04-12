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

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("motoristas_aurora")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao listar motoristas.",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Motoristas listados com sucesso.",
        motoristas: data || [],
        total: Array.isArray(data) ? data.length : 0,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao listar motoristas.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MotoristaPayload;

    const payload = {
      nome: limparTexto(body.nome),
      cpf: limparDocumento(body.cpf || ""),
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

    if (payload.cpf.length !== 11) {
      return NextResponse.json(
        {
          success: false,
          message: "CPF inválido. Informe 11 números.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existente, error: erroBusca } = await supabase
      .from("motoristas_aurora")
      .select("id, cpf")
      .eq("cpf", payload.cpf)
      .maybeSingle();

    if (erroBusca) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao validar CPF existente.",
          error: erroBusca.message,
        },
        { status: 500 },
      );
    }

    if (existente) {
      return NextResponse.json(
        {
          success: false,
          message: "Já existe motorista cadastrado com este CPF.",
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("motoristas_aurora")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao salvar motorista.",
          error: error.message,
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Motorista salvo com sucesso.",
        motorista: data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao salvar motorista.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}