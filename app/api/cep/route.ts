import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type BrasilApiCepResponse = {
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cep = onlyDigits(searchParams.get("cep") || "");

    if (!cep || cep.length !== 8) {
      return NextResponse.json(
        { error: "Informe um CEP válido com 8 dígitos." },
        { status: 400 }
      );
    }

    try {
      const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (viaCepResponse.ok) {
        const data = (await viaCepResponse.json()) as ViaCepResponse;

        if (!data.erro) {
          return NextResponse.json({
            success: true,
            source: "ViaCEP",
            address: {
              cep: data.cep || cep,
              endereco: data.logradouro || "",
              complemento: data.complemento || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            },
          });
        }
      }
    } catch {
      // segue para fallback
    }

    try {
      const brasilApiResponse = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (brasilApiResponse.ok) {
        const data = (await brasilApiResponse.json()) as BrasilApiCepResponse;

        return NextResponse.json({
          success: true,
          source: "BrasilAPI",
          address: {
            cep: data.cep || cep,
            endereco: data.street || "",
            complemento: "",
            bairro: data.neighborhood || "",
            cidade: data.city || "",
            estado: data.state || "",
          },
        });
      }
    } catch {
      // fallback falhou também
    }

    return NextResponse.json(
      { error: "Não foi possível consultar o CEP agora. Tente novamente em instantes." },
      { status: 502 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao consultar CEP.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

