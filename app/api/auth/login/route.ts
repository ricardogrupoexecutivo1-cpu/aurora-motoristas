import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextResponse } from "next/server";

function normalizarEmail(email: unknown) {
  return String(email || "").trim().toLowerCase();
}

function normalizarSenha(senha: unknown) {
  return String(senha || "").trim();
}

function hashPassword(email: string, password: string) {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}:${password}:aurora-motoristas`)
    .digest("hex");
}

function getAdmins() {
  return [
    {
      id: "admin-1",
      email: process.env.AURORA_ADMIN_EMAIL_1,
      senha: process.env.AURORA_ADMIN_PASSWORD_1,
      nome: "Ricardo Leonardo Moreira",
    },
    {
      id: "admin-2",
      email: process.env.AURORA_ADMIN_EMAIL_2,
      senha: process.env.AURORA_ADMIN_PASSWORD_2,
      nome: "Admin Aurora 2",
    },
    {
      id: "admin-3",
      email: process.env.AURORA_ADMIN_EMAIL_3,
      senha: process.env.AURORA_ADMIN_PASSWORD_3,
      nome: "Admin Aurora 3",
    },
  ].filter((admin) => admin.email && admin.senha);
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env ausente.");
  }

  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = normalizarEmail(body?.email);
    const senha = normalizarSenha(body?.senha);

    if (!email || !senha) {
      return NextResponse.json(
        { ok: false, error: "Informe e-mail e senha." },
        { status: 400 }
      );
    }

    const admin = getAdmins().find(
      (item) =>
        normalizarEmail(item.email) === email &&
        normalizarSenha(item.senha) === senha
    );

    if (admin) {
      return NextResponse.json({
        ok: true,
        user: {
          id: admin.id,
          nome: admin.nome,
          email,
          role: "admin",
          driver_id: null,
          client_id: null,
        },
      });
    }

    const supabase = supabaseAdmin();

    const { data: user, error } = await supabase
      .from("aurora_users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    if (user.status === "bloqueado") {
      return NextResponse.json(
        { ok: false, error: "Usuário bloqueado. Fale com o administrador." },
        { status: 403 }
      );
    }

    const senhaCorreta = user.password_hash === hashPassword(email, senha);

    if (!senhaCorreta) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        driver_id: user.driver_id ?? null,
        client_id: user.client_id ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao processar login." },
      { status: 500 }
    );
  }
}