import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: "Variáveis do Supabase ausentes." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("service_id");

    if (!serviceId) {
      return NextResponse.json(
        { ok: false, error: "service_id é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: service, error: serviceError } = await supabase
      .from("am_services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { ok: false, error: "Serviço não encontrado." },
        { status: 404 }
      );
    }

    const { data: entries, error: entriesError } = await supabase
      .from("am_service_financial_entries")
      .select("*")
      .eq("service_id", serviceId)
      .order("created_at", { ascending: false });

    if (entriesError) {
      return NextResponse.json(
        { ok: false, error: entriesError.message },
        { status: 500 }
      );
    }

    const totalAdiantamentos = (entries || [])
      .filter((e) => e.entry_type === "adiantamento_motorista")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalDespesas = (entries || [])
      .filter((e) => e.entry_type === "despesa_motorista")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalPagamentoMotorista = (entries || [])
      .filter((e) => e.entry_type === "pagamento_motorista")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalRecebimentoCliente = (entries || [])
      .filter((e) => e.entry_type === "recebimento_cliente")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalAjustes = (entries || [])
      .filter((e) => e.entry_type === "ajuste_manual")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const valorCliente = Number(service.client_amount || 0);
    const valorMotorista = Number(service.driver_amount || 0);
    const despesasBase = Number(service.expenses_amount || 0);
    const comissaoPercentual = Number(service.platform_commission_percent || 5);

    const comissaoPlataforma = valorCliente * (comissaoPercentual / 100);

    const custoTotalMotorista =
      valorMotorista + totalAdiantamentos + totalPagamentoMotorista;

    const despesasTotais = despesasBase + totalDespesas;

    const lucroOperacional =
      valorCliente - custoTotalMotorista - despesasTotais - comissaoPlataforma + totalAjustes;

    const saldoReceberCliente = Math.max(valorCliente - totalRecebimentoCliente, 0);

    return NextResponse.json({
      ok: true,
      service,
      entries: entries || [],
      resumo: {
        valor_cliente: valorCliente,
        valor_motorista_base: valorMotorista,
        despesas_base: despesasBase,
        comissao_percentual: comissaoPercentual,
        comissao_plataforma: comissaoPlataforma,
        total_adiantamentos: totalAdiantamentos,
        total_despesas: totalDespesas,
        total_pagamento_motorista: totalPagamentoMotorista,
        total_recebimento_cliente: totalRecebimentoCliente,
        total_ajustes: totalAjustes,
        custo_total_motorista: custoTotalMotorista,
        despesas_totais: despesasTotais,
        saldo_receber_cliente: saldoReceberCliente,
        lucro_operacional: lucroOperacional,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar resumo financeiro.",
      },
      { status: 500 }
    );
  }
}