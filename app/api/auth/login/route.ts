import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({
        ok: true,
        role: "admin",
        empresa: "Base Interna Aurora",
      });
    }

    return NextResponse.json(
      { ok: false, error: "Credenciais inválidas" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao validar login" },
      { status: 500 }
    );
  }
}
