"use client";

import { useState } from "react";

type EmpresaForm = {
  tipoEmpresa: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
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
  ativo: boolean;
};

const initialForm: EmpresaForm = {
  tipoEmpresa: "Locadora",
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
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
  ativo: true,
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
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

export default function CadastrarEmpresaPage() {
  const [form, setForm] = useState<EmpresaForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingReceita, setLoadingReceita] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  const [fonteReceita, setFonteReceita] = useState("");

  function updateField<K extends keyof EmpresaForm>(field: K, value: EmpresaForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function buscarCnpj() {
    setFeedback("");
    setFonteReceita("");

    const cnpj = onlyDigits(form.cnpj);

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
        cnpj: formatCnpj(company.cnpj || cnpj),
        razaoSocial: company.empresa || current.razaoSocial,
        nomeFantasia: company.nome || current.nomeFantasia,
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

  async function salvarEmpresa() {
    setFeedback("");
    setFonteReceita("");

    if (!form.razaoSocial.trim() && !form.nomeFantasia.trim()) {
      setFeedbackType("error");
      setFeedback("Informe pelo menos a razão social ou o nome fantasia.");
      return;
    }

    if (!form.telefone.trim() && !form.email.trim()) {
      setFeedbackType("error");
      setFeedback("Preencha pelo menos telefone ou e-mail da empresa.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoEmpresa: form.tipoEmpresa,
          razaoSocial: form.razaoSocial.trim(),
          nomeFantasia: form.nomeFantasia.trim(),
          cnpj: onlyDigits(form.cnpj),
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
          ativo: form.ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar a empresa.");
      }

      setFeedbackType("success");
      setFeedback("Empresa cadastrada com sucesso na base do Aurora Motoristas.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado ao salvar empresa.";
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
        background:
          "linear-gradient(180deg, #f4faff 0%, #edf6ff 42%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 16px 48px",
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
          <a href="/" style={pillButton(false)}>
            Voltar
          </a>

          <a href="/" style={pillButton(true)}>
            Início
          </a>

          <a href="/guia" style={pillButton(false)}>
            Guia
          </a>
        </div>

        <section
          style={{
            borderRadius: 30,
            border: "1px solid #dbeafe",
            background:
              "radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 24%), linear-gradient(135deg, #ffffff 0%, #f1f8ff 45%, #eef7ff 100%)",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
            padding: "24px 18px",
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
            Aurora Motoristas • Empresas
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Cadastro de empresas com leitura forte no mobile e busca por CNPJ
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 920,
              color: "#334155",
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Cadastre empresas, locadoras e operações com visual claro premium,
            preenchimento mais simples e consulta automática por CNPJ.
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas durante melhorias.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 28,
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.1,
                  }}
                >
                  Dados da empresa
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#475569",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Estruture a base empresarial antes de ligar clientes, motoristas e serviços.
                </p>
              </div>

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => updateField("ativo", e.target.checked)}
                />
                Ativa na base
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <Field
                label="Tipo de empresa"
                value={form.tipoEmpresa}
                onChange={(value) => updateField("tipoEmpresa", value)}
                placeholder="Ex.: Locadora"
                required
              />

              <div style={{ display: "block" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: 14,
                  }}
                >
                  CNPJ
                </label>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={(e) => updateField("cnpj", formatCnpj(e.target.value))}
                    placeholder="00.000.000/0001-00"
                    style={{
                      flex: "1 1 220px",
                      minWidth: 0,
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

                  <button
                    type="button"
                    onClick={buscarCnpj}
                    disabled={loadingReceita}
                    style={{
                      border: "1px solid #0ea5e9",
                      cursor: loadingReceita ? "not-allowed" : "pointer",
                      opacity: loadingReceita ? 0.7 : 1,
                      padding: "0 16px",
                      height: 50,
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
                </div>
              </div>

              <Field
                label="Razão social"
                value={form.razaoSocial}
                onChange={(value) => updateField("razaoSocial", value)}
                placeholder="Ex.: LET'S RENT A CAR S/A"
                required
              />

              <Field
                label="Nome fantasia"
                value={form.nomeFantasia}
                onChange={(value) => updateField("nomeFantasia", value)}
                placeholder="Ex.: Let's Rent"
              />

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
                placeholder="Observações comerciais, status da operação, segmento, detalhes internos..."
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
              }}
            >
              <button
                type="button"
                onClick={salvarEmpresa}
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
                }}
              >
                {loading ? "Salvando empresa..." : "Salvar empresa"}
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
            }}
          >
            <InfoCard
              title="Uso recomendado"
              text="Cadastre primeiro a empresa para estruturar a base que vai receber clientes, motoristas e serviços."
            />

            <InfoCard
              title="Consulta por CNPJ"
              text="A busca automática ajuda a preencher razão social, nome fantasia, contato e endereço sem perder agilidade."
            />

            <InfoCard
              title="Padrão Aurora"
              text="Visual claro premium, leitura forte no celular e navegação mais limpa para uso diário."
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

function pillButton(primary: boolean) {
  return {
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: 999,
    background: primary ? "#eff6ff" : "#ffffff",
    border: primary ? "1px solid #bfdbfe" : "1px solid #dbeafe",
    color: primary ? "#1d4ed8" : "#0f172a",
    fontWeight: 700,
    fontSize: 14,
  } as const;
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
    <label style={{ display: "block" }}>
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