import { NextResponse } from "next/server";
import { servicos } from "../_memoria/aurora";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const motorista_id = searchParams.get("motorista_id");
    const status = searchParams.get("status");

    let lista = servicos;

    if (motorista_id) {
      lista = lista.filter((s) => s.motorista_id === motorista_id);
    }

    if (status) {
      lista = lista.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      message: "Serviços listados com sucesso.",
      servicos: lista,
      total: lista.length,
    });
  } catch (error) {
    console.error("ERRO AO LISTAR SERVIÇOS:", error);

    return NextResponse.json(
      { success: false, message: "Erro ao listar serviços." },
      { status: 500 }
    );
  }
}
