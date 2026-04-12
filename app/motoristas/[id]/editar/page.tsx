"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  cnh?: string | null;
  telefone?: string | null;
  email?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  observacoes?: string | null;
  foto_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  motorista?: Motorista | null;
};

type MotoristaForm = {
  nome: string;
  cpf: string;
  cnh: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  observacoes: string;
  fotoUrl: string;
};

function formatarCPF(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "").slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");

  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
}

function aplicarMascaraTelefone(valor: string) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");

  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function aplicarMascaraCEP(valor: string) {
  const digits = valor.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) return digits;
  return digits.replace(/^(\d{5})(\d+)/, "$1-$2");
}

function usarIdDaUrl() {
  const [id, setId] = useState("");

  useEffect(() => {
    const partes = window.location.pathname.split("/").filter(Boolean);
    const penultimo = partes[partes.length - 2] || "";
    setId(decodeURIComponent(penultimo));
  }, []);

  return id;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

export default function EditarMotoristaPage() {
  const id = usarIdDaUrl();

  const [form, setForm] = useState<MotoristaForm>({
    nome: "",
    cpf: "",
    cnh: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    observacoes: "",
    fotoUrl: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function carregar() {
      if (!id) return;

      try {
        setCarregando(true);
        setErro("");
        setMensagem("");

        const response = await fetch(`/api/motoristas/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const rawText = await response.text();
        let data: ApiResponse | null = null;

        try {
          data = rawText ? (JSON.parse(rawText) as ApiResponse) : null;
        } catch {
          data = null;
        }

        if (!response.ok) {
          setErro(
            data?.error ||
              data?.message ||
              rawText ||
              `Falha ao carregar motorista. HTTP ${response.status} ${response.statusText}`,
          );
          return;
        }

        const motorista = data?.motorista;

        if (!motorista) {
          setErro("Motorista não encontrado.");
          return;
        }

        setForm({
          nome: motorista.nome || "",
          cpf: formatarCPF(motorista.cpf) || "",
          cnh: motorista.cnh || "",
          telefone: aplicarMascaraTelefone(motorista.telefone || ""),
          email: motorista.email || "",
          cep: aplicarMascaraCEP(motorista.cep || ""),
          logradouro: motorista.logradouro || "",
          numero: motorista.numero || "",
          complemento: motorista.complemento || "",
          bairro: motorista.bairro || "",
          cidade: motorista.cidade || "",
          estado: (motorista.estado || "").toUpperCase().slice(0, 2),
          observacoes: motorista.observacoes || "",
          fotoUrl: motorista.foto_url || "",
        });
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar motorista.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  const telefoneWhatsApp = useMemo(() => {
    const digits = form.telefone.replace(/\D/g, "");
    if (!digits) return "";
    return digits.startsWith("55") ? digits : `55${digits}`;
  }, [form.telefone]);

  function atualizarCampo<K extends keyof MotoristaForm>(campo: K, valor: MotoristaForm[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    setErro("");
    setMensagem("");

    if (!form.nome.trim()) {
      setErro("Preencha o nome do motorista.");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        nome: form.nome.trim(),
        cnh: form.cnh.trim(),
        telefone: form.telefone.replace(/\D/g, ""),
        email: form.email.trim(),
        cep: form.cep.replace(/\D/g, ""),
        logradouro: form.logradouro.trim(),
        numero: form.numero.trim(),
        complemento: form.complemento.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim().toUpperCase().slice(0, 2),
        observacoes: form.observacoes.trim(),
        foto_url: form.fotoUrl.trim(),
      };

      const response = await fetch(`/api/motoristas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let data: ApiResponse | null = null;

      try {
        data = rawText ? (JSON.parse(rawText) as ApiResponse) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setErro(
          data?.error ||
            data?.message ||
            rawText ||
            `Falha ao atualizar motorista. HTTP ${response.status} ${response.statusText}`,
        );
        return;
      }

      setMensagem("Motorista atualizado com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao atualizar motorista.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={ambientGlowTop} />
      <div style={ambientGlowBottom} />

      <div style={containerStyle}>
        <header style={heroStyle}>
          <div style={heroBadge}>Aurora Motoristas • Edição premium</div>

          <div
            style={{
              ...heroGrid,
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.5fr) minmax(260px, 0.8fr)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h1 style={heroTitle}>Editar motorista</h1>

              <p style={heroText}>
                Ajuste os dados do motorista com visual premium, edição segura e atualização direta na base
                real do Aurora Motoristas.
              </p>

              <div style={heroPills}>
                <span style={pillStyle}>Edição real</span>
                <span style={pillStyle}>Base conectada</span>
                <span style={pillStyle}>Visual premium</span>
              </div>
            </div>

            <div style={heroSideCard}>
              <div style={heroSideNumber}>02</div>
              <div style={heroSideLabel}>Editar</div>
              <div style={heroSideText}>
                Área pronta para ajustes rápidos sem depender do Supabase para toda mudança operacional.
              </div>
            </div>
          </div>
        </header>

        <section style={cardStyle}>
          <div
            style={{
              ...toolbarStyle,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <div>
              <div style={sectionEyebrow}>Base operacional</div>
              <h2 style={sectionTitle}>Dados editáveis</h2>
              <p style={sectionText}>
                Atualize telefone, e-mail, endereço, observações e demais informações do motorista.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Link href={`/motoristas/${id}`} style={ghostButtonStyle}>
                Voltar ao detalhe
              </Link>

              <Link href="/motoristas" style={ghostButtonStyle}>
                Voltar para lista
              </Link>

              {telefoneWhatsApp ? (
                <a
                  href={`https://wa.me/${telefoneWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  style={whatsAppButtonStyle}
                >
                  Chamar no WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          {erro ? <div style={errorStyle}>{erro}</div> : null}
          {mensagem ? <div style={successStyle}>{mensagem}</div> : null}

          {carregando ? (
            <div style={loadingCardStyle}>Carregando dados do motorista...</div>
          ) : (
            <>
              <div
                style={{
                  ...formGridStyle,
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <Field label="Nome">
                  <input
                    value={form.nome}
                    onChange={(e) => atualizarCampo("nome", e.target.value)}
                    placeholder="Nome completo do motorista"
                    style={inputStyle}
                  />
                </Field>

                <Field label="CPF">
                  <input
                    value={form.cpf}
                    disabled
                    placeholder="CPF"
                    style={{ ...inputStyle, opacity: 0.75, cursor: "not-allowed" }}
                  />
                </Field>

                <Field label="CNH">
                  <input
                    value={form.cnh}
                    onChange={(e) => atualizarCampo("cnh", e.target.value)}
                    placeholder="Número da CNH"
                    style={inputStyle}
                  />
                </Field>

                <Field label="WhatsApp">
                  <input
                    value={form.telefone}
                    onChange={(e) => atualizarCampo("telefone", aplicarMascaraTelefone(e.target.value))}
                    placeholder="(31) 99999-9999"
                    style={inputStyle}
                  />
                </Field>

                <Field label="E-mail">
                  <input
                    value={form.email}
                    onChange={(e) => atualizarCampo("email", e.target.value)}
                    placeholder="motorista@email.com"
                    style={inputStyle}
                  />
                </Field>

                <Field label="CEP">
                  <input
                    value={form.cep}
                    onChange={(e) => atualizarCampo("cep", aplicarMascaraCEP(e.target.value))}
                    placeholder="00000-000"
                    style={inputStyle}
                  />
                </Field>

                <div style={fullWidthStyle}>
                  <Field label="Logradouro">
                    <input
                      value={form.logradouro}
                      onChange={(e) => atualizarCampo("logradouro", e.target.value)}
                      placeholder="Rua, avenida, alameda..."
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Número">
                  <input
                    value={form.numero}
                    onChange={(e) => atualizarCampo("numero", e.target.value)}
                    placeholder="123"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Complemento">
                  <input
                    value={form.complemento}
                    onChange={(e) => atualizarCampo("complemento", e.target.value)}
                    placeholder="Apto, bloco, referência"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Bairro">
                  <input
                    value={form.bairro}
                    onChange={(e) => atualizarCampo("bairro", e.target.value)}
                    placeholder="Bairro"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Cidade">
                  <input
                    value={form.cidade}
                    onChange={(e) => atualizarCampo("cidade", e.target.value)}
                    placeholder="Cidade"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Estado">
                  <input
                    value={form.estado}
                    onChange={(e) => atualizarCampo("estado", e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="MG"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Foto URL">
                  <input
                    value={form.fotoUrl}
                    onChange={(e) => atualizarCampo("fotoUrl", e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </Field>

                <div style={fullWidthStyle}>
                  <Field label="Observações">
                    <textarea
                      value={form.observacoes}
                      onChange={(e) => atualizarCampo("observacoes", e.target.value)}
                      placeholder="Anotações internas e operacionais"
                      rows={5}
                      style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                    />
                  </Field>
                </div>
              </div>

              <div
                style={{
                  ...footerActionsStyle,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <button type="button" onClick={salvar} disabled={salvando} style={primaryButtonOnlyStyle}>
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 28%), linear-gradient(180deg, #eef6ff 0%, #f8fbff 46%, #f4f7fb 100%)",
  padding: "24px 16px 40px",
  position: "relative",
  overflow: "hidden",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  position: "relative",
  zIndex: 2,
};

const ambientGlowTop: CSSProperties = {
  position: "absolute",
  top: -120,
  right: -80,
  width: 280,
  height: 280,
  borderRadius: "50%",
  background: "rgba(6,182,212,0.14)",
  filter: "blur(40px)",
};

const ambientGlowBottom: CSSProperties = {
  position: "absolute",
  bottom: -100,
  left: -60,
  width: 260,
  height: 260,
  borderRadius: "50%",
  background: "rgba(37,99,235,0.12)",
  filter: "blur(42px)",
};

const heroStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(241,248,255,0.96) 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 32,
  padding: 24,
  boxShadow: "0 24px 80px rgba(15,23,42,0.10)",
  backdropFilter: "blur(12px)",
  marginBottom: 18,
};

const heroBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 34,
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(8,145,178,0.10)",
  color: "#0f766e",
  border: "1px solid rgba(6,182,212,0.18)",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.4,
  textTransform: "uppercase",
};

const heroGrid: CSSProperties = {
  display: "grid",
  gap: 18,
  marginTop: 18,
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 46px)",
  lineHeight: 1.02,
  color: "#0f172a",
  fontWeight: 900,
  letterSpacing: -1.2,
};

const heroText: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
  maxWidth: 720,
};

const heroPills: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.20)",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
  boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
};

const heroSideCard: CSSProperties = {
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
  color: "#ffffff",
  borderRadius: 28,
  padding: 22,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
};

const heroSideNumber: CSSProperties = {
  fontSize: 38,
  fontWeight: 900,
  color: "#67e8f9",
  letterSpacing: 1,
};

const heroSideLabel: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  lineHeight: 1.1,
};

const heroSideText: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 30,
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
  padding: 24,
  backdropFilter: "blur(12px)",
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 22,
};

const sectionEyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "#0891b2",
  marginBottom: 8,
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.08,
};

const sectionText: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.7,
  color: "#64748b",
  maxWidth: 760,
};

const loadingCardStyle: CSSProperties = {
  minHeight: 120,
  borderRadius: 24,
  border: "1px dashed rgba(148,163,184,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 15,
  fontWeight: 700,
  background: "rgba(248,250,252,0.72)",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 54,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  padding: "14px 16px",
  fontSize: 15,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const fullWidthStyle: CSSProperties = {
  gridColumn: "1 / -1",
};

const errorStyle: CSSProperties = {
  marginBottom: 18,
  background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
  color: "#991b1b",
  border: "1px solid rgba(248,113,113,0.28)",
  padding: 14,
  borderRadius: 18,
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const successStyle: CSSProperties = {
  marginBottom: 18,
  background: "linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%)",
  color: "#155e75",
  border: "1px solid rgba(34,211,238,0.25)",
  padding: 14,
  borderRadius: 18,
  fontSize: 14,
  fontWeight: 700,
};

const footerActionsStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 24,
};

const primaryButtonOnlyStyle: CSSProperties = {
  minHeight: 56,
  borderRadius: 18,
  border: "none",
  padding: "14px 22px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(37,99,235,0.20)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "none",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(37,99,235,0.20)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const ghostButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  background: "rgba(255,255,255,0.86)",
  color: "#0f172a",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const whatsAppButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "none",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(34,197,94,0.22)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};