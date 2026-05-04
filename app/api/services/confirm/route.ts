import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceId = body.service_id;

    if (!serviceId) {
      return NextResponse.json(
        { ok: false, error: "service_id obrigatório" },
        { status: 400 }
      );
    }

    // 🔎 Buscar serviço
    const { data: service, error: serviceError } = await supabaseAdmin
      .from("am_services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { ok: false, error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // ⚠️ Evitar duplicidade
    const { data: jaExiste } = await supabaseAdmin
      .from("am_financial")
      .select("id")
      .eq("service_id", service.id)
      .maybeSingle();

    if (!jaExiste) {
      const clientAmount = Number(service.client_amount || 0);
      const driverAmount = Number(service.driver_amount || 0);
      const expenses = Number(service.expenses || 0);
      const commission = Number(service.commission || 0);

      // 💰 Registrar financeiro da plataforma
      await supabaseAdmin.from("am_financial").insert([
        {
          service_id: service.id,
          service_code: service.service_code,
          service_type: service.service_type,

          client_name: service.client_name,
          driver_name: service.driver_name,

          client_amount: clientAmount,
          driver_amount: driverAmount,
          expenses,
          commission,
          platform_amount: commission,

          status: "pendente",
        },
      ]);
    }

    // ✅ Atualizar serviço
    const { data, error } = await supabaseAdmin
      .from("am_services")
      .update({
        status: "cliente_confirmou",
        client_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      service: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Erro ao confirmar serviço" },
      { status: 500 }
    );
  }
}