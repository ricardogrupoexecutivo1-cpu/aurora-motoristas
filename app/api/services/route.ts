import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ServicePayload = {
  osSistema?: string;
  osCliente?: string;
  ocCliente?: string;
  empresa?: string;
  cliente?: string;
  motorista?: string;
  servico?: string;
  origem?: string;
  destino?: string;
  dataServico?: string;
  km?: number | string;
  diaria?: number | string;
  pedagio?: number | string;
  estacionamento?: number | string;
  alimentacao?: number | string;
  reembolso?: number | string;
  valorMotorista?: number | string;
  observacao?: string;
};

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim();
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  return 0;
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Variáveis do Supabase ausentes. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
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
      .from("am_services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao listar serviços." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      services: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao listar serviços.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ServicePayload;

    const empresa = body.empresa?.trim() || "";
    const cliente = body.cliente?.trim() || "";
    const motorista = body.motorista?.trim() || "";
    const origem = body.origem?.trim() || "";
    const destino = body.destino?.trim() || "";
    const servico = body.servico?.trim() || `${origem || "Origem"} x ${destino || "Destino"}`;
    const osSistema = body.osSistema?.trim() || "";

    if (!empresa || !cliente || !motorista || !osSistema) {
      return NextResponse.json(
        {
          error:
            "Informe pelo menos empresa, cliente, motorista e OS do sistema.",
        },
        { status: 400 }
      );
    }

    const diaria = toNumber(body.diaria);
    const pedagio = toNumber(body.pedagio);
    const estacionamento = toNumber(body.estacionamento);
    const alimentacao = toNumber(body.alimentacao);
    const reembolso = toNumber(body.reembolso);
    const valorMotorista = toNumber(body.valorMotorista);
    const km = toNumber(body.km);

    const valorTotal =
      diaria + pedagio + estacionamento + alimentacao + reembolso;
    const despesas = pedagio + estacionamento + alimentacao + reembolso;
    const margemBruta = valorTotal - valorMotorista;

    const payload = {
      os_sistema: osSistema,
      os_cliente: body.osCliente?.trim() || null,
      oc_cliente: body.ocCliente?.trim() || null,

      empresa,
      cliente,
      motorista,

      servico,
      origem: origem || null,
      destino: destino || null,
      data_servico: body.dataServico?.trim() || null,

      km,
      diaria,
      pedagio,
      estacionamento,
      alimentacao,
      reembolso,

      valor_total: valorTotal,
      valor_motorista: valorMotorista,
      despesas,
      margem_bruta: margemBruta,

      etapa: "Cotação",
      origem_base: "Serviço local",

      observacao:
        body.observacao?.trim() ||
        "Serviço lançado em cotação aguardando validação operacional.",

      pago: false,
      visivel_motorista: true,
    };

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("am_services")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao salvar serviço." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Serviço salvo com sucesso na base central.",
      service: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao salvar serviço.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}