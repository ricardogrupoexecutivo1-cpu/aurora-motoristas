import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextResponse } from "next/server";

type AuroraRole = "cliente" | "motorista";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env ausente.");
  }

  return createClient(url, key);
}

function normalizarEmail(email: unknown) {
  return String(email || "").trim().toLowerCase();
}

function normalizarSenha(senha: unknown) {
  return String(senha || "").trim();
}

function onlyDigits(value: unknown) {
  return String(value || "").replace(/\D/g, "");
}

function hashPassword(email: string, password: string) {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}:${password}:aurora-motoristas`)
    .digest("hex");
}

function isValidRole(role: string): role is AuroraRole {
  return role === "cliente" || role === "motorista";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nome = String(body?.nome || "").trim();
    const email = normalizarEmail(body?.email);
    const senha = normalizarSenha(body?.senha);
    const role = String(body?.role || "").trim().toLowerCase();
    const documento = onlyDigits(body?.documento);
    const telefone = onlyDigits(body?.telefone);
    const captchaOk = Boolean(body?.captchaOk ?? true);
    const site = String(body?.site || "").trim();

    if (site) {
      return NextResponse.json(
        { ok: false, error: "Cadastro bloqueado." },
        { status: 400 }
      );
    }

    if (!captchaOk) {
      return NextResponse.json(
        { ok: false, error: "Confirme que você não é um robô." },
        { status: 400 }
      );
    }

    if (!nome || !email || !senha || !role) {
      return NextResponse.json(
        { ok: false, error: "Preencha nome, e-mail, senha e tipo de acesso." },
        { status: 400 }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { ok: false, error: "Tipo de acesso inválido." },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data: existente } = await supabase
      .from("aurora_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existente?.id) {
      return NextResponse.json(
        { ok: false, error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const idBase = crypto.randomUUID();

    const { error } = await supabase.from("aurora_users").insert({
      nome,
      email,
      password_hash: hashPassword(email, senha),
      role,
      status: role === "motorista" ? "em_analise" : "ativo",
      client_id: role === "cliente" ? `client-${idBase}` : null,
      driver_id: role === "motorista" ? `driver-${idBase}` : null,
      documento,
      telefone,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Erro ao criar acesso." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        role === "motorista"
          ? "Cadastro realizado com sucesso. Seu acesso foi criado e ficará em análise operacional."
          : "Cadastro realizado com sucesso. Você já pode entrar com seu e-mail e senha.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao criar cadastro." },
      { status: 500 }
    );
  }
}