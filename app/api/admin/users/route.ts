import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type UserRole =
  | "admin_master"
  | "admin"
  | "operacional"
  | "financeiro"
  | "motorista"
  | "visualizacao";

type CreateAdminUserBody = {
  nome?: string;
  email?: string;
  senha_inicial?: string;
  role?: UserRole;
  empresa?: string;
  status?: "ativo" | "inativo";
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurado."
    );
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurado.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function jsonError(
  message: string,
  status = 400,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(extra || {}),
    },
    { status }
  );
}

async function tentarCriarProfile({
  supabase,
  userId,
  nome,
  email,
  role,
  empresa,
  status,
}: {
  supabase: ReturnType<typeof getSupabaseAdmin>;
  userId: string;
  nome: string;
  email: string;
  role: UserRole;
  empresa: string;
  status: "ativo" | "inativo";
}) {
  const tentativas = [
    {
      id: userId,
      email,
      role,
    },
    {
      id: userId,
      email,
      role,
      nome,
    },
    {
      id: userId,
      email,
      role,
      full_name: nome,
    },
    {
      id: userId,
      email,
      role,
      name: nome,
    },
    {
      id: userId,
      email,
      role,
      nome,
      empresa,
      status,
    },
    {
      id: userId,
      email,
      role,
      full_name: nome,
      company_name: empresa,
      status,
    },
    {
      id: userId,
      email,
      user_role: role,
      full_name: nome,
      company_name: empresa,
      status,
    },
  ];

  let lastError: string | null = null;

  for (const payload of tentativas) {
    const { error } = await supabase.from("profiles").upsert(payload);

    if (!error) {
      return {
        profile_created: true,
        profile_warning: null,
      };
    }

    lastError = error.message;
  }

  return {
    profile_created: false,
    profile_warning:
      lastError ||
      "Usuário criado no Auth, mas não foi possível criar o profile com o schema atual.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateAdminUserBody;

    const nome = String(body?.nome || "").trim();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const senhaInicial = String(body?.senha_inicial || "").trim();
    const role = (body?.role || "operacional") as UserRole;
    const empresa = String(body?.empresa || "").trim();
    const status = (body?.status || "ativo") as "ativo" | "inativo";

    if (!nome) {
      return jsonError("Informe o nome do usuário.");
    }

    if (!email) {
      return jsonError("Informe o e-mail do usuário.");
    }

    if (!senhaInicial) {
      return jsonError("Informe a senha inicial.");
    }

    if (!empresa) {
      return jsonError("Informe a empresa do usuário.");
    }

    if (senhaInicial.length < 6) {
      return jsonError("A senha inicial deve ter pelo menos 6 caracteres.");
    }

    const supabase = getSupabaseAdmin();

    const { data: createdUser, error: createAuthError } =
      await supabase.auth.admin.createUser({
        email,
        password: senhaInicial,
        email_confirm: true,
        user_metadata: {
          nome,
          role,
          empresa,
          status,
          origem: "painel_admin_usuarios",
        },
        app_metadata: {
          role,
          empresa,
          status,
          origem: "painel_admin_usuarios",
        },
      });

    if (createAuthError || !createdUser?.user?.id) {
      const message = createAuthError?.message || "ID do usuário não retornado.";

      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("exists") ||
        message.toLowerCase().includes("registered")
      ) {
        return jsonError("Já existe um usuário com este e-mail no Auth.", 409, {
          auth_error: message,
        });
      }

      return jsonError(`Falha ao criar usuário no Auth: ${message}`, 500, {
        auth_error: message,
        debug_env: {
          has_supabase_url: Boolean(
            process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
          ),
          has_service_role_key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        },
      });
    }

    const profileResult = await tentarCriarProfile({
      supabase,
      userId: createdUser.user.id,
      nome,
      email,
      role,
      empresa,
      status,
    });

    return NextResponse.json({
      success: true,
      message: profileResult.profile_created
        ? "Usuário criado no Auth e profile atualizado com sucesso."
        : "Usuário criado no Auth. O profile precisa de ajuste fino no schema.",
      user: {
        id: createdUser.user.id,
        email,
        nome,
        role,
        empresa,
        status,
      },
      profile_created: profileResult.profile_created,
      profile_warning: profileResult.profile_warning,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao criar usuário.";

    return jsonError(message, 500, {
      debug_env: {
        has_supabase_url: Boolean(
          process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        ),
        has_service_role_key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    });
  }
}

