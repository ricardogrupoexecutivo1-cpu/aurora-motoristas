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

    const service_id = String(body.service_id || "").trim();
    const driver_id = String(body.driver_id || "").trim() || null;
    const entry_type = String(body.entry_type || "").trim();
    const description = String(body.description || "").trim();
    const amount = Number(String(body.amount || "0").replace(",", "."));

    if (!service_id || !entry_type || !description || !amount || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Serviço, tipo, descrição e valor são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from("am_service_financial_entries")
      .insert([
        {
          service_id,
          driver_id,
          entry_type,
          description,
          amount,
          payment_method: body.payment_method || null,
          receipt_url: body.receipt_url || null,
          notes: body.notes || null,
          created_by: "admin",
        },
      ])
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
      entry: data,
      message: "Lançamento financeiro registrado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao registrar financeiro.",
      },
      { status: 500 }
    );
  }
}