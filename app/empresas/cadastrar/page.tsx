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
  senha: string;
  confirmarSenha: string;
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
  senha: "",
  confirmarSenha: "",
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

    if (!form.email.trim() || !form.email.includes("@")) {
      setFeedbackType("error");
      setFeedback("Informe um e-mail válido para criar o acesso da empresa.");
      return;
    }

    if (!form.telefone.trim()) {
      setFeedbackType("error");
      setFeedback("Preencha o telefone da empresa.");
      return;
    }

    if (!form.senha || form.senha.length < 6) {
      setFeedbackType("error");
      setFeedback("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setFeedbackType("error");
      setFeedback("As senhas não coincidem.");
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
        throw new Error(data?.error || data?.message || "Não foi possível salvar a empresa.");
      }

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "cliente",
          nome: form.razaoSocial.trim() || form.nomeFantasia.trim(),
          email: form.email.trim(),
          senha: form.senha,
          documento: onlyDigits(form.cnpj),
          telefone: onlyDigits(form.telefone),
          captchaOk: true,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok || !registerData?.ok) {
        throw new Error(
          registerData?.error ||
            "Empresa salva, mas não foi possível criar o acesso de login."
        );
      }

      setFeedbackType("success");
      setFeedback("Empresa cadastrada com sucesso. O acesso foi criado e já pode entrar pelo login.");
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
        background: "#020617",
        color: "#ffffff",
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

          <a href="/entrar" style={pillButton(false)}>
            Entrar
          </a>
        </div>

        <section
          style={{
            borderRadius: 30,
            border: "1px solid rgba(56, 189, 248, 0.24)",
            background:
              "radial-gradient(circle at top right, rgba(14, 165, 233, 0.26), transparent 24%), linear-gradient(135deg, #0f172a 0%, #020617 60%, #0f172a 100%)",
            boxShadow: "0 24px 70px rgba(14, 165, 233, 0.12)",
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
              background: "rgba(14, 165, 233, 0.14)",
              border: "1px solid rgba(56, 189, 248, 0.30)",
              color: "#7dd3fc",
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
              color: "#ffffff",
            }}
          >
            Cadastro de empresas com acesso próprio
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 920,
              color: "#cbd5e1",
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Cadastre empresas, locadoras e operações. A empresa será salva na base
            operacional e também receberá acesso próprio para entrar pelo login oficial.
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
              background: "#0f172a",
              border: "1px solid rgba(56, 189, 248, 0.20)",
              borderRadius: 28,
              boxShadow: "0 20px 60px rgba(2, 6, 23, 0.55)",
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
                    color: "#ffffff",
                  }}
                >
                  Dados da empresa
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#94a3b8",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Estruture a base empresarial e crie o acesso de login da empresa.
                </p>
              </div>

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "#111827",
                  border: "1px solid #334155",
                  fontWeight: 800,
                  color: "#e2e8f0",
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
                    color: "#e2e8f0",
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
                    style={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={buscarCnpj}
                    disabled={loadingReceita}
                    style={{
                      border: "1px solid #38bdf8",
                      cursor: loadingReceita ? "not-allowed" : "pointer",
                      opacity: loadingReceita ? 0.7 : 1,
                      padding: "0 16px",
                      height: 50,
                      borderRadius: 16,
                      background: "#38bdf8",
                      color: "#020617",
                      fontWeight: 900,
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
                required
              />

              <Field
                label="E-mail de acesso"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                placeholder="contato@empresa.com"
                type="email"
                required
              />

              <Field
                label="Senha de acesso"
                value={form.senha}
                onChange={(value) => updateField("senha", value)}
                placeholder="Crie uma senha"
                type="password"
                required
              />

              <Field
                label="Confirmar senha"
                value={form.confirmarSenha}
                onChange={(value) => updateField("confirmarSenha", value)}
                placeholder="Repita a senha"
                type="password"
                required
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
                  color: "#e2e8f0",
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
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
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
                      ? "1px solid #22c55e"
                      : feedbackType === "error"
                      ? "1px solid #ef4444"
                      : "1px solid #38bdf8",
                  background:
                    feedbackType === "success"
                      ? "rgba(34, 197, 94, 0.12)"
                      : feedbackType === "error"
                      ? "rgba(239, 68, 68, 0.12)"
                      : "rgba(56, 189, 248, 0.12)",
                  color:
                    feedbackType === "success"
                      ? "#86efac"
                      : feedbackType === "error"
                      ? "#fca5a5"
                      : "#7dd3fc",
                  fontWeight: 800,
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
                  fontWeight: 900,
                  fontSize: 15,
                  boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)",
                }}
              >
                {loading ? "Salvando empresa..." : "Salvar empresa e criar acesso"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setFeedback("");
                  setFonteReceita("");
                }}
                style={{
                  border: "1px solid #334155",
                  cursor: "pointer",
                  padding: "14px 20px",
                  borderRadius: 16,
                  background: "#111827",
                  color: "#e2e8f0",
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
              title="Acesso próprio"
              text="O e-mail e senha informados serão usados pela empresa na tela oficial de login."
            />

            <InfoCard
              title="Padrão Aurora"
              text="Visual premium escuro, leitura forte no celular e navegação limpa para uso diário."
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  flex: "1 1 220px",
  minWidth: 0,
  width: "100%",
  height: 50,
  borderRadius: 16,
  border: "1px solid #334155",
  background: "#020617",
  padding: "0 16px",
  fontSize: 15,
  color: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

function pillButton(primary: boolean) {
  return {
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: 999,
    background: primary ? "#38bdf8" : "#0f172a",
    border: primary ? "1px solid #38bdf8" : "1px solid #334155",
    color: primary ? "#020617" : "#e2e8f0",
    fontWeight: 800,
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
          color: "#e2e8f0",
          fontSize: 14,
        }}
      >
        {label} {required ? <span style={{ color: "#f87171" }}>*</span> : null}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </label>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(56, 189, 248, 0.18)",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(2, 6, 23, 0.40)",
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 900,
          textTransform: "uppercase",
          color: "#7dd3fc",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.65,
          fontSize: 15,
        }}
      >
        {text}
      </div>
    </div>
  );
}