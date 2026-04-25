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
    .eq("client_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, message: "Serviço não encontrado." },
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

  if (body.action !== "confirmar") {
    return NextResponse.json(
      { ok: false, message: "Ação inválida." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("am_services")
    .update({
      status: "cliente_confirmou",
      client_confirmed_at: new Date().toISOString(),
      service_finished_at: new Date().toISOString(),
    })
    .eq("client_token", token)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, message: "Erro ao confirmar serviço." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Serviço confirmado com sucesso.",
    service: data,
  });
}
