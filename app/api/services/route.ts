import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ServicePayload = {
  id?: string;

  tipo_servico?: string;
  modo_cobranca?: string;

  os?: string;
  pedido_cotacao?: string | null;
  data_servico?: string | null;
  status?: string;

  contratante?: string;
  cliente_final?: string;
  contato_cliente_final?: string | null;
  telefone_cliente_final?: string | null;

  empresa_operadora?: string;
  motorista?: string;
  placa_veiculo?: string | null;

  origem?: string;
  destino?: string;
  endereco_retirada?: string;
  endereco_entrega?: string;
  endereco_informado_por?: string | null;

  km_total?: number | string;
  valor_por_km?: number | string;
  valor_cobranca?: number | string;

  valor_motorista?: number | string;
  adiantamento_motorista?: number | string;
  despesas_motorista?: number | string;
  fechamento_motorista?: number | string;
  margem_operacao?: number | string;

  checklist_obrigatorio?: boolean;
  checklist_instrucoes?: string | null;

  observacoes?: string | null;

  action?: string;
  pago?: boolean | string | number;
  visivel_motorista?: boolean | string | number;
};

type InsertResult = {
  data: Record<string, unknown> | null;
  error: { message?: string; code?: string } | null;
  removedColumns: string[];
  finalPayload: Record<string, unknown>;
};

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "").replace(",", ".").trim();
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  return 0;
}

function toNullableString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toRequiredString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "sim";
  }
  if (typeof value === "number") return value === 1;
  return false;
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

function extractMissingColumnName(message?: string | null) {
  if (!message) return null;

  const singleQuoteMatch = message.match(/Could not find the '([^']+)' column/i);
  if (singleQuoteMatch?.[1]) return singleQuoteMatch[1];

  const doubleQuoteMatch = message.match(/column "([^"]+)"/i);
  if (doubleQuoteMatch?.[1]) return doubleQuoteMatch[1];

  const postgresMissingColumn = message.match(
    /column ([a-zA-Z0-9_]+) does not exist/i
  );
  if (postgresMissingColumn?.[1]) return postgresMissingColumn[1];

  return null;
}

function isMissingColumnError(
  error: { message?: string | null; code?: string | null } | null
) {
  if (!error) return false;

  const message = error.message || "";
  const code = error.code || "";

  return (
    code === "PGRST204" ||
    /does not exist/i.test(message) ||
    /Could not find the/i.test(message)
  );
}

async function insertWithAutoColumnFallback(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  initialPayload: Record<string, unknown>
): Promise<InsertResult> {
  const payload = { ...initialPayload };
  const removedColumns: string[] = [];
  const maxAttempts = 30;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { data, error } = await supabase
      .from("am_services")
      .insert(payload)
      .select("*")
      .single();

    if (!error) {
      return {
        data: data as Record<string, unknown>,
        error: null,
        removedColumns,
        finalPayload: payload,
      };
    }

    const missingColumn = extractMissingColumnName(error.message);

    if (missingColumn && missingColumn in payload) {
      delete payload[missingColumn];
      removedColumns.push(missingColumn);
      console.warn(
        `[am_services][POST] coluna ausente removida automaticamente do insert: ${missingColumn}`
      );
      continue;
    }

    return {
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
      removedColumns,
      finalPayload: payload,
    };
  }

  return {
    data: null,
    error: {
      message:
        "Limite de tentativas atingido ao remover colunas ausentes automaticamente.",
      code: "AUTO_COLUMN_FALLBACK_LIMIT",
    },
    removedColumns,
    finalPayload: payload,
  };
}

async function listServicesSafely(
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const attempts = [
    async () =>
      await supabase
        .from("am_services")
        .select("*")
        .order("created_at", { ascending: false }),
    async () =>
      await supabase.from("am_services").select("*").order("id", {
        ascending: false,
      }),
    async () => await supabase.from("am_services").select("*"),
  ];

  let lastError: { message?: string; code?: string } | null = null;

  for (const attempt of attempts) {
    const { data, error } = await attempt();

    if (!error) {
      return {
        data: (data || []) as Record<string, unknown>[],
        error: null,
      };
    }

    lastError = {
      message: error.message,
      code: error.code,
    };

    if (!isMissingColumnError(error)) {
      return {
        data: null,
        error: lastError,
      };
    }
  }

  return {
    data: null,
    error:
      lastError || {
        message: "Não foi possível listar os serviços.",
        code: "LIST_UNKNOWN_ERROR",
      },
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const result = await listServicesSafely(supabase);

    if (result.error) {
      console.error("[am_services][GET] erro ao listar:", result.error);

      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Erro ao listar serviços.",
          details: result.error,
        },
        { status: 500 }
      );
    }

    console.log(
      `[am_services][GET] total de serviços encontrados: ${result.data?.length || 0}`
    );

    return NextResponse.json({
      success: true,
      services: result.data || [],
      total: result.data?.length || 0,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao listar serviços.";

    console.error("[am_services][GET] erro geral:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ServicePayload;

    const tipoServico = toRequiredString(body.tipo_servico) || "busca_veiculo";
    const modoCobranca =
      toRequiredString(body.modo_cobranca) || "fechado_total";

    const os = toRequiredString(body.os) || `OS-${Date.now()}`;
    const status = toRequiredString(body.status) || "pendente";

    const contratante = toRequiredString(body.contratante);
    const clienteFinal = toRequiredString(body.cliente_final);
    const contatoClienteFinal = toRequiredString(body.contato_cliente_final);
    const motorista = toRequiredString(body.motorista);
    const origem = toRequiredString(body.origem);
    const destino = toRequiredString(body.destino);
    const empresaOperadora =
      toRequiredString(body.empresa_operadora) || "Aurora Motoristas";

    if (
      !contratante ||
      !clienteFinal ||
      !contatoClienteFinal ||
      !motorista ||
      !origem ||
      !destino
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Informe contratante, cliente final, contato do cliente final, motorista, origem e destino.",
        },
        { status: 400 }
      );
    }

    const valorCobranca = toNumber(body.valor_cobranca);
    const valorMotorista = toNumber(body.valor_motorista);
    const adiantamentoMotorista = toNumber(body.adiantamento_motorista);
    const despesasMotorista = toNumber(body.despesas_motorista);

    const fechamentoMotoristaInformado = toNumber(body.fechamento_motorista);
    const margemOperacaoInformada = toNumber(body.margem_operacao);

    const fechamentoMotoristaCalculado =
      valorMotorista - adiantamentoMotorista + despesasMotorista;

    const margemOperacaoCalculada =
      valorCobranca - fechamentoMotoristaCalculado;

    const fechamentoMotorista =
      fechamentoMotoristaInformado || fechamentoMotoristaCalculado;

    const margemOperacao = margemOperacaoInformada || margemOperacaoCalculada;

    const payload: Record<string, unknown> = {
      tipo_servico: tipoServico,
      modo_cobranca: modoCobranca,

      os,
      pedido_cotacao: toNullableString(body.pedido_cotacao),
      data_servico: toNullableString(body.data_servico),
      status,

      contratante,
      cliente_final: clienteFinal,
      contato_cliente_final: toNullableString(body.contato_cliente_final),
      telefone_cliente_final: toNullableString(body.telefone_cliente_final),

      empresa_operadora: empresaOperadora,
      motorista,
      placa_veiculo: toNullableString(body.placa_veiculo),

      origem,
      destino,
      endereco_retirada: toNullableString(body.endereco_retirada),
      endereco_entrega: toNullableString(body.endereco_entrega),
      endereco_informado_por: toNullableString(body.endereco_informado_por),

      km_total: toNumber(body.km_total),
      valor_por_km: toNumber(body.valor_por_km),
      valor_cobranca: valorCobranca,

      valor_motorista: valorMotorista,
      adiantamento_motorista: adiantamentoMotorista,
      despesas_motorista: despesasMotorista,
      fechamento_motorista: fechamentoMotorista,
      margem_operacao: margemOperacao,

      checklist_obrigatorio: Boolean(body.checklist_obrigatorio),
      checklist_instrucoes: toNullableString(body.checklist_instrucoes),

      observacoes: toNullableString(body.observacoes),

      pago: status === "pago",
      visivel_motorista: status !== "pago",
      origem_base: "Novo serviço",
      etapa: "Operacional",

      os_sistema: os,
      empresa: empresaOperadora,
      cliente: clienteFinal,
      servico: `${origem} x ${destino}`,
      km: toNumber(body.km_total),
      diaria: valorCobranca,
      reembolso: despesasMotorista,
      valor_total: valorCobranca,
      despesas: despesasMotorista,
      margem_bruta: margemOperacao,
      observacao:
        toNullableString(body.observacoes) ||
        "Serviço lançado pelo novo fluxo operacional.",
    };

    const supabase = getSupabaseAdmin();
    const result = await insertWithAutoColumnFallback(supabase, payload);

    if (result.error || !result.data) {
      console.error("[am_services][POST] erro ao inserir:", result.error);
      console.error(
        "[am_services][POST] colunas removidas automaticamente:",
        result.removedColumns
      );
      console.error(
        "[am_services][POST] payload final tentado:",
        result.finalPayload
      );

      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || "Erro ao salvar serviço.",
          details: result.error,
          removed_columns: result.removedColumns,
          payload_keys_sent: Object.keys(result.finalPayload),
        },
        { status: 500 }
      );
    }

    console.log("[am_services][POST] serviço salvo com sucesso:", result.data);
    console.log(
      "[am_services][POST] colunas removidas automaticamente:",
      result.removedColumns
    );

    return NextResponse.json({
      success: true,
      message:
        result.removedColumns.length > 0
          ? `Serviço salvo com sucesso no Supabase. Colunas ausentes ignoradas automaticamente: ${result.removedColumns.join(
              ", "
            )}.`
          : "Serviço salvo com sucesso no Supabase.",
      service: result.data,
      removed_columns: result.removedColumns,
      payload_keys_sent: Object.keys(result.finalPayload),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao salvar serviço.";

    console.error("[am_services][POST] erro geral:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as ServicePayload;

    const id = toRequiredString(body.id);
    const action = toRequiredString(body.action).toLowerCase();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Informe o id do serviço para atualizar.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    if (action === "mark_paid") {
      const nowIso = new Date().toISOString();

      const updatePayload: Record<string, unknown> = {
        status: "pago",
        pago: true,
        pago_em: nowIso,
        visivel_motorista: false,
        updated_at: nowIso,
      };

      const { data, error } = await supabase
        .from("am_services")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("[am_services][PATCH][mark_paid] erro:", error);

        return NextResponse.json(
          {
            success: false,
            error: error.message || "Erro ao marcar serviço como pago.",
            details: error,
          },
          { status: 500 }
        );
      }

      console.log("[am_services][PATCH][mark_paid] serviço atualizado:", data);

      return NextResponse.json({
        success: true,
        message:
          "Serviço marcado como pago com sucesso. Motorista não deve mais visualizar esta operação nas telas permitidas.",
        service: data,
      });
    }

    const nowIso = new Date().toISOString();

    const hasEditableFields =
      body.contratante !== undefined ||
      body.cliente_final !== undefined ||
      body.contato_cliente_final !== undefined ||
      body.telefone_cliente_final !== undefined ||
      body.motorista !== undefined ||
      body.placa_veiculo !== undefined ||
      body.origem !== undefined ||
      body.destino !== undefined ||
      body.endereco_retirada !== undefined ||
      body.endereco_entrega !== undefined ||
      body.observacoes !== undefined ||
      body.km_total !== undefined ||
      body.valor_por_km !== undefined ||
      body.valor_cobranca !== undefined ||
      body.valor_motorista !== undefined ||
      body.adiantamento_motorista !== undefined ||
      body.despesas_motorista !== undefined ||
      body.fechamento_motorista !== undefined ||
      body.margem_operacao !== undefined;

    if (hasEditableFields) {
      const contratante = toRequiredString(body.contratante);
      const clienteFinal = toRequiredString(body.cliente_final);
      const contatoClienteFinal = toRequiredString(body.contato_cliente_final);
      const telefoneClienteFinal = toNullableString(body.telefone_cliente_final);
      const motorista = toRequiredString(body.motorista);
      const placaVeiculo = toNullableString(body.placa_veiculo);
      const origem = toRequiredString(body.origem);
      const destino = toRequiredString(body.destino);
      const enderecoRetirada = toNullableString(body.endereco_retirada);
      const enderecoEntrega = toNullableString(body.endereco_entrega);
      const observacoes = toNullableString(body.observacoes);

      const kmTotal = toNumber(body.km_total);
      const valorPorKm = toNumber(body.valor_por_km);
      const valorCobranca = toNumber(body.valor_cobranca);
      const valorMotorista = toNumber(body.valor_motorista);
      const adiantamentoMotorista = toNumber(body.adiantamento_motorista);
      const despesasMotorista = toNumber(body.despesas_motorista);
      const fechamentoMotorista = toNumber(body.fechamento_motorista);
      const margemOperacao = toNumber(body.margem_operacao);

      if (
        !contratante ||
        !clienteFinal ||
        !contatoClienteFinal ||
        !motorista ||
        !origem ||
        !destino
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Para salvar a edição, informe contratante, cliente final, contato do cliente final, motorista, origem e destino.",
          },
          { status: 400 }
        );
      }

      const updatePayload: Record<string, unknown> = {
        contratante,
        empresa: contratante,

        cliente_final: clienteFinal,
        cliente: clienteFinal,

        contato_cliente_final: contatoClienteFinal,
        telefone_cliente_final: telefoneClienteFinal,

        motorista,
        placa_veiculo: placaVeiculo,

        origem,
        destino,
        servico: `${origem} x ${destino}`,

        endereco_retirada: enderecoRetirada,
        endereco_entrega: enderecoEntrega,

        observacoes,
        observacao:
          observacoes || "Serviço atualizado pelo fluxo seguro de edição.",

        km_total: kmTotal,
        km: kmTotal,

        valor_por_km: valorPorKm,
        valor_cobranca: valorCobranca,
        valor_total: valorCobranca,
        diaria: valorCobranca,

        valor_motorista: valorMotorista,
        adiantamento_motorista: adiantamentoMotorista,
        despesas_motorista: despesasMotorista,
        despesas: despesasMotorista,
        reembolso: despesasMotorista,

        fechamento_motorista: fechamentoMotorista,
        margem_operacao: margemOperacao,
        margem_bruta: margemOperacao,

        updated_at: nowIso,
      };

      const { data, error } = await supabase
        .from("am_services")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("[am_services][PATCH][edit] erro:", error);

        return NextResponse.json(
          {
            success: false,
            error: error.message || "Erro ao salvar edição do serviço.",
            details: error,
          },
          { status: 500 }
        );
      }

      console.log("[am_services][PATCH][edit] serviço atualizado:", data);

      return NextResponse.json({
        success: true,
        message: "Serviço editado com sucesso no Supabase.",
        service: data,
      });
    }

    const normalizedStatus = toRequiredString(body.status).toLowerCase();
    const paidFlag =
      body.pago !== undefined ? toBoolean(body.pago) : normalizedStatus === "pago";
    const visibleToDriver =
      body.visivel_motorista !== undefined
        ? toBoolean(body.visivel_motorista)
        : !paidFlag;

    const genericUpdatePayload: Record<string, unknown> = {
      updated_at: nowIso,
    };

    if (normalizedStatus) {
      genericUpdatePayload.status = normalizedStatus;
    }

    genericUpdatePayload.pago = paidFlag;
    genericUpdatePayload.visivel_motorista = visibleToDriver;

    if (paidFlag) {
      genericUpdatePayload.pago_em = nowIso;
    }

    const { data, error } = await supabase
      .from("am_services")
      .update(genericUpdatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("[am_services][PATCH] erro:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Erro ao atualizar serviço.",
          details: error,
        },
        { status: 500 }
      );
    }

    console.log("[am_services][PATCH] serviço atualizado:", data);

    return NextResponse.json({
      success: true,
      message: "Serviço atualizado com sucesso.",
      service: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao atualizar serviço.";

    console.error("[am_services][PATCH] erro geral:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}