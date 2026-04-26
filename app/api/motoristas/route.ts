import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MotoristaPayload = {
  nome?: string;
  full_name?: string;

  cpf?: string;

  cnh?: string;
  cnh_number?: string;

  telefone?: string;
  phone?: string;

  email?: string;

  cep?: string;

  endereco?: string;
  address?: string;
  logradouro?: string;

  numero?: string;
  number?: string;

  complemento?: string;
  complement?: string;

  bairro?: string;
  district?: string;

  cidade?: string;
  city?: string;

  estado?: string;
  state?: string;

  observacoes?: string;
  foto_url?: string;

  pix_type?: string;
  pix_key?: string;

  ativo?: boolean;
};

function limparDocumento(valor: unknown) {
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
      "Variáveis do Supabase ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
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
        { status: 500 }
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
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao listar motoristas.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MotoristaPayload;

    const nomeFinal = limparTexto(body.nome || body.full_name);
    const cpfLimpo = limparDocumento(body.cpf);
    const cnhFinal = limparTexto(body.cnh || body.cnh_number);
    const telefoneLimpo = limparDocumento(body.telefone || body.phone);
    const emailFinal = limparTexto(body.email);

    const cepLimpo = limparDocumento(body.cep);

    const enderecoFinal = limparTexto(
      body.endereco || body.address || body.logradouro
    );

    const numeroFinal = limparTexto(body.numero || body.number);
    const complementoFinal = limparTexto(body.complemento || body.complement);
    const bairroFinal = limparTexto(body.bairro || body.district);
    const cidadeFinal = limparTexto(body.cidade || body.city);
    const estadoFinal = limparTexto(body.estado || body.state)
      .toUpperCase()
      .slice(0, 2);

    const pixTypeFinal = limparTexto(body.pix_type);
    const pixKeyFinal = limparTexto(body.pix_key);

    if (!nomeFinal) {
      return NextResponse.json(
        { success: false, message: "Nome completo é obrigatório." },
        { status: 400 }
      );
    }

    if (!cpfLimpo || cpfLimpo.length !== 11) {
      return NextResponse.json(
        { success: false, message: "CPF é obrigatório e deve ter 11 números." },
        { status: 400 }
      );
    }

    if (!cnhFinal) {
      return NextResponse.json(
        { success: false, message: "CNH é obrigatória." },
        { status: 400 }
      );
    }

    if (!telefoneLimpo || telefoneLimpo.length < 10) {
      return NextResponse.json(
        { success: false, message: "Telefone é obrigatório." },
        { status: 400 }
      );
    }

    if (!emailFinal || !emailFinal.includes("@")) {
      return NextResponse.json(
        { success: false, message: "E-mail válido é obrigatório." },
        { status: 400 }
      );
    }

    if (!cepLimpo || cepLimpo.length !== 8) {
      return NextResponse.json(
        { success: false, message: "CEP é obrigatório e deve ter 8 números." },
        { status: 400 }
      );
    }

    if (!enderecoFinal) {
      return NextResponse.json(
        { success: false, message: "Endereço é obrigatório." },
        { status: 400 }
      );
    }

    if (!numeroFinal) {
      return NextResponse.json(
        { success: false, message: "Número é obrigatório." },
        { status: 400 }
      );
    }

    if (!bairroFinal) {
      return NextResponse.json(
        { success: false, message: "Bairro é obrigatório." },
        { status: 400 }
      );
    }

    if (!cidadeFinal) {
      return NextResponse.json(
        { success: false, message: "Cidade é obrigatória." },
        { status: 400 }
      );
    }

    if (!estadoFinal) {
      return NextResponse.json(
        { success: false, message: "Estado é obrigatório." },
        { status: 400 }
      );
    }

    if (!pixTypeFinal) {
      return NextResponse.json(
        { success: false, message: "Tipo de PIX é obrigatório." },
        { status: 400 }
      );
    }

    if (!pixKeyFinal) {
      return NextResponse.json(
        { success: false, message: "Chave PIX é obrigatória." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

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
        { status: 500 }
      );
    }

    if (existente) {
      return NextResponse.json(
        {
          success: false,
          message: "Já existe motorista cadastrado com este CPF.",
        },
        { status: 409 }
      );
    }

    const payload = {
      nome: nomeFinal,
      cpf: cpfLimpo,
      cnh: cnhFinal,
      telefone: telefoneLimpo,
      email: emailFinal,

      cep: cepLimpo,
      endereco: enderecoFinal,
      logradouro: enderecoFinal,
      numero: numeroFinal,
      complemento: complementoFinal || null,
      bairro: bairroFinal,
      cidade: cidadeFinal,
      estado: estadoFinal,

      observacoes:
        limparTexto(body.observacoes) ||
        "Cadastro público de motorista/prestador operacional Aurora.",

      foto_url: limparTexto(body.foto_url) || null,

      pix_type: pixTypeFinal,
      pix_key: pixKeyFinal,

      status: "pendente",
      ativo: false,
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
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cadastro enviado com sucesso. O motorista/prestador ficará em análise humana.",
        motorista: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao salvar motorista.",
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}