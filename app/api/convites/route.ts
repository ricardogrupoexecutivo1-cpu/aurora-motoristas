import { NextResponse } from "next/server";
import { convites, servicos, type Convite, type Servico } from "../_memoria/aurora";

export const dynamic = "force-dynamic";

function moedaParaNumero(valor: unknown) {
  if (typeof valor === "number") return valor;
  return Number(String(valor || "0").replace(/\./g, "").replace(",", ".")) || 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const novoConvite: Convite = {
      id: crypto.randomUUID(),
      motorista_id: body.motorista_id,
      motorista_nome: body.motorista_nome || null,
      cliente_nome: body.cliente_nome || "",
      cliente_contato: body.cliente_contato || "",
      local_apresentacao: body.local_apresentacao || "",
      data_hora_apresentacao: body.data_hora_apresentacao || "",
      observacao: body.observacao || "Convite criado pelo admin Aurora.",
      origem: body.origem || "",
      destino: body.destino || "",
      valor_servico: moedaParaNumero(body.valor_servico),
      valor_motorista: moedaParaNumero(body.valor_motorista),
      status: "pendente",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    convites.push(novoConvite);

    return NextResponse.json({
      success: true,
      message: "Convite criado com cliente, operação e valores.",
      convite: novoConvite,
    });
  } catch (error) {
    console.error("ERRO AO CRIAR CONVITE:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao criar convite." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const motorista_id = searchParams.get("motorista_id");

  let lista = convites;

  if (motorista_id) {
    lista = lista.filter((c) => c.motorista_id === motorista_id);
  }

  return NextResponse.json({
    success: true,
    convites: lista,
    total: lista.length,
  });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const conviteId = body.convite_id;
    const novoStatus = body.status;

    const index = convites.findIndex((c) => c.id === conviteId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Convite não encontrado." },
        { status: 404 }
      );
    }

    convites[index] = {
      ...convites[index],
      status: novoStatus,
      updated_at: new Date().toISOString(),
    };

    let servicoCriado: Servico | null = null;

    if (novoStatus === "aceito") {
      const convite = convites[index];
      const jaExiste = servicos.find((s) => s.convite_id === conviteId);

      if (!jaExiste) {
        servicoCriado = {
          id: crypto.randomUUID(),
          convite_id: convite.id,
          motorista_id: convite.motorista_id,
          motorista_nome: convite.motorista_nome,
          cliente_nome: convite.cliente_nome,
          cliente_contato: convite.cliente_contato,
          local_apresentacao: convite.local_apresentacao,
          data_hora_apresentacao: convite.data_hora_apresentacao,
          origem: convite.origem,
          destino: convite.destino,
          valor_servico: convite.valor_servico,
          valor_motorista: convite.valor_motorista,
          adiantamentos: 0,
          despesas: 0,
          status: "em_andamento",
          financeiro_visivel_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        servicos.push(servicoCriado);
      } else {
        servicoCriado = jaExiste;
      }
    }

    return NextResponse.json({
      success: true,
      message:
        novoStatus === "aceito"
          ? "Convite aceito e serviço criado com sucesso."
          : `Convite ${novoStatus} com sucesso.`,
      convite: convites[index],
      servico: servicoCriado,
    });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR CONVITE:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar convite." },
      { status: 500 }
    );
  }
}
