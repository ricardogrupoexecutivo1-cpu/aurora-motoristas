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

type MotoristaRow = MotoristaDraft & {
  id: string;
  status: "pendente";
  origem: "cadastro_motorista_publico";
  created_at: string;
  updated_at: string;
};

const DRAFT_KEY = "aurora_motoristas_motorista_novo_draft";
const LIST_KEY = "aurora_motoristas_motoristas_pendentes_local";

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

export default function NovoMotoristaPage() {
  const [form, setForm] = useState<MotoristaDraft>(buildInitialState());
  const [statusText, setStatusText] = useState("Tela pronta para novo cadastro.");
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(DRAFT_KEY);
      const list = localStorage.getItem(LIST_KEY);
      const parsedList = list ? JSON.parse(list) : [];
      setSavedCount(Array.isArray(parsedList) ? parsedList.length : 0);

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
      // mantém silencioso
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
      setStatusText(erro);
      alert(erro);
      return;
    }

    const nowIso = new Date().toISOString();

    const payload: MotoristaRow = {
      ...form,
      id: `motorista-${Date.now()}`,
      status: "pendente",
      origem: "cadastro_motorista_publico",
      created_at: nowIso,
      updated_at: nowIso,
    };

    try {
      setSaving(true);
      setStatusText("Salvando cadastro do motorista...");

      const current = localStorage.getItem(LIST_KEY);
      const parsed = current ? JSON.parse(current) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      list.unshift(payload);
      localStorage.setItem(LIST_KEY, JSON.stringify(list));
      localStorage.removeItem(DRAFT_KEY);

      setSavedCount(list.length);
      setStatusText(
        "Cadastro enviado com sucesso para análise. Status inicial: pendente."
      );

      alert(
        "Cadastro enviado com sucesso.\n\nStatus inicial: pendente.\nA equipe fará a análise antes da liberação."
      );

      setForm(buildInitialState());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao salvar o cadastro do motorista.";

      setStatusText(message);
      alert(message);
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

          <div style={statusBadgeStyle}>{saving ? "Salvando..." : statusText}</div>
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
              poderá ser aprovado pela administração antes da liberação.
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
              <span style={miniChip}>Chamados via WhatsApp</span>
            </div>

            <div style={infoCardStyle}>
              <div style={infoTitleStyle}>Como funciona</div>
              <div style={infoTextStyle}>
                Você envia o cadastro, a equipe analisa e, se aprovado, o seu
                perfil poderá entrar na base operacional do sistema.
              </div>
            </div>
          </div>

          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Resumo do envio</div>

            <SummaryLine label="Status inicial" value="pendente" />
            <SummaryLine label="Disponibilidade" value={resumoDisponibilidade} />
            <SummaryLine label="Base local segura" value="ativa" />
            <SummaryLine
              label="Cadastros salvos nesta base"
              value={String(savedCount)}
            />

            <div style={summaryNoteStyle}>
              Este primeiro passo salva o fluxo localmente com segurança. No
              próximo ajuste, vamos ligar o cadastro ao Supabase e ao painel ADM
              de aprovação.
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
          Aurora Motoristas • Cadastro de motorista parceiro • fluxo preparado
          para análise e aprovação.
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