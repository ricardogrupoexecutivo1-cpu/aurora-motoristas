import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ClientePayload = {
  tipoPessoa?: string;
  nome?: string;
  empresa?: string;
  cpfCnpj?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "VariÃ¡veis do Supabase ausentes. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
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
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao listar clientes." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clients: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao listar clientes.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientePayload;

    const nome = body.nome?.trim() || "";
    const telefone = body.telefone?.trim() || "";
    const email = body.email?.trim() || "";
    const tipoPessoa = body.tipoPessoa?.trim() || "PJ";

    if (!nome) {
      return NextResponse.json(
        { error: "Informe o nome do cliente." },
        { status: 400 }
      );
    }

    if (!telefone && !email) {
      return NextResponse.json(
        { error: "Informe pelo menos telefone ou e-mail." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const payload = {
      tipo_pessoa: tipoPessoa,
      nome,
      empresa: body.empresa?.trim() || null,
      cpf_cnpj: body.cpfCnpj?.trim() || null,
      responsavel: body.responsavel?.trim() || null,
      telefone: telefone || null,
      email: email || null,
      cep: body.cep?.trim() || null,
      endereco: body.endereco?.trim() || null,
      numero: body.numero?.trim() || null,
      bairro: body.bairro?.trim() || null,
      cidade: body.cidade?.trim() || null,
      estado: body.estado?.trim() || null,
      observacoes: body.observacoes?.trim() || null,
    };

    const { data, error } = await supabase
      .from("clientes")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao salvar cliente." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cliente salvo com sucesso.",
      client: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao salvar cliente.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
