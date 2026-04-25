import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  const { data, error } = await supabase
    .from("am_services")
    .select("*")
    .eq("driver_token", token)
    .neq("driver_payment_status", "pago")
    .neq("driver_visibility_status", "oculto_motorista")
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Serviço não disponível para o motorista. Pode ter sido finalizado, pago ou removido da visão do motorista.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, service: data });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const body = await request.json();

  const action = body.action;

  if (action !== "aceitar" && action !== "recusar") {
    return NextResponse.json(
      { ok: false, message: "Ação inválida." },
      { status: 400 }
    );
  }

  const updateData =
    action === "aceitar"
      ? {
          driver_status: "aceito",
          driver_response: "aceito",
          driver_accepted_at: new Date().toISOString(),
          status: "motorista_aceitou",
        }
      : {
          driver_status: "recusado",
          driver_response: "recusado",
          driver_rejected_at: new Date().toISOString(),
          status: "motorista_recusou",
        };

  const { data, error } = await supabase
    .from("am_services")
    .update(updateData)
    .eq("driver_token", token)
    .neq("driver_payment_status", "pago")
    .neq("driver_visibility_status", "oculto_motorista")
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Este serviço não está mais disponível para resposta do motorista.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      action === "aceitar"
        ? "Serviço aceito com sucesso."
        : "Serviço recusado com sucesso.",
    service: data,
  });
}
