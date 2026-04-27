import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: "Variáveis do Supabase ausentes." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: services, error } = await supabase
      .from("am_services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const lista = services || [];

    const totalCliente = lista.reduce(
      (sum, s) => sum + Number(s.client_amount || 0),
      0
    );

    const totalMotorista = lista.reduce(
      (sum, s) => sum + Number(s.driver_amount || 0),
      0
    );

    const totalDespesas = lista.reduce(
      (sum, s) => sum + Number(s.expenses_amount || 0),
      0
    );

    const totalComissao = lista.reduce((sum, s) => {
      const valorCliente = Number(s.client_amount || 0);
      const percentual = Number(s.platform_commission_percent || 5);
      return sum + valorCliente * (percentual / 100);
    }, 0);

    const lucroEstimado =
      totalCliente - totalMotorista - totalDespesas - totalComissao;

    return NextResponse.json({
      ok: true,
      resumo: {
        total_servicos: lista.length,
        total_cliente: totalCliente,
        total_motorista: totalMotorista,
        total_despesas: totalDespesas,
        total_comissao: totalComissao,
        lucro_estimado: lucroEstimado,
      },
      services: lista,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar painel admin.",
      },
      { status: 500 }
    );
  }
}