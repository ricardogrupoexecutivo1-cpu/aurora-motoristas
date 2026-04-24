export type TipoDocumento = "cpf" | "cnpj";

export type ReceitaResultado = {
  tipo: TipoDocumento;
  nome: string;
  fantasia: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type ReceitaErro = {
  erro: string;
};

export function limparDocumento(doc: string) {
  return String(doc || "").replace(/\D/g, "");
}

export function detectarTipo(doc: string): TipoDocumento | null {
  if (doc.length === 11) return "cpf";
  if (doc.length === 14) return "cnpj";
  return null;
}

function somenteTexto(valor: unknown) {
  return String(valor || "").trim();
}

function normalizarTelefone(valor: unknown) {
  return String(valor || "")
    .replace(/\s+/g, " ")
    .trim();
}

function montarResultado(base?: Partial<ReceitaResultado> & { tipo: TipoDocumento }): ReceitaResultado {
  return {
    tipo: base?.tipo || "cnpj",
    nome: somenteTexto(base?.nome),
    fantasia: somenteTexto(base?.fantasia),
    telefone: normalizarTelefone(base?.telefone),
    email: somenteTexto(base?.email),
    cep: limparDocumento(String(base?.cep || "")),
    logradouro: somenteTexto(base?.logradouro),
    numero: somenteTexto(base?.numero),
    bairro: somenteTexto(base?.bairro),
    cidade: somenteTexto(base?.cidade),
    estado: somenteTexto(base?.estado).toUpperCase().slice(0, 2),
  };
}

async function tentarBrasilApiCnpj(doc: string): Promise<ReceitaResultado | ReceitaErro> {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${doc}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const texto = await response.text().catch(() => "");
      return { erro: texto || "BrasilAPI indisponÃ­vel para este CNPJ." };
    }

    const data = await response.json();

    return montarResultado({
      tipo: "cnpj",
      nome: data?.razao_social || "",
      fantasia: data?.nome_fantasia || "",
      telefone: data?.ddd_telefone_1 || data?.ddd_telefone_2 || "",
      email: data?.email || "",
      cep: data?.cep || "",
      logradouro: data?.logradouro || "",
      numero: data?.numero || "",
      bairro: data?.bairro || "",
      cidade: data?.municipio || "",
      estado: data?.uf || "",
    });
  } catch {
    return { erro: "Falha ao consultar BrasilAPI." };
  }
}

async function tentarReceitaWsCnpj(doc: string): Promise<ReceitaResultado | ReceitaErro> {
  try {
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${doc}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const texto = await response.text().catch(() => "");
      return { erro: texto || "ReceitaWS indisponÃ­vel para este CNPJ." };
    }

    const data = await response.json();

    if (data?.status === "ERROR") {
      return { erro: data?.message || "ReceitaWS retornou erro." };
    }

    return montarResultado({
      tipo: "cnpj",
      nome: data?.nome || "",
      fantasia: data?.fantasia || "",
      telefone: data?.telefone || "",
      email: data?.email || "",
      cep: data?.cep || "",
      logradouro: data?.logradouro || "",
      numero: data?.numero || "",
      bairro: data?.bairro || "",
      cidade: data?.municipio || "",
      estado: data?.uf || "",
    });
  } catch {
    return { erro: "Falha ao consultar ReceitaWS." };
  }
}

async function tentarCpfPlaceholder(doc: string): Promise<ReceitaResultado | ReceitaErro> {
  return montarResultado({
    tipo: "cpf",
    nome: "",
    fantasia: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
}

export async function buscarReceita(documento: string): Promise<ReceitaResultado | ReceitaErro> {
  const doc = limparDocumento(documento);
  const tipo = detectarTipo(doc);

  if (!tipo) {
    return { erro: "Documento invÃ¡lido." };
  }

  if (tipo === "cpf") {
    return tentarCpfPlaceholder(doc);
  }

  const brasilApi = await tentarBrasilApiCnpj(doc);
  if (!("erro" in brasilApi)) {
    return brasilApi;
  }

  const receitaWs = await tentarReceitaWsCnpj(doc);
  if (!("erro" in receitaWs)) {
    return receitaWs;
  }

  return {
    erro:
      brasilApi.erro && receitaWs.erro
        ? `Erro ao consultar Receita. BrasilAPI: ${brasilApi.erro} | ReceitaWS: ${receitaWs.erro}`
        : "Erro ao consultar Receita.",
  };
}
