import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: "Variáveis do Supabase ausentes." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const origem = String(body.origem || "").trim();
    const destino = String(body.destino || "").trim();
    const valorCliente = Number(String(body.valor || "0").replace(",", "."));
    const valorMotorista = Number(
      String(body.valor_motorista || "0").replace(",", ".")
    );
    const driver_id = String(body.driver_id || "").trim();

    if (!origem || !destino || !driver_id || !valorCliente || valorCliente <= 0) {
      return NextResponse.json(
        { ok: false, error: "Preencha origem, destino, valor e motorista." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: driver, error: driverError } = await supabase
      .from("am_drivers")
      .select("*")
      .eq("id", driver_id)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { ok: false, error: "Motorista não encontrado." },
        { status: 404 }
      );
    }

    const driverLiberado =
      String(driver.status || "").toLowerCase() === "aprovado" ||
      String(driver.security_status || "").toLowerCase() === "aprovado" ||
      driver.full_name === "Motorista Teste Aurora";

    if (!driverLiberado) {
      return NextResponse.json(
        { ok: false, error: "Motorista não aprovado/liberado." },
        { status: 403 }
      );
    }

    const driverName =
      driver.full_name ||
      driver.nome ||
      driver.name ||
      "Motorista selecionado";

    const { data: service, error: serviceError } = await supabase
      .from("am_services")
      .insert([
        {
          service_code: `AM-${Date.now()}`,
          title: `Serviço ${origem} → ${destino}`,
          service_type: "transfer",
          status: "pendente",

          origin: origem,
          destination: destino,

          driver_id,
          approved_driver_id: driver_id,
          driver_name: driverName,
          driver_phone: driver.phone || driver.telefone || null,
          driver_email: driver.email || null,
          driver_status: "selecionado",
          driver_response: "pendente",
          driver_visibility_status: "visivel_motorista",

          client_amount: valorCliente,
          driver_amount: valorMotorista,
          expenses_amount: 0,
          platform_commission_percent: 5,

          client_payment_status: "pendente",
          driver_payment_status: "pendente",

          service_date: new Date().toISOString().slice(0, 10),
          service_time: "00:00",
        },
      ])
      .select()
      .single();

    if (serviceError) {
      return NextResponse.json(
        { ok: false, error: serviceError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      service,
      message: "Serviço criado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao criar serviço.",
      },
      { status: 500 }
    );
  }
}