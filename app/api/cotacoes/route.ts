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
  const { data, error } = await supabase
    .from("cotacoes")
    .select(`
      *,
      cotacao_despesas (*)
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
    cotacoes: data || [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: cotacao, error } = await supabase
      .from("cotacoes")
      .insert({
        cliente_id: body.cliente_id,
        cliente_nome: body.cliente_nome,
        solicitante_nome: body.solicitante_nome,
        solicitante_telefone: body.solicitante_telefone,
        solicitante_email: body.solicitante_email,
        os_cliente: body.os_cliente,
        origem: body.origem,
        destino: body.destino,
        km: moedaParaNumero(body.km),
        valor_km: moedaParaNumero(body.valor_km),
        valor_servico: moedaParaNumero(body.valor_servico),
        valor_motorista: moedaParaNumero(body.valor_motorista),
        diaria_patio_valor: moedaParaNumero(body.diaria_patio_valor),
        diaria_patio_quantidade: moedaParaNumero(body.diaria_patio_quantidade),
        observacao: body.observacao,
        status: "pendente",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const despesas = Array.isArray(body.despesas) ? body.despesas : [];

    if (despesas.length > 0) {
      const despesasInsert = despesas.map((despesa: any) => ({
        cotacao_id: cotacao.id,
        tipo: despesa.tipo,
        valor: moedaParaNumero(despesa.valor),
        observacao: despesa.observacao,
      }));

      const { error: despesasError } = await supabase
        .from("cotacao_despesas")
        .insert(despesasInsert);

      if (despesasError) {
        return NextResponse.json(
          { success: false, message: despesasError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cotação salva no Supabase.",
      cotacao,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro ao salvar cotação." },
      { status: 500 }
    );
  }
}
