"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MotoristaDraft = {
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCnh: string;
  validadeCnh: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cidade: string;
  estado: string;
  endereco: string;
  cep: string;
  profissao: string;
  empresaIndicada: string;
  disponibilidade: string;
  experiencia: string;
  observacoes: string;
  aceitaChamadosWhatsapp: boolean;
  aceitaTermos: boolean;
};

const DRAFT_KEY = "aurora_motoristas_motorista_novo_draft";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function maskCpf(value: string) {
  const digits = normalizeDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function maskPhone(value: string) {
  const digits = normalizeDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function maskCep(value: string) {
  const digits = normalizeDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatDateForInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildInitialState(): MotoristaDraft {
  return {
    nome: "",
    cpf: "",
    cnh: "",
    categoriaCnh: "B",
    validadeCnh: "",
    telefone: "",
    whatsapp: "",
    email: "",
    cidade: "",
    estado: "MG",
    endereco: "",
    cep: "",
    profissao: "Motorista",
    empresaIndicada: "",
    disponibilidade: "Conforme chamados",
    experiencia: "",
    observacoes: "",
    aceitaChamadosWhatsapp: true,
    aceitaTermos: false,
  };
}

function hasUsefulData(draft: Partial<MotoristaDraft> | null | undefined) {
  if (!draft) return false;

  const keys: Array<keyof MotoristaDraft> = [
    "nome",
    "cpf",
    "cnh",
    "telefone",
    "whatsapp",
    "email",
    "cidade",
    "estado",
    "endereco",
    "cep",
    "empresaIndicada",
    "experiencia",
    "observacoes",
  ];

  return keys.some((key) => String(draft[key] || "").trim().length > 0);
}

function montarObservacoesCompletas(form: MotoristaDraft) {
  const blocos = [
    form.observacoes?.trim() ? `Observações livres: ${form.observacoes.trim()}` : "",
    form.profissao?.trim() ? `Profissão: ${form.profissao.trim()}` : "",
    form.categoriaCnh?.trim() ? `Categoria CNH: ${form.categoriaCnh.trim()}` : "",
    form.validadeCnh?.trim() ? `Validade CNH: ${form.validadeCnh.trim()}` : "",
    form.telefone?.trim() ? `Telefone secundário: ${form.telefone.trim()}` : "",
    form.whatsapp?.trim() ? `WhatsApp principal: ${form.whatsapp.trim()}` : "",
    form.empresaIndicada?.trim() ? `Empresa indicada / referência: ${form.empresaIndicada.trim()}` : "",
    form.disponibilidade?.trim() ? `Disponibilidade: ${form.disponibilidade.trim()}` : "",
    form.experiencia?.trim() ? `Experiência: ${form.experiencia.trim()}` : "",
    `Aceita chamados via WhatsApp: ${form.aceitaChamadosWhatsapp ? "Sim" : "Não"}`,
    "Origem do cadastro: cadastro_motorista_publico",
    "Status inicial desejado: pendente",
  ];

  return blocos.filter(Boolean).join(" | ");
}

export default function NovoMotoristaPage() {
  const [form, setForm] = useState<MotoristaDraft>(buildInitialState());
  const [statusText, setStatusText] = useState("Tela pronta para novo cadastro.");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    try {
      const cached = localStorage.getItem(DRAFT_KEY);

      if (!cached) return;

      const parsed = JSON.parse(cached) as Partial<MotoristaDraft>;
      if (!hasUsefulData(parsed)) return;

      setForm({
        ...buildInitialState(),
        ...parsed,
      });

      setStatusText("Rascunho local recuperado com sucesso.");
    } catch {
      setStatusText("Tela pronta para novo cadastro.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // sem impacto
    }
  }, [form]);

  const resumoDisponibilidade = useMemo(() => {
    return form.disponibilidade || "Conforme chamados";
  }, [form.disponibilidade]);

  function updateField<K extends keyof MotoristaDraft>(
    key: K,
    value: MotoristaDraft[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function limparFormulario() {
    const next = buildInitialState();
    setForm(next);

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // sem impacto
    }

    setFeedback("");
    setFeedbackType("info");
    setStatusText("Formulário limpo para novo cadastro.");
  }

  function validarFormulario() {
    if (!form.nome.trim()) return "Informe o nome completo do motorista.";
    if (normalizeDigits(form.cpf).length !== 11) return "Informe um CPF válido.";
    if (!form.cnh.trim()) return "Informe o número da CNH.";
    if (!form.validadeCnh) return "Informe a validade da CNH.";
    if (!form.whatsapp.trim()) return "Informe o WhatsApp principal.";
    if (!form.cidade.trim()) return "Informe a cidade.";
    if (!form.estado.trim()) return "Informe o estado.";
    if (!form.aceitaTermos) {
      return "É necessário aceitar o termo para enviar o cadastro.";
    }

    return "";
  }

  async function salvarMotorista() {
    const erro = validarFormulario();

    if (erro) {
      setFeedbackType("error");
      setFeedback(erro);
      setStatusText(erro);
      return;
    }

    const telefonePrincipal = normalizeDigits(form.whatsapp || form.telefone);
    const observacoesCompletas = montarObservacoesCompletas(form);

    try {
      setSaving(true);
      setFeedback("");
      setStatusText("Enviando cadastro do motorista para a base real...");

      const response = await fetch("/api/motoristas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome.trim(),
          cpf: normalizeDigits(form.cpf),
          cnh: form.cnh.trim(),
          telefone: telefonePrincipal,
          email: form.email.trim(),
          cep: normalizeDigits(form.cep),
          endereco: form.endereco.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim().toUpperCase(),
          observacoes: observacoesCompletas,
          foto_url: "",
          ativo: false,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          "Não foi possível enviar o cadastro do motorista.";
        throw new Error(message);
      }

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // sem impacto
      }

      setForm(buildInitialState());
      setFeedbackType("success");
      setFeedback(
        "Cadastro enviado com sucesso para a base do Aurora Motoristas. Status inicial: pendente para análise."
      );
      setStatusText("Cadastro enviado com sucesso para análise.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao salvar o cadastro do motorista.";

      setFeedbackType("error");
      setFeedback(message);
      setStatusText(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/quero-ser-motorista" style={topLinkStyle}>
              Voltar
            </Link>

            <Link href="/" style={topLinkStyle}>
              Início
            </Link>
          </div>

          <div style={statusBadgeStyle}>{saving ? "Enviando..." : statusText}</div>
        </div>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={chipBlue}>Aurora Motoristas</span>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Cadastro de novo motorista
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              Preencha seus dados para entrar na base de motoristas parceiros.
              O cadastro entra com status inicial <strong>pendente</strong> e
              poderá ser analisado pela administração antes da liberação.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={miniChip}>Cadastro com análise</span>
              <span style={miniChip}>Entrada prática</span>
              <span style={miniChip}>Base real</span>
            </div>

            <div style={infoCardStyle}>
              <div style={infoTitleStyle}>Como funciona</div>
              <div style={infoTextStyle}>
                Você envia o cadastro, a base registra o motorista e a equipe
                interna pode avaliar a entrada operacional conforme a demanda.
              </div>
            </div>
          </div>

          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Resumo do envio</div>

            <SummaryLine label="Status inicial" value="pendente" />
            <SummaryLine label="Disponibilidade" value={resumoDisponibilidade} />
            <SummaryLine label="Destino do cadastro" value="Supabase" />
            <SummaryLine label="WhatsApp principal" value={form.whatsapp || "A informar"} />

            <div style={summaryNoteStyle}>
              O cadastro agora é enviado para a base real do Aurora Motoristas.
              Campos extras seguem preservados nas observações para análise
              administrativa.
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.15,
              color: "#0f172a",
            }}
          >
            Dados principais
          </h2>

          <div style={gridStyle}>
            <Field
              label="Nome completo"
              value={form.nome}
              onChange={(value) => updateField("nome", value)}
              placeholder="Ex.: Paulo Santos"
            />

            <Field
              label="CPF"
              value={form.cpf}
              onChange={(value) => updateField("cpf", maskCpf(value))}
              placeholder="000.000.000-00"
            />

            <Field
              label="CNH"
              value={form.cnh}
              onChange={(value) => updateField("cnh", value)}
              placeholder="Número da CNH"
            />

            <SelectField
              label="Categoria da CNH"
              value={form.categoriaCnh}
              onChange={(value) => updateField("categoriaCnh", value)}
              options={[
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
                { value: "D", label: "D" },
                { value: "E", label: "E" },
              ]}
            />

            <Field
              label="Validade da CNH"
              value={form.validadeCnh}
              onChange={(value) => updateField("validadeCnh", value)}
              type="date"
              placeholder={formatDateForInput()}
            />

            <Field
              label="Telefone"
              value={form.telefone}
              onChange={(value) => updateField("telefone", maskPhone(value))}
              placeholder="(00) 00000-0000"
            />

            <Field
              label="WhatsApp"
              value={form.whatsapp}
              onChange={(value) => updateField("whatsapp", maskPhone(value))}
              placeholder="(00) 00000-0000"
            />

            <Field
              label="E-mail"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              type="email"
              placeholder="motorista@email.com"
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
              onChange={(value) => updateField("estado", value.toUpperCase())}
              placeholder="MG"
            />

            <Field
              label="CEP"
              value={form.cep}
              onChange={(value) => updateField("cep", maskCep(value))}
              placeholder="00000-000"
            />

            <Field
              label="Profissão"
              value={form.profissao}
              onChange={(value) => updateField("profissao", value)}
              placeholder="Motorista"
            />
          </div>

          <Field
            label="Endereço"
            value={form.endereco}
            onChange={(value) => updateField("endereco", value)}
            placeholder="Rua, número, bairro, complemento..."
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.15,
              color: "#0f172a",
            }}
          >
            Dados operacionais
          </h2>

          <div style={gridStyle}>
            <Field
              label="Empresa indicada / referência"
              value={form.empresaIndicada}
              onChange={(value) => updateField("empresaIndicada", value)}
              placeholder="Ex.: GES TRANSPORTADORA LTDA"
            />

            <Field
              label="Disponibilidade"
              value={form.disponibilidade}
              onChange={(value) => updateField("disponibilidade", value)}
              placeholder="Conforme chamados"
            />
          </div>

          <TextAreaField
            label="Experiência"
            value={form.experiencia}
            onChange={(value) => updateField("experiencia", value)}
            placeholder="Conte um pouco da sua experiência com translados, locadoras, transporte executivo, entregas ou operações similares."
          />

          <TextAreaField
            label="Observações"
            value={form.observacoes}
            onChange={(value) => updateField("observacoes", value)}
            placeholder="Informações adicionais importantes para análise."
          />

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.aceitaChamadosWhatsapp}
              onChange={(e) =>
                updateField("aceitaChamadosWhatsapp", e.target.checked)
              }
            />
            <span>
              Aceito receber chamados e comunicações operacionais via WhatsApp.
            </span>
          </label>

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.aceitaTermos}
              onChange={(e) => updateField("aceitaTermos", e.target.checked)}
            />
            <span>
              Confirmo que os dados informados são verdadeiros e autorizo a
              análise do meu cadastro para possível entrada na base de
              motoristas.
            </span>
          </label>
        </section>

        {feedback ? (
          <section
            style={{
              borderRadius: 20,
              padding: "16px 18px",
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
              lineHeight: 1.65,
            }}
          >
            {feedback}
          </section>
        ) : null}

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#4b6478",
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 760,
            }}
          >
            Este cadastro entra com status <strong>pendente</strong> e deve ser
            analisado pela administração antes da ativação. Sistema em constante
            atualização e podem ocorrer instabilidades momentâneas.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={limparFormulario}
              disabled={saving}
              style={secondaryButton}
            >
              Limpar
            </button>

            <button
              type="button"
              onClick={salvarMotorista}
              disabled={saving}
              style={{
                ...primaryButton,
                opacity: saving ? 0.85 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Enviando..." : "Enviar cadastro"}
            </button>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 700,
            paddingTop: 4,
          }}
        >
          Aurora Motoristas • Cadastro de motorista parceiro • fluxo enviado para
          análise na base real.
        </footer>
      </div>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: "1px solid #e7eef6",
        paddingBottom: 10,
      }}
    >
      <span
        style={{
          color: "#5b7488",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#123047",
          fontSize: 14,
          fontWeight: 800,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fieldStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyle}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        style={{
          ...fieldStyle,
          resize: "vertical",
          minHeight: 120,
          fontFamily: "Arial, sans-serif",
        }}
      />
    </label>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#5b7488",
  fontWeight: 700,
};

const fieldStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #d8e3ee",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  background: "#f8fbff",
  color: "#123047",
  boxSizing: "border-box",
  width: "100%",
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: 14,
  borderRadius: 16,
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  color: "#435b6e",
  fontSize: 14,
  lineHeight: 1.6,
};

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const statusBadgeStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#5b7488",
  border: "1px solid #e7eef6",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const chipBlue: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#e0f2fe",
  color: "#075985",
  borderRadius: 999,
  padding: "7px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const miniChip: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const infoCardStyle: React.CSSProperties = {
  borderRadius: 20,
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const infoTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
};

const infoTextStyle: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
};

const summaryBoxStyle: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #dbeafe",
  borderRadius: 24,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const summaryTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.2,
  color: "#0f172a",
};

const summaryNoteStyle: React.CSSProperties = {
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #e5edf5",
  padding: 14,
  color: "#4b6478",
  fontSize: 13,
  lineHeight: 1.7,
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid #dbe5ef",
  background: "#ffffff",
  color: "#123047",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
};