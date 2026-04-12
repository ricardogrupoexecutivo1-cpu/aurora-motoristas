"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { buscarReceita, limparDocumento } from "@/lib/receita";

type EmpresaForm = {
  tipoEmpresa: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  responsavel: string;
  cpfResponsavel: string;
  telefone: string;
  email: string;
  site: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  observacoes: string;
};

const ESTADO_INICIAL: EmpresaForm = {
  tipoEmpresa: "Locadora",
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  responsavel: "",
  cpfResponsavel: "",
  telefone: "",
  email: "",
  site: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

function aplicarMascaraCNPJ(valor: string) {
  const digits = valor.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return digits.replace(/^(\d{2})(\d+)/, "$1.$2");
  if (digits.length <= 8) return digits.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  if (digits.length <= 12) return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");

  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, "$1.$2.$3/$4-$5");
}

function aplicarMascaraCPF(valor: string) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);

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

export default function CadastrarEmpresaPage() {
  const [form, setForm] = useState<EmpresaForm>(ESTADO_INICIAL);
  const [carregandoReceita, setCarregandoReceita] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cnpjLimpo = useMemo(() => limparDocumento(form.cnpj), [form.cnpj]);

  function atualizarCampo<K extends keyof EmpresaForm>(campo: K, valor: EmpresaForm[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function consultarCNPJ() {
    setMensagem("");
    setErro("");

    if (cnpjLimpo.length !== 14) {
      setErro("Digite um CNPJ válido com 14 números para buscar.");
      return;
    }

    try {
      setCarregandoReceita(true);

      const resultado = await buscarReceita(cnpjLimpo);

      if (!resultado || "erro" in resultado) {
        setErro(resultado?.erro || "Não foi possível consultar o CNPJ agora.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        razaoSocial: resultado.nome || prev.razaoSocial,
        nomeFantasia: resultado.fantasia || prev.nomeFantasia,
        telefone: resultado.telefone ? aplicarMascaraTelefone(resultado.telefone) : prev.telefone,
        email: resultado.email || prev.email,
        cep: resultado.cep ? aplicarMascaraCEP(resultado.cep) : prev.cep,
        logradouro: resultado.logradouro || prev.logradouro,
        numero: resultado.numero || prev.numero,
        bairro: resultado.bairro || prev.bairro,
        cidade: resultado.cidade || prev.cidade,
        estado: resultado.estado || prev.estado,
      }));

      setMensagem("Consulta concluída. Você pode editar qualquer dado antes de salvar.");
    } catch {
      setErro("Erro ao consultar o CNPJ no momento.");
    } finally {
      setCarregandoReceita(false);
    }
  }

  async function salvar() {
    setMensagem("");
    setErro("");

    if (!form.razaoSocial.trim()) {
      setErro("Preencha a razão social da empresa.");
      return;
    }

    if (cnpjLimpo.length !== 14) {
      setErro("Preencha um CNPJ válido.");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        tipo_empresa: form.tipoEmpresa.trim(),
        cnpj: cnpjLimpo,
        razao_social: form.razaoSocial.trim(),
        nome_fantasia: form.nomeFantasia.trim(),
        inscricao_estadual: form.inscricaoEstadual.trim(),
        responsavel: form.responsavel.trim(),
        cpf_responsavel: limparDocumento(form.cpfResponsavel),
        telefone: limparDocumento(form.telefone),
        email: form.email.trim(),
        site: form.site.trim(),
        cep: limparDocumento(form.cep),
        logradouro: form.logradouro.trim(),
        numero: form.numero.trim(),
        complemento: form.complemento.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim(),
        observacoes: form.observacoes.trim(),
      };

      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(data?.error || data?.message || "Não foi possível salvar a empresa.");
        return;
      }

      setMensagem("Empresa salva com sucesso.");
      setForm(ESTADO_INICIAL);
    } catch {
      setErro("Erro ao salvar a empresa.");
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
          <div style={heroBadge}>Aurora Motoristas • Empresas premium</div>

          <div
            style={{
              ...heroGrid,
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.5fr) minmax(260px, 0.8fr)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h1 style={heroTitle}>Cadastrar empresa</h1>

              <p style={heroText}>
                Cadastro comercial com busca automática por CNPJ, edição total dos campos e visual premium
                pensado para empresas, locadoras e operação mobile sem quebrar o restante do app.
              </p>

              <div style={heroPills}>
                <span style={pillStyle}>CNPJ com busca</span>
                <span style={pillStyle}>Edição livre</span>
                <span style={pillStyle}>Padrão premium</span>
              </div>
            </div>

            <div style={heroSideCard}>
              <div style={heroSideNumber}>02</div>
              <div style={heroSideLabel}>Empresa</div>
              <div style={heroSideText}>
                Base empresarial pronta para cadastro, leitura da Receita e evolução segura dentro do app.
              </div>
            </div>
          </div>
        </header>

        <section style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionEyebrow}>Base comercial</div>
              <h2 style={sectionTitle}>Dados da empresa</h2>
              <p style={sectionText}>
                Digite o CNPJ para preencher automaticamente e ajuste qualquer informação se precisar.
              </p>
            </div>
          </div>

          <div
            style={{
              ...formGridStyle,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
            }}
          >
            <Field label="Tipo de empresa">
              <select
                value={form.tipoEmpresa}
                onChange={(e) => atualizarCampo("tipoEmpresa", e.target.value)}
                style={inputStyle}
              >
                <option>Locadora</option>
                <option>Empresa</option>
                <option>Agência</option>
                <option>Parceiro</option>
                <option>Prestadora de serviços</option>
              </select>
            </Field>

            <div style={fullWidthStyle}>
              <div
                style={{
                  ...cpfBoxStyle,
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 210px",
                }}
              >
                <Field label="CNPJ">
                  <input
                    value={form.cnpj}
                    onChange={(e) => atualizarCampo("cnpj", aplicarMascaraCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    style={inputStyle}
                  />
                </Field>

                <button
                  type="button"
                  onClick={consultarCNPJ}
                  disabled={carregandoReceita}
                  style={actionButtonStyle}
                >
                  {carregandoReceita ? "Buscando CNPJ..." : "Buscar CNPJ"}
                </button>
              </div>
            </div>

            <Field label="Razão social">
              <input
                value={form.razaoSocial}
                onChange={(e) => atualizarCampo("razaoSocial", e.target.value)}
                placeholder="Razão social"
                style={inputStyle}
              />
            </Field>

            <Field label="Nome fantasia">
              <input
                value={form.nomeFantasia}
                onChange={(e) => atualizarCampo("nomeFantasia", e.target.value)}
                placeholder="Nome fantasia"
                style={inputStyle}
              />
            </Field>

            <Field label="Inscrição estadual">
              <input
                value={form.inscricaoEstadual}
                onChange={(e) => atualizarCampo("inscricaoEstadual", e.target.value)}
                placeholder="Inscrição estadual"
                style={inputStyle}
              />
            </Field>

            <Field label="Responsável">
              <input
                value={form.responsavel}
                onChange={(e) => atualizarCampo("responsavel", e.target.value)}
                placeholder="Nome do responsável"
                style={inputStyle}
              />
            </Field>

            <Field label="CPF do responsável">
              <input
                value={form.cpfResponsavel}
                onChange={(e) => atualizarCampo("cpfResponsavel", aplicarMascaraCPF(e.target.value))}
                placeholder="000.000.000-00"
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
                placeholder="contato@empresa.com"
                style={inputStyle}
              />
            </Field>

            <Field label="Site">
              <input
                value={form.site}
                onChange={(e) => atualizarCampo("site", e.target.value)}
                placeholder="https://empresa.com.br"
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
                placeholder="Sala, bloco, referência"
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

            <div style={fullWidthStyle}>
              <Field label="Observações">
                <textarea
                  value={form.observacoes}
                  onChange={(e) => atualizarCampo("observacoes", e.target.value)}
                  placeholder="Observações internas e comerciais"
                  rows={5}
                  style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                />
              </Field>
            </div>
          </div>

          {mensagem ? <div style={successStyle}>{mensagem}</div> : null}
          {erro ? <div style={errorStyle}>{erro}</div> : null}

          <div
            style={{
              ...footerActionsStyle,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button type="button" onClick={salvar} disabled={salvando} style={primaryButtonStyle}>
              {salvando ? "Salvando..." : "Salvar empresa"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(ESTADO_INICIAL);
                setMensagem("");
                setErro("");
              }}
              style={ghostButtonStyle}
            >
              Limpar formulário
            </button>
          </div>
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
  fontSize: 14,
  fontWeight: 800,
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

const sectionHeaderStyle: CSSProperties = {
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

const formGridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const fullWidthStyle: CSSProperties = {
  gridColumn: "1 / -1",
};

const cpfBoxStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  alignItems: "end",
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

const actionButtonStyle: CSSProperties = {
  minHeight: 54,
  borderRadius: 18,
  border: "1px solid rgba(6,182,212,0.20)",
  background: "linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%)",
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  padding: "0 18px",
  boxShadow: "0 10px 24px rgba(6,182,212,0.12)",
};

const successStyle: CSSProperties = {
  marginTop: 18,
  background: "linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%)",
  color: "#155e75",
  border: "1px solid rgba(34,211,238,0.25)",
  padding: 14,
  borderRadius: 18,
  fontSize: 14,
  fontWeight: 700,
};

const errorStyle: CSSProperties = {
  marginTop: 18,
  background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
  color: "#991b1b",
  border: "1px solid rgba(248,113,113,0.28)",
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

const primaryButtonStyle: CSSProperties = {
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

const ghostButtonStyle: CSSProperties = {
  minHeight: 56,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  padding: "14px 22px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  background: "rgba(255,255,255,0.86)",
  color: "#0f172a",
};