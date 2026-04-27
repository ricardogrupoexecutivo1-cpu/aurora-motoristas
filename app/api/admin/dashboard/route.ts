import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function GET() {
  try {
    // 🔎 Serviços
    const { data: services } = await supabaseAdmin
      .from("am_services")
      .select("*");

    // 💰 Financeiro
    const { data: financial } = await supabaseAdmin
      .from("am_financial")
      .select("*");

    const totalServices = services?.length || 0;

    const totalRevenue =
      services?.reduce((acc, s) => acc + Number(s.client_amount || 0), 0) || 0;

    const totalCommission =
      financial?.reduce((acc, f) => acc + Number(f.platform_amount || 0), 0) || 0;

    const totalPending =
      financial
        ?.filter((f) => f.status === "pendente")
        .reduce((acc, f) => acc + Number(f.platform_amount || 0), 0) || 0;

    const totalReceived =
      financial
        ?.filter((f) => f.status === "recebido")
        .reduce((acc, f) => acc + Number(f.platform_amount || 0), 0) || 0;

    // 📍 Top cidades
    const cidades: Record<string, number> = {};

    services?.forEach((s) => {
      const cidade = s.origin_city || "Não informado";
      cidades[cidade] = (cidades[cidade] || 0) + 1;
    });

    const topCities = Object.entries(cidades)
      .map(([cidade, total]) => ({ cidade, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return NextResponse.json({
      ok: true,
      dashboard: {
        totalServices,
        totalRevenue,
        totalCommission,
        totalPending,
        totalReceived,
        topCities,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}