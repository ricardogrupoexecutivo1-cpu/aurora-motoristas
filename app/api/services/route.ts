import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-admin";
import crypto from "crypto";

function gerarToken() {
  return crypto.randomBytes(16).toString("hex");
}

function numero(valor: any) {
  if (valor === null || valor === undefined || valor === "") return 0;
  return Number(String(valor).replace(/\./g, "").replace(",", "."));
}

function texto(valor: any) {
  if (valor === null || valor === undefined) return "";
  return String(valor).trim();
}

function uuidOuNull(valor: any) {
  const limpo = texto(valor);
  if (!limpo) return null;
  return limpo;
}

function dataOuNull(valor: any) {
  const limpo = texto(valor);
  if (!limpo) return null;
  return limpo;
}

function separarCidadeEstado(valor: any) {
  const limpo = texto(valor);

  if (!limpo) {
    return {
      city: "",
      state: "",
      country: "Brasil",
    };
  }

  const partes = limpo
    .split(/[-,\/]/)
    .map((parte) => parte.trim())
    .filter(Boolean);

  if (partes.length >= 2) {
    return {
      city: partes[0],
      state: partes[1].toUpperCase(),
      country: "Brasil",
    };
  }

  return {
    city: limpo,
    state: "",
    country: "Brasil",
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("am_services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      services: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Erro ao carregar serviços" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const origin = texto(body.origin ?? body.origem);
    const destination = texto(body.destination ?? body.destino);

    const origemGeo = separarCidadeEstado(origin);
    const destinoGeo = separarCidadeEstado(destination);

    const clientAmount = numero(body.client_amount ?? body.valor_cliente);
    const driverAmount = numero(body.driver_amount ?? body.valor_motorista);
    const expenses = numero(body.expenses ?? body.despesas);
    const commission = clientAmount * 0.05;

    const clientToken = gerarToken();
    const driverToken = gerarToken();

    const payload = {
      service_code: `AM-${Date.now()}`,
      title: texto(body.title ?? body.titulo) || "Transfer Executivo",
      service_type: texto(body.service_type ?? body.tipo) || "transfer",

      client_name: texto(body.client_name ?? body.cliente),
      client_phone: texto(body.client_phone ?? body.telefone_cliente),
      company_name: texto(body.company_name ?? body.empresa),

      driver_id: uuidOuNull(body.driver_id),
      driver_name: texto(body.driver_name ?? body.motorista),
      driver_phone: texto(body.driver_phone ?? body.telefone_motorista),

      origin,
      destination,

      origin_city: origemGeo.city,
      origin_state: origemGeo.state,
      origin_country: origemGeo.country,

      destination_city: destinoGeo.city,
      destination_state: destinoGeo.state,
      destination_country: destinoGeo.country,

      service_date: dataOuNull(body.service_date ?? body.data),
      service_time: texto(body.service_time ?? body.horario),

      passenger_name: texto(body.passenger_name ?? body.passageiro),
      passenger_phone: texto(body.passenger_phone ?? body.telefone_passageiro),

      client_amount: clientAmount,
      driver_amount: driverAmount,
      expenses,
      commission,

      notes: texto(body.notes ?? body.observacoes),

      status: "agendado",
      driver_status: body.driver_id ? "selecionado" : "pendente",

      client_token: clientToken,
      driver_token: driverToken,

      client_link: `/cliente/${clientToken}`,
      driver_link: `/motorista/${driverToken}`,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("am_services")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
          payload,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      service: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Erro ao salvar serviço" },
      { status: 500 }
    );
  }
}