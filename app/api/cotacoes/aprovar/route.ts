import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function gerarNumeroServico() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const codigo = `${Date.now()}`.slice(-6);
  return `AM-${ano}-${codigo}`;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API de aprovação de cotação ativa. Use POST para aprovar e gerar serviço.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cotacaoId = body.cotacao_id;
    const aprovadoPor = body.aprovado_por;
    const numeroAprovador = body.numero_aprovador;
    const numeroPedido = body.numero_pedido;
    const dataPedido = body.data_pedido;

    if (!cotacaoId) {
      return NextResponse.json(
        { success: false, message: "cotacao_id é obrigatório." },
        { status: 400 }
      );
    }

    if (!aprovadoPor || !numeroAprovador || !numeroPedido || !dataPedido) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe aprovado por, número do aprovador, número do pedido e data do pedido.",
        },
        { status: 400 }
      );
    }

    const { data: cotacao, error: cotacaoError } = await supabase
      .from("cotacoes")
      .select(`
        *,
        cotacao_despesas (*)
      `)
      .eq("id", cotacaoId)
      .single();

    if (cotacaoError || !cotacao) {
      return NextResponse.json(
        { success: false, message: cotacaoError?.message || "Cotação não encontrada." },
        { status: 404 }
      );
    }

    const despesasTotal = Array.isArray(cotacao.cotacao_despesas)
      ? cotacao.cotacao_despesas.reduce(
          (total: number, despesa: any) => total + Number(despesa.valor || 0),
          0
        )
      : 0;

    const diariaTotal =
      Number(cotacao.diaria_patio_valor || 0) *
      Number(cotacao.diaria_patio_quantidade || 0);

    const totalCliente =
      Number(cotacao.valor_servico || 0) + despesasTotal + diariaTotal;

    const { data: servicoExistente } = await supabase
      .from("servicos")
      .select("*")
      .eq("cotacao_id", cotacaoId)
      .maybeSingle();

    if (servicoExistente) {
      const { data: servicoAtualizado, error: servicoUpdateError } = await supabase
        .from("servicos")
        .update({
          client_id: cotacao.cliente_id,
          cliente_id: cotacao.cliente_id,
          cliente_nome: cotacao.cliente_nome,

          numero_pedido: numeroPedido,
          aprovado_por: aprovadoPor,
          numero_aprovador: numeroAprovador,
          data_pedido: dataPedido,

          valor_cliente: totalCliente,
          valor_servico: Number(cotacao.valor_servico || 0),
          valor_motorista: Number(cotacao.valor_motorista || 0),
          despesas_reembolsaveis: despesasTotal,
          diarias_patio: diariaTotal,

          updated_at: new Date().toISOString(),
        })
        .eq("id", servicoExistente.id)
        .select()
        .single();

      if (servicoUpdateError) {
        return NextResponse.json(
          { success: false, message: servicoUpdateError.message },
          { status: 500 }
        );
      }

      await supabase
        .from("cotacoes")
        .update({
          status: "aprovada",
          aprovado_por: aprovadoPor,
          numero_aprovador: numeroAprovador,
          numero_pedido: numeroPedido,
          data_pedido: dataPedido,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cotacaoId);

      return NextResponse.json({
        success: true,
        message: "Serviço existente atualizado com pedido, aprovação e total correto.",
        servico: servicoAtualizado,
      });
    }

    const numeroServico = gerarNumeroServico();

    const { data: servico, error: servicoError } = await supabase
      .from("servicos")
      .insert({
        numero_servico: numeroServico,

        client_id: cotacao.cliente_id,
        cliente_id: cotacao.cliente_id,
        cliente_nome: cotacao.cliente_nome,

        cotacao_id: cotacao.id,
        os_cliente: cotacao.os_cliente,

        solicitante_nome: cotacao.solicitante_nome,
        solicitante_telefone: cotacao.solicitante_telefone,
        solicitante_email: cotacao.solicitante_email,

        origem: cotacao.origem,
        destino: cotacao.destino,
        km: cotacao.km,
        descricao: cotacao.observacao,

        data_servico: dataPedido,
        data_pedido: dataPedido,
        numero_pedido: numeroPedido,

        aprovado_por: aprovadoPor,
        numero_aprovador: numeroAprovador,

        valor_cliente: totalCliente,
        valor_servico: Number(cotacao.valor_servico || 0),
        valor_motorista: Number(cotacao.valor_motorista || 0),
        despesas_reembolsaveis: despesasTotal,
        diarias_patio: diariaTotal,

        status: "pendente",
        status_operacional: "pendente",
        status_financeiro: "a_cobrar",
      })
      .select()
      .single();

    if (servicoError) {
      return NextResponse.json(
        { success: false, message: servicoError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("cotacoes")
      .update({
        status: "aprovada",
        aprovado_por: aprovadoPor,
        numero_aprovador: numeroAprovador,
        numero_pedido: numeroPedido,
        data_pedido: dataPedido,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cotacaoId);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cotação aprovada e serviço gerado com sucesso.",
      servico,
    });
  } catch (error) {
    console.error("ERRO AO APROVAR COTAÇÃO:", error);

    return NextResponse.json(
      { success: false, message: "Erro inesperado ao aprovar cotação." },
      { status: 500 }
    );
  }
}
