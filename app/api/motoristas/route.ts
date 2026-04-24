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
  endereco?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
  foto_url?: string;
  ativo?: boolean;
};

function limparDocumento(valor: string) {
  return String(valor || "").replace(/\D/g, "");
}

function limparTexto(valor: unknown) {
  return String(valor || "").trim();
}

function normalizarBoolean(valor: unknown, padrao = true) {
  if (typeof valor === "boolean") return valor;

  if (typeof valor === "string") {
    const texto = valor.trim().toLowerCase();

    if (["true", "1", "sim", "yes"].includes(texto)) return true;
    if (["false", "0", "nao", "nÃ£o", "no"].includes(texto)) return false;
  }

  return padrao;
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "VariÃ¡veis do Supabase ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isAdminScope(request: Request) {
  const { searchParams } = new URL(request.url);

  const scope = (searchParams.get("scope") || "").trim().toLowerCase();
  const admin = (searchParams.get("admin") || "").trim().toLowerCase();
  const modo = (searchParams.get("modo") || "").trim().toLowerCase();

  return (
    scope === "admin" ||
    admin === "1" ||
    admin === "true" ||
    modo === "admin"
  );
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const adminScope = isAdminScope(request);

    let query = supabase
      .from("motoristas_aurora")
      .select("*")
      .order("created_at", { ascending: false });

    if (!adminScope) {
      query = query.eq("ativo", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao listar motoristas.",
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
        message: adminScope
          ? "Motoristas listados com sucesso em modo admin."
          : "Motoristas ativos listados com sucesso.",
        motoristas: data || [],
        total: Array.isArray(data) ? data.length : 0,
        scope: adminScope ? "admin" : "operacao",
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

    const cpfLimpo = limparDocumento(body.cpf || "");
    const telefoneLimpo = limparDocumento(body.telefone || "");
    const cepLimpo = limparDocumento(body.cep || "");

    const enderecoFinal = limparTexto(body.endereco || body.logradouro);
    const ativoFinal = normalizarBoolean(body.ativo, true);

    if (!limparTexto(body.nome)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nome Ã© obrigatÃ³rio.",
        },
        { status: 400 },
      );
    }

    if (!telefoneLimpo) {
      return NextResponse.json(
        {
          success: false,
          message: "Telefone Ã© obrigatÃ³rio.",
        },
        { status: 400 },
      );
    }

    if (cpfLimpo && cpfLimpo.length !== 11) {
      return NextResponse.json(
        {
          success: false,
          message: "CPF invÃ¡lido. Informe 11 nÃºmeros ou deixe em branco.",
        },
        { status: 400 },
      );
    }

    if (cepLimpo && cepLimpo.length !== 8) {
      return NextResponse.json(
        {
          success: false,
          message: "CEP invÃ¡lido. Informe 8 nÃºmeros ou deixe em branco.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    if (cpfLimpo) {
      const { data: existente, error: erroBusca } = await supabase
        .from("motoristas_aurora")
        .select("id, cpf")
        .eq("cpf", cpfLimpo)
        .maybeSingle();

      if (erroBusca) {
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao validar CPF existente.",
            error: erroBusca.message,
            details: erroBusca.details || null,
            hint: erroBusca.hint || null,
            code: erroBusca.code || null,
          },
          { status: 500 },
        );
      }

      if (existente) {
        return NextResponse.json(
          {
            success: false,
            message: "JÃ¡ existe motorista cadastrado com este CPF.",
          },
          { status: 409 },
        );
      }
    }

    const payload = {
      nome: limparTexto(body.nome),
      cpf: cpfLimpo || null,
      cnh: limparTexto(body.cnh) || null,
      telefone: telefoneLimpo,
      email: limparTexto(body.email) || null,
      cep: cepLimpo || null,
      endereco: enderecoFinal || null,
      logradouro: enderecoFinal || null,
      numero: limparTexto(body.numero) || null,
      complemento: limparTexto(body.complemento) || null,
      bairro: limparTexto(body.bairro) || null,
      cidade: limparTexto(body.cidade) || null,
      estado: limparTexto(body.estado).toUpperCase().slice(0, 2) || null,
      observacoes: limparTexto(body.observacoes) || null,
      foto_url: limparTexto(body.foto_url) || null,
      ativo: ativoFinal,
    };

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
          payload_enviado: payload,
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
