import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EmpresaPayload = {
  tipo_empresa?: string;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  responsavel?: string;
  cpf_responsavel?: string;
  telefone?: string;
  email?: string;
  site?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
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
      .from("empresas_aurora")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao listar empresas.",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Empresas listadas com sucesso.",
        empresas: data || [],
        total: Array.isArray(data) ? data.length : 0,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao listar empresas.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmpresaPayload;

    const payload = {
      tipo_empresa: limparTexto(body.tipo_empresa),
      cnpj: limparDocumento(body.cnpj || ""),
      razao_social: limparTexto(body.razao_social),
      nome_fantasia: limparTexto(body.nome_fantasia),
      inscricao_estadual: limparTexto(body.inscricao_estadual),
      responsavel: limparTexto(body.responsavel),
      cpf_responsavel: limparDocumento(body.cpf_responsavel || ""),
      telefone: limparDocumento(body.telefone || ""),
      email: limparTexto(body.email),
      site: limparTexto(body.site),
      cep: limparDocumento(body.cep || ""),
      logradouro: limparTexto(body.logradouro),
      numero: limparTexto(body.numero),
      complemento: limparTexto(body.complemento),
      bairro: limparTexto(body.bairro),
      cidade: limparTexto(body.cidade),
      estado: limparTexto(body.estado).toUpperCase().slice(0, 2),
      observacoes: limparTexto(body.observacoes),
    };

    if (!payload.razao_social) {
      return NextResponse.json(
        {
          success: false,
          message: "Razão social é obrigatória.",
        },
        { status: 400 },
      );
    }

    if (payload.cnpj.length !== 14) {
      return NextResponse.json(
        {
          success: false,
          message: "CNPJ inválido. Informe 14 números.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existente, error: erroBusca } = await supabase
      .from("empresas_aurora")
      .select("id, cnpj")
      .eq("cnpj", payload.cnpj)
      .maybeSingle();

    if (erroBusca) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao validar CNPJ existente.",
          error: erroBusca.message,
        },
        { status: 500 },
      );
    }

    if (existente) {
      return NextResponse.json(
        {
          success: false,
          message: "Já existe empresa cadastrada com este CNPJ.",
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("empresas_aurora")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao salvar empresa.",
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
        message: "Empresa salva com sucesso.",
        empresa: data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao salvar empresa.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 },
    );
  }
}

