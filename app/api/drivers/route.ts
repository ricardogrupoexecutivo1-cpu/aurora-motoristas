import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function text(value: any) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function cleanDoc(value: any) {
  return text(value).replace(/\D/g, "");
}

export async function GET() {
  const { data, error } = await supabase
    .from("am_drivers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, drivers: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();

  const providerType = text(body.provider_type) || "pessoa_fisica";
  const cpfClean = cleanDoc(body.cpf);
  const cnpjClean = cleanDoc(body.cnpj);

  if (providerType === "pessoa_fisica" && !cpfClean) {
    return NextResponse.json(
      { ok: false, message: "CPF é obrigatório para pessoa física." },
      { status: 400 }
    );
  }

  if ((providerType === "empresa" || providerType === "filial") && !cnpjClean) {
    return NextResponse.json(
      { ok: false, message: "CNPJ é obrigatório para empresa ou filial." },
      { status: 400 }
    );
  }

  const payload = {
    provider_type: providerType,

    full_name: text(body.full_name),
    cpf: text(body.cpf),
    cpf_clean: cpfClean || null,

    cnpj_clean: cnpjClean || null,
    company_name: text(body.company_name),
    trade_name: text(body.trade_name),
    branch_name: text(body.branch_name),

    phone: text(body.phone),
    email: text(body.email),

    cep: text(body.cep),
    address: text(body.address),
    address_number: text(body.address_number),
    neighborhood: text(body.neighborhood),
    city: text(body.city),
    state: text(body.state),
    complement: text(body.complement),

    cnh_number: text(body.cnh_number),

    pix_type: text(body.pix_type),
    pix_key: text(body.pix_key),

    status: "em_analise",
  };

  const { data, error } = await supabase
    .from("am_drivers")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    const duplicate =
      error.message.includes("am_drivers_cpf_clean_unique") ||
      error.message.includes("am_drivers_cnpj_clean_unique") ||
      error.message.includes("duplicate key");

    return NextResponse.json(
      {
        ok: false,
        message: duplicate
          ? "Já existe cadastro com este CPF ou CNPJ."
          : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, driver: data });
}