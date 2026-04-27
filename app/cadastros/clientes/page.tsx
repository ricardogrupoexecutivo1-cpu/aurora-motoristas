"use client";

import { useEffect, useMemo, useState } from "react";

type ClienteForm = {
  tipoPessoa: "PF" | "PJ";
  nome: string;
  empresa: string;
  cpfCnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  observacoes: string;
};

const initialForm: ClienteForm = {
  tipoPessoa: "PJ",
  nome: "",
  empresa: "",
  cpfCnpj: "",
  responsavel: "",
  telefone: "",
  email: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpfCnpj(value: string) {
  const digits = onlyDigits(value);

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export default function ClientesPage() {
  const [form, setForm] = useState<ClienteForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingReceita, setLoadingReceita] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  const [fonteReceita, setFonteReceita] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tituloPrincipal = useMemo(() => {
    return form.tipoPessoa === "PJ"
      ? "Cadastro de clientes empresariais"
      : "Cadastro de clientes pessoa física";
  }, [form.tipoPessoa]);

  function updateField<K extends keyof ClienteForm>(field: K, value: ClienteForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function buscarNaReceita() {
    setFeedback("");
    setFonteReceita("");

    if (form.tipoPessoa !== "PJ") {
      setFeedbackType("info");
      setFeedback("A busca automática na Receita está disponível no modo PJ com CNPJ.");
      return;
    }

    const cnpj = onlyDigits(form.cpfCnpj);

    if (cnpj.length !== 14) {
      setFeedbackType("error");
      setFeedback("Informe um CNPJ válido com 14 dígitos para consultar.");
      return;
    }

    try {
      setLoadingReceita(true);

      const response = await fetch(`/api/receita/cnpj?cnpj=${cnpj}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível consultar o CNPJ.");
      }

      const company = data?.company || {};

      setForm((current) => ({
        ...current,
        nome: company.nome || current.nome,
        empresa: company.empresa || current.empresa,
        cpfCnpj: formatCpfCnpj(company.cnpj || cnpj),
        responsavel: company.responsavel || current.responsavel,
        telefone: company.telefone ? formatPhone(company.telefone) : current.telefone,
        email: company.email || current.email,
        cep: company.cep ? formatCep(company.cep) : current.cep,
        endereco: company.endereco || current.endereco,
        numero: company.numero || current.numero,
        bairro: company.bairro || current.bairro,
        cidade: company.cidade || current.cidade,
        estado: company.estado || current.estado,
        observacoes: company.observacoes || current.observacoes,
      }));

      setFonteReceita(data?.source || "");
      setFeedbackType("success");
      setFeedback("CNPJ consultado com sucesso. Dados preenchidos automaticamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado ao consultar CNPJ.";
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setLoadingReceita(false);
    }
  }

  async function salvarCliente() {
    setFeedback("");

    if (!form.nome.trim()) {
      setFeedbackType("error");
      setFeedback("Informe pelo menos o nome do cliente.");
      return;
    }

    if (!form.telefone.trim() && !form.email.trim()) {
      setFeedbackType("error");
      setFeedback("Preencha pelo menos telefone ou e-mail para contato.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoPessoa: form.tipoPessoa,
          nome: form.nome.trim(),
          empresa: form.empresa.trim(),
          cpfCnpj: onlyDigits(form.cpfCnpj),
          responsavel: form.responsavel.trim(),
          telefone: onlyDigits(form.telefone),
          email: form.email.trim(),
          cep: onlyDigits(form.cep),
          endereco: form.endereco.trim(),
          numero: form.numero.trim(),
          bairro: form.bairro.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          observacoes: form.observacoes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar o cliente.");
      }

      setFeedbackType("success");
      setFeedback("Cliente cadastrado com sucesso na base do Aurora Motoristas.");
      setFonteReceita("");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado ao salvar cliente.";
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4faff 0%, #edf6ff 40%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: isMobile ? "20px 12px 40px" : "20px 16px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 999,
              background: "#ffffff",
              border: "1px solid #dbeafe",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Voltar
          </a>

          <a
            href="/"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 999,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Início
          </a>
        </div>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            border: "1px solid #dbeafe",
            background:
              "radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 26%), linear-gradient(135deg, #ffffff 0%, #f3f9ff 45%, #eef7ff 100%)",
            boxShadow: "0 25px 70px rgba(15, 23, 42, 0.08)",
            padding: isMobile ? "20px 14px" : "22px 18px",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              color: "#0369a1",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Aurora Motoristas â€¢ Clientes
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {tituloPrincipal}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 850,
              color: "#334155",
              lineHeight: 1.65,
              fontSize: 16,
            }}
          >
            Cadastre clientes corporativos e clientes finais em um fluxo bonito,
            simples e pronto para crescer com filtros, integrações, CPF/CNPJ e
            histórico comercial. Sistema em constante atualização e pode haver
            momentos de instabilidade durante melhorias.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            {[
              ["Base comercial", "Cadastro estruturado para operação real"],
              ["Contato rápido", "Telefone, e-mail e responsável"],
              ["Expansão pronta", "Fluxo preparado para CPF/CNPJ e filtros"],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid #dbeafe",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#1d4ed8",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#475569",
                    lineHeight: 1.55,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 28,
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
              padding: isMobile ? 16 : 18,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "stretch" : "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 18,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.1,
                  }}
                >
                  Dados do cliente
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#475569",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Preencha os dados principais para salvar a base comercial com padrão premium.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  background: "#f8fafc",
                  padding: 6,
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  alignSelf: isMobile ? "flex-start" : "auto",
                }}
              >
                {(["PJ", "PF"] as const).map((tipo) => {
                  const active = form.tipoPessoa === tipo;
                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => updateField("tipoPessoa", tipo)}
                      style={{
                        border: "none",
                        cursor: "pointer",
                        padding: "10px 16px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 14,
                        background: active ? "#0ea5e9" : "transparent",
                        color: active ? "#ffffff" : "#334155",
                      }}
                    >
                      {tipo}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <Field
                label={form.tipoPessoa === "PJ" ? "Nome fantasia / cliente" : "Nome completo"}
                value={form.nome}
                onChange={(value) => updateField("nome", value)}
                placeholder={
                  form.tipoPessoa === "PJ"
                    ? "Ex.: Aurora Locadora Premium"
                    : "Ex.: Ricardo Leonardo Moreira"
                }
                required
              />

              <Field
                label="Empresa"
                value={form.empresa}
                onChange={(value) => updateField("empresa", value)}
                placeholder="Ex.: Grupo Executivo Service"
              />

              <div style={{ display: "block", minWidth: 0 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: 14,
                  }}
                >
                  {form.tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
                </label>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "stretch" : "center",
                  }}
                >
                  <input
                    type="text"
                    value={form.cpfCnpj}
                    onChange={(e) => updateField("cpfCnpj", formatCpfCnpj(e.target.value))}
                    placeholder={
                      form.tipoPessoa === "PJ"
                        ? "00.000.000/0001-00"
                        : "000.000.000-00"
                    }
                    style={{
                      flex: "1 1 220px",
                      minWidth: 0,
                      width: isMobile ? "100%" : "auto",
                      height: 50,
                      borderRadius: 16,
                      border: "1px solid #cbd5e1",
                      background: "#f8fbff",
                      padding: "0 16px",
                      fontSize: 15,
                      color: "#0f172a",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  {form.tipoPessoa === "PJ" ? (
                    <button
                      type="button"
                      onClick={buscarNaReceita}
                      disabled={loadingReceita}
                      style={{
                        border: "1px solid #0ea5e9",
                        cursor: loadingReceita ? "not-allowed" : "pointer",
                        opacity: loadingReceita ? 0.7 : 1,
                        padding: "0 16px",
                        height: 50,
                        width: isMobile ? "100%" : "auto",
                        borderRadius: 16,
                        background: "#e0f2fe",
                        color: "#0369a1",
                        fontWeight: 800,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {loadingReceita ? "Buscando..." : "Buscar na Receita"}
                    </button>
                  ) : null}
                </div>
              </div>

              <Field
                label="Responsável"
                value={form.responsavel}
                onChange={(value) => updateField("responsavel", value)}
                placeholder="Nome do contato principal"
              />

              <Field
                label="Telefone"
                value={form.telefone}
                onChange={(value) => updateField("telefone", formatPhone(value))}
                placeholder="(31) 99999-9999"
              />

              <Field
                label="E-mail"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                placeholder="contato@empresa.com"
                type="email"
              />

              <Field
                label="CEP"
                value={form.cep}
                onChange={(value) => updateField("cep", formatCep(value))}
                placeholder="00000-000"
              />

              <Field
                label="Endereço"
                value={form.endereco}
                onChange={(value) => updateField("endereco", value)}
                placeholder="Rua, avenida ou rodovia"
              />

              <Field
                label="Número"
                value={form.numero}
                onChange={(value) => updateField("numero", value)}
                placeholder="Ex.: 120"
              />

              <Field
                label="Bairro"
                value={form.bairro}
                onChange={(value) => updateField("bairro", value)}
                placeholder="Ex.: Centro"
              />

              <Field
                label="Cidade"
                value={form.cidade}
                onChange={(value) => updateField("cidade", value)}
                placeholder="Ex.: Belo Horizonte"
              />

              <Field
                label="Estado"
                value={form.estado}
                onChange={(value) => updateField("estado", value.toUpperCase().slice(0, 2))}
                placeholder="MG"
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: 14,
                }}
              >
                Observações
              </label>
              <textarea
                value={form.observacoes}
                onChange={(e) => updateField("observacoes", e.target.value)}
                placeholder="Anotações comerciais, origem do lead, necessidades, histórico de atendimento..."
                rows={5}
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: 18,
                  border: "1px solid #cbd5e1",
                  background: "#f8fbff",
                  padding: "14px 16px",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {feedback ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  padding: "14px 16px",
                  border:
                    feedbackType === "success"
                      ? "1px solid #bbf7d0"
                      : feedbackType === "error"
                      ? "1px solid #fecaca"
                      : "1px solid #bae6fd",
                  background:
                    feedbackType === "success"
                      ? "#f0fdf4"
                      : feedbackType === "error"
                      ? "#fef2f2"
                      : "#f0f9ff",
                  color:
                    feedbackType === "success"
                      ? "#166534"
                      : feedbackType === "error"
                      ? "#991b1b"
                      : "#0c4a6e",
                  fontWeight: 700,
                  lineHeight: 1.55,
                }}
              >
                {feedback}
                {fonteReceita ? ` Fonte: ${fonteReceita}.` : ""}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 18,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button
                type="button"
                onClick={salvarCliente}
                disabled={loading}
                style={{
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  padding: "14px 20px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {loading ? "Salvando cliente..." : "Salvar cliente"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setFeedback("");
                  setFonteReceita("");
                }}
                style={{
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                  padding: "14px 20px",
                  borderRadius: 16,
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: 15,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Limpar formulário
              </button>
            </div>
          </div>

          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              minWidth: 0,
            }}
          >
            <InfoCard
              title="Orientação operacional"
              text="Cadastre primeiro o cliente com o contato principal. Depois nós dois ligamos este fluxo com serviços, propostas, pagamentos e histórico protegido."
            />

            <InfoCard
              title="Estrutura preparada"
              text="A tela agora já suporta busca por CNPJ e preenchimento automático quando a fonte responder."
            />

            <InfoCard
              title="Padrão Aurora"
              text="Visual claro premium, leitura forte no desktop e no celular, sem quebrar a operação atual."
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "block", minWidth: 0 }}>
      <span
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 700,
          color: "#0f172a",
          fontSize: 14,
        }}
      >
        {label} {required ? <span style={{ color: "#dc2626" }}>*</span> : null}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 16,
          border: "1px solid #cbd5e1",
          background: "#f8fbff",
          padding: "0 16px",
          fontSize: 15,
          color: "#0f172a",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbeafe",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        padding: 18,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          color: "#1d4ed8",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#475569",
          lineHeight: 1.65,
          fontSize: 15,
        }}
      >
        {text}
      </div>
    </div>
  );
}

