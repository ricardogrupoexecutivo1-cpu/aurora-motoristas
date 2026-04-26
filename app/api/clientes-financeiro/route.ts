import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

function moedaParaNumero(valor: unknown) {
  if (typeof valor === "number") return valor;
  return Number(String(valor || "0").replace(/\./g, "").replace(",", ".")) || 0;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("clientes_financeiro")
      .select(`
        *,
        cliente_contatos (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clientes: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro ao listar clientes financeiros." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: cliente, error } = await supabase
      .from("clientes_financeiro")
      .insert({
        nome: body.nome,
        documento: body.documento,
        tipo_cobranca: body.tipo_cobranca,
        prazo_pagamento: body.prazo_pagamento,
        valor_km: moedaParaNumero(body.valor_km),
        regra_km: body.regra_km,
        regra_despesas: body.regra_despesas,
        valor_diaria_patio: moedaParaNumero(body.valor_diaria_patio),
        regra_diaria_patio: body.regra_diaria_patio,
        observacoes: body.observacoes,
        status: "ativo",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const contatos = Array.isArray(body.contatos) ? body.contatos : [];

    if (contatos.length > 0) {
      const contatosInsert = contatos.map((contato: any) => ({
        cliente_id: cliente.id,
        nome: contato.nome,
        email: contato.email,
        telefone: contato.telefone,
        setor: contato.setor,
        tipo: contato.tipo,
      }));

      const { error: contatosError } = await supabase
        .from("cliente_contatos")
        .insert(contatosInsert);

      if (contatosError) {
        return NextResponse.json(
          { success: false, message: contatosError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cliente financeiro salvo no Supabase.",
      cliente,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro ao salvar cliente financeiro." },
      { status: 500 }
    );
  }
}
