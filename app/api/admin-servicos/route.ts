import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message, servicos: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      servicos: data || [],
    });
  } catch (error) {
    console.error("ERRO ADMIN SERVICOS:", error);

    return NextResponse.json(
      { success: false, message: "Erro inesperado ao buscar serviços.", servicos: [] },
      { status: 500 }
    );
  }
}
