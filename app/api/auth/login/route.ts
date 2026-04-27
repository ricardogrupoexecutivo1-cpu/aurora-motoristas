import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const senha = String(body?.senha || "").trim();

    const admins = [
      {
        id: "admin-1",
        email: String(process.env.AURORA_ADMIN_EMAIL_1 || "").trim().toLowerCase(),
        senha: String(process.env.AURORA_ADMIN_PASSWORD_1 || "").trim(),
        nome: "Ricardo Leonardo Moreira",
      },
      {
        id: "admin-2",
        email: String(process.env.AURORA_ADMIN_EMAIL_2 || "").trim().toLowerCase(),
        senha: String(process.env.AURORA_ADMIN_PASSWORD_2 || "").trim(),
        nome: "Admin Aurora 2",
      },
      {
        id: "admin-3",
        email: String(process.env.AURORA_ADMIN_EMAIL_3 || "").trim().toLowerCase(),
        senha: String(process.env.AURORA_ADMIN_PASSWORD_3 || "").trim(),
        nome: "Admin Aurora 3",
      },
    ];

    const admin = admins.find(
      (item) => item.email === email && item.senha === senha
    );

    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: "admin",
        driver_id: null,
        client_id: null,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro interno no login." },
      { status: 500 }
    );
  }
}