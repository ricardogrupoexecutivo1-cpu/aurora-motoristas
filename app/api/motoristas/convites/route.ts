import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Variáveis do Supabase ausentes.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const motorista_id = searchParams.get("motorista_id");

    if (!motorista_id) {
      return NextResponse.json(
        { success: false, error: "motorista_id obrigatório" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("motorista_convites")
      .select("*")
      .eq("motorista_id", motorista_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      convites: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const motorista_id = body.motorista_id || null;
    const observacao = body.observacao || null;
    const todos = body.todos === true;

    if (todos) {
      const { data: motoristas, error: motoristasError } = await supabase
        .from("motoristas_aurora")
        .select("id, nome, cpf, status, ativo")
        .eq("ativo", true);

      if (motoristasError) {
        return NextResponse.json(
          { success: false, error: motoristasError.message },
          { status: 500 }
        );
      }

      if (!motoristas || motoristas.length === 0) {
        return NextResponse.json(
          { success: false, error: "Nenhum motorista aprovado/livre encontrado." },
          { status: 404 }
        );
      }

      const convites = motoristas.map((m) => ({
        motorista_id: m.id,
        observacao,
        status: "enviado",
        tipo_disparo: "todos",
      }));

      const { data, error } = await supabase
        .from("motorista_convites")
        .insert(convites)
        .select("*");

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        total: data?.length || 0,
        convites: data || [],
      });
    }

    if (!motorista_id) {
      return NextResponse.json(
        { success: false, error: "Selecione um motorista ou envie para todos." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("motorista_convites")
      .insert({
        motorista_id,
        observacao,
        status: "enviado",
        tipo_disparo: "individual",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      convite: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}