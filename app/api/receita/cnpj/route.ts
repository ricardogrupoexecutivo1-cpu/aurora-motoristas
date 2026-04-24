import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

type BrasilApiResponse = {
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  email?: string;
};

type ReceitaWsResponse = {
  status?: string;
  message?: string;
  nome?: string;
  fantasia?: string;
  situacao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  cnpj?: string;
};

function formatPhoneFromBrasilApi(data: BrasilApiResponse) {
  const raw = `${data.ddd_telefone_1 ?? ""}`.trim();
  return raw || "";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = onlyDigits(searchParams.get("cnpj") || "");

    if (!cnpj || cnpj.length !== 14) {
      return NextResponse.json(
        { error: "Informe um CNPJ vÃ¡lido com 14 dÃ­gitos." },
        { status: 400 }
      );
    }

    try {
      const brasilApiResponse = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (brasilApiResponse.ok) {
        const data = (await brasilApiResponse.json()) as BrasilApiResponse;

        return NextResponse.json({
          success: true,
          source: "BrasilAPI",
          company: {
            cnpj: data.cnpj || cnpj,
            nome: data.nome_fantasia || data.razao_social || "",
            empresa: data.razao_social || data.nome_fantasia || "",
            responsavel: "",
            telefone: formatPhoneFromBrasilApi(data),
            email: data.email || "",
            cep: data.cep || "",
            endereco: data.logradouro || "",
            numero: data.numero || "",
            bairro: data.bairro || "",
            cidade: data.municipio || "",
            estado: data.uf || "",
            observacoes: data.descricao_situacao_cadastral
              ? `SituaÃ§Ã£o cadastral: ${data.descricao_situacao_cadastral}`
              : "",
          },
        });
      }
    } catch {
      // segue para fallback
    }

    try {
      const receitaWsResponse = await fetch(
        `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (receitaWsResponse.ok) {
        const data = (await receitaWsResponse.json()) as ReceitaWsResponse;

        if (data.status !== "ERROR") {
          return NextResponse.json({
            success: true,
            source: "ReceitaWS",
            company: {
              cnpj: data.cnpj || cnpj,
              nome: data.fantasia || data.nome || "",
              empresa: data.nome || data.fantasia || "",
              responsavel: "",
              telefone: data.telefone || "",
              email: data.email || "",
              cep: data.cep || "",
              endereco: data.logradouro || "",
              numero: data.numero || "",
              bairro: data.bairro || "",
              cidade: data.municipio || "",
              estado: data.uf || "",
              observacoes: data.situacao
                ? `SituaÃ§Ã£o cadastral: ${data.situacao}`
                : "",
            },
          });
        }

        return NextResponse.json(
          { error: data.message || "CNPJ nÃ£o encontrado na ReceitaWS." },
          { status: 404 }
        );
      }
    } catch {
      // falhou tambÃ©m
    }

    return NextResponse.json(
      {
        error:
          "NÃ£o foi possÃ­vel consultar o CNPJ agora. Tente novamente em instantes.",
      },
      { status: 502 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao consultar CNPJ.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
