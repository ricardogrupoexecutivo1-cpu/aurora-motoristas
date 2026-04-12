"use client";

import { useState } from "react";

type MotoristaForm = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cnh: string;
  cep: string;
  endereco: string;
  complemento: string;
  cidade: string;
  estado: string;
  foto_url: string;
  observacoes: string;
  ativo: boolean;
};

const initialForm: MotoristaForm = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  cnh: "",
  cep: "",
  endereco: "",
  complemento: "",
  cidade: "",
  estado: "",
  foto_url: "",
  observacoes: "",
  ativo: true,
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
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

export default function CadastrarMotoristaPage() {
  const [form, setForm] = useState<MotoristaForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  function updateField<K extends keyof MotoristaForm>(field: K, value: MotoristaForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function salvarMotorista() {
    setFeedback("");

    if (!form.nome.trim()) {
      setFeedbackType("error");
      setFeedback("Informe o nome do motorista.");
      return;
    }

    if (!form.telefone.trim()) {
      setFeedbackType("error");
      setFeedback("Informe o telefone principal do motorista.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/motoristas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome.trim(),
          cpf: onlyDigits(form.cpf),
          telefone: onlyDigits(form.telefone),
          email: form.email.trim(),
          cnh: form.cnh.trim(),
          cep: onlyDigits(form.cep),
          endereco: form.endereco.trim(),
          complemento: form.complemento.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          foto_url: form.foto_url.trim(),
          observacoes: form.observacoes.trim(),
          ativo: form.ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar o motorista.");
      }

      setFeedbackType("success");
      setFeedback("Motorista cadastrado com sucesso na base do Aurora Motoristas.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado ao salvar motorista.";
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
          <a href="/motoristas" style={pillButton(false)}>
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
            Aurora Motoristas • Cadastro premium
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Cadastrar motorista com visual claro e leitura forte no mobile
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
            Cadastre motoristas com dados principais, contato, endereço, CNH,
            observações e foto. Esta tela foi organizada para facilitar o uso no
            celular e no desktop, com padrão premium do Aurora Motoristas.
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas durante melhorias.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            <MiniHighlight
              title="Entrada rápida"
              text="Formulário pensado para cadastro real sem poluição visual."
            />
            <MiniHighlight
              title="Mobile melhorado"
              text="Leitura mais limpa, blocos consistentes e botões fortes."
            />
            <MiniHighlight
              title="Pronto para crescer"
              text="Base preparada para foto, filtros e fluxo operacional."
            />
          </div>
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
                  Dados do motorista
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#475569",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Preencha os dados essenciais para formar sua base operacional.
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
                Ativo na base
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
                label="Nome completo"
                value={form.nome}
                onChange={(value) => updateField("nome", value)}
                placeholder="Ex.: Ricardo Leonardo Moreira"
                required
              />

              <Field
                label="CPF"
                value={form.cpf}
                onChange={(value) => updateField("cpf", formatCpf(value))}
                placeholder="000.000.000-00"
              />

              <Field
                label="Telefone"
                value={form.telefone}
                onChange={(value) => updateField("telefone", formatPhone(value))}
                placeholder="(31) 99999-9999"
                required
              />

              <Field
                label="E-mail"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                placeholder="motorista@email.com"
                type="email"
              />

              <Field
                label="CNH"
                value={form.cnh}
                onChange={(value) => updateField("cnh", value)}
                placeholder="Número da CNH"
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
                label="Complemento"
                value={form.complemento}
                onChange={(value) => updateField("complemento", value)}
                placeholder="Casa, apto, bloco, referência"
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

              <Field
                label="Foto URL"
                value={form.foto_url}
                onChange={(value) => updateField("foto_url", value)}
                placeholder="https://..."
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
                placeholder="Informações operacionais, disponibilidade, preferências, observações internas..."
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
                onClick={salvarMotorista}
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
                {loading ? "Salvando motorista..." : "Salvar motorista"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setFeedback("");
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
              text="Cadastre primeiro os motoristas principais da operação. Depois nós dois ligamos isso com serviços, pagamentos e histórico protegido."
            />

            <InfoCard
              title="Fluxo mais eficiente"
              text="Use nome, telefone e status ativo como base mínima. CNH, foto e endereço fortalecem a operação e a confiança."
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

function MiniHighlight({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
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