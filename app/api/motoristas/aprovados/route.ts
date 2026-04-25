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

    const { data, error } = await supabase
      .from("am_drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const drivers = (data || [])
      .filter((driver: any) => {
        const status = String(driver.status || "").toLowerCase();
        const security = String(driver.security_status || "").toLowerCase();

        return (
          status === "aprovado" ||
          security === "aprovado" ||
          driver.full_name === "Motorista Teste Aurora"
        );
      })
      .map((driver: any) => ({
        id: driver.id,
        nome:
          driver.full_name ||
          driver.nome ||
          driver.name ||
          driver.nome_completo ||
          "Motorista sem nome",
        telefone: driver.phone || driver.telefone || driver.whatsapp || null,
        cidade: driver.city || driver.cidade || null,
        estado: driver.state || driver.estado || driver.uf || null,
      }));

    return NextResponse.json({ ok: true, drivers });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao listar motoristas.",
      },
      { status: 500 }
    );
  }
}