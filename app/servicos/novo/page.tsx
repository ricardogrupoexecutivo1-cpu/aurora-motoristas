"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FormState = {
  empresa: string;
  cliente: string;
  motorista: string;
  origem: string;
  destino: string;
  dataServico: string;
  km: string;
  diaria: string;
  pedagio: string;
  estacionamento: string;
  alimentacao: string;
  reembolso: string;
  valorMotorista: string;
  osSistema: string;
  osCliente: string;
  ocCliente: string;
  observacao: string;
};

type PersistedService = {
  id: string;
  osSistema: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  origem: string;
  destino: string;
  data: string;
  km: number;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  etapa: "Cotação";
  observacao: string;
  createdAt: string;
};

const STORAGE_KEY = "aurora_motoristas_servicos";

const initialForm: FormState = {
  empresa: "Aurora Locadoras Premium",
  cliente: "",
  motorista: "",
  origem: "",
  destino: "",
  dataServico: "2026-04-10",
  km: "",
  diaria: "",
  pedagio: "",
  estacionamento: "",
  alimentacao: "",
  reembolso: "",
  valorMotorista: "",
  osSistema: "OS-2026-000158",
  osCliente: "",
  ocCliente: "",
  observacao: "",
};

function parseMoney(value: string) {
  const normalized = value.replace(",", ".").trim();
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string) {
  if (!value) return "--/--/----";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function createServiceTitle(origem: string, destino: string) {
  const origemLimpa = origem.trim() || "Origem";
  const destinoLimpo = destino.trim() || "Destino";
  return `${origemLimpa} x ${destinoLimpo}`;
}

function safeReadStorage(): PersistedService[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as PersistedService[];
  } catch {
    return [];
  }
}

function safeWriteStorage(items: PersistedService[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function NovoServicoPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [savedCount, setSavedCount] = useState(0);
  const [savedServices, setSavedServices] = useState<PersistedService[]>([]);
  const [lastSavedMessage, setLastSavedMessage] = useState("");

  useEffect(() => {
    const existing = safeReadStorage();
    setSavedServices(existing);
    setSavedCount(existing.length);

    setForm((current) => ({
      ...current,
      osSistema: generateNextOs(existing.length + 1),
    }));
  }, []);

  const totals = useMemo(() => {
    const diaria = parseMoney(form.diaria);
    const pedagio = parseMoney(form.pedagio);
    const estacionamento = parseMoney(form.estacionamento);
    const alimentacao = parseMoney(form.alimentacao);
    const reembolso = parseMoney(form.reembolso);
    const valorMotorista = parseMoney(form.valorMotorista);

    const valorTotal =
      diaria + pedagio + estacionamento + alimentacao + reembolso;

    const despesas = pedagio + estacionamento + alimentacao + reembolso;
    const margemBruta = valorTotal - valorMotorista;

    return {
      diaria,
      pedagio,
      estacionamento,
      alimentacao,
      reembolso,
      valorMotorista,
      valorTotal,
      despesas,
      margemBruta,
    };
  }, [
    form.diaria,
    form.pedagio,
    form.estacionamento,
    form.alimentacao,
    form.reembolso,
    form.valorMotorista,
  ]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function generateNextOs(nextNumber: number) {
    const base = 158 + nextNumber;
    return `OS-2026-${String(base).padStart(6, "0")}`;
  }

  function clearForm(nextLength?: number) {
    const nextCount = typeof nextLength === "number" ? nextLength : savedCount + 1;

    setForm({
      ...initialForm,
      osSistema: generateNextOs(nextCount),
    });
  }

  function saveDraft() {
    const cliente = form.cliente.trim();
    const motorista = form.motorista.trim();
    const origem = form.origem.trim();
    const destino = form.destino.trim();

    if (!cliente || !motorista || !origem || !destino) {
      alert(
        "Preencha pelo menos cliente, motorista, origem e destino antes de salvar."
      );
      return;
    }

    const existing = safeReadStorage();

    const newService: PersistedService = {
      id: `SER-LOCAL-${String(existing.length + 1).padStart(4, "0")}`,
      osSistema: form.osSistema.trim() || generateNextOs(existing.length + 1),
      empresa: form.empresa.trim() || "Empresa não informada",
      cliente,
      motorista,
      servico: createServiceTitle(origem, destino),
      origem,
      destino,
      data: formatDate(form.dataServico),
      km: Number(form.km) || 0,
      valorTotal: totals.valorTotal,
      valorMotorista: totals.valorMotorista,
      despesas: totals.despesas,
      etapa: "Cotação",
      observacao:
        form.observacao.trim() ||
        "Serviço lançado em cotação aguardando validação operacional.",
      createdAt: new Date().toISOString(),
    };

    const updated = [newService, ...existing];
    safeWriteStorage(updated);

    setSavedServices(updated);
    setSavedCount(updated.length);
    setLastSavedMessage(
      `Serviço ${newService.osSistema} salvo localmente e pronto para aparecer em /servicos.`
    );

    clearForm(updated.length + 1);
  }

  function clearSavedServices() {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(STORAGE_KEY);
    setSavedServices([]);
    setSavedCount(0);
    setLastSavedMessage("Base local limpa com sucesso.");
    clearForm(1);
  }

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • NOVO SERVIÇO</div>
              <h1 style={styles.heroTitle}>
                Cadastro operacional real do serviço com persistência local e visão premium
              </h1>
              <p style={styles.heroText}>
                Esta área agora não cria apenas um rascunho visual. O serviço já
                fica salvo localmente no navegador, preparado para entrar na lista
                principal e seguir a trilha de cotação, operação, pagamento e histórico.
              </p>

              <div style={styles.heroActions}>
                <Link href="/servicos" style={styles.secondaryButton}>
                  Voltar para serviços
                </Link>

                <Link href="/operacao" style={styles.primaryButton}>
                  Ir para operação
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>ENTRADA PERSISTENTE</span>
              <h2 style={styles.sideTitle}>Agora o novo serviço não some</h2>
              <p style={styles.sideText}>
                O cadastro passa a ser guardado no navegador e fica pronto para
                alimentar a base operacional do app no próximo passo.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Salva em localStorage</div>
                <div style={styles.sidePill}>Entra como Cotação</div>
                <div style={styles.sidePill}>Pronto para /servicos</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta tela já persiste o serviço no
            navegador para preparar a integração direta com a lista de serviços.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Valor total previsto</span>
            <strong style={styles.statValue}>
              {formatCurrency(totals.valorTotal)}
            </strong>
            <span style={styles.statDetail}>Soma automática dos custos</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Valor motorista</span>
            <strong style={styles.statValue}>
              {formatCurrency(totals.valorMotorista)}
            </strong>
            <span style={styles.statDetail}>Repasse estimado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Margem bruta</span>
            <strong style={styles.statValue}>
              {formatCurrency(totals.margemBruta)}
            </strong>
            <span style={styles.statDetail}>Leitura inicial da operação</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Serviços salvos</span>
            <strong style={styles.statValue}>{savedCount}</strong>
            <span style={styles.statDetail}>Base local persistida</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.formCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>CADASTRO COMPLETO</span>
                  <h2 style={styles.sectionTitle}>Lançar novo serviço</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Empresa</label>
                  <input
                    value={form.empresa}
                    onChange={(e) => updateField("empresa", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Aurora Locadoras Premium"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Cliente</label>
                  <input
                    value={form.cliente}
                    onChange={(e) => updateField("cliente", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Operação Aeroporto Premium"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Motorista</label>
                  <input
                    value={form.motorista}
                    onChange={(e) => updateField("motorista", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Carlos Henrique"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Data do serviço</label>
                  <input
                    type="date"
                    value={form.dataServico}
                    onChange={(e) => updateField("dataServico", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Origem</label>
                  <input
                    value={form.origem}
                    onChange={(e) => updateField("origem", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Belo Horizonte"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Destino</label>
                  <input
                    value={form.destino}
                    onChange={(e) => updateField("destino", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Confins"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>KM</label>
                  <input
                    value={form.km}
                    onChange={(e) => updateField("km", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 42"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Diária / valor base</label>
                  <input
                    value={form.diaria}
                    onChange={(e) => updateField("diaria", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 350"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Pedágio</label>
                  <input
                    value={form.pedagio}
                    onChange={(e) => updateField("pedagio", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 45"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Estacionamento</label>
                  <input
                    value={form.estacionamento}
                    onChange={(e) => updateField("estacionamento", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 20"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Alimentação</label>
                  <input
                    value={form.alimentacao}
                    onChange={(e) => updateField("alimentacao", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 35"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Reembolso / extra</label>
                  <input
                    value={form.reembolso}
                    onChange={(e) => updateField("reembolso", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 50"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Valor motorista</label>
                  <input
                    value={form.valorMotorista}
                    onChange={(e) => updateField("valorMotorista", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: 180"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>OS sistema</label>
                  <input
                    value={form.osSistema}
                    onChange={(e) => updateField("osSistema", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: OS-2026-000158"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>OS cliente</label>
                  <input
                    value={form.osCliente}
                    onChange={(e) => updateField("osCliente", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: OS-CLI-9001"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>OC cliente</label>
                  <input
                    value={form.ocCliente}
                    onChange={(e) => updateField("ocCliente", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: OC-CLI-4401"
                  />
                </div>

                <div style={styles.fieldWide}>
                  <label style={styles.label}>Observação operacional</label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => updateField("observacao", e.target.value)}
                    style={styles.textarea}
                    placeholder="Descreva detalhes do serviço, exigências, horários, pontos de atenção e combinação feita."
                  />
                </div>
              </div>

              <div style={styles.actionRow}>
                <button type="button" onClick={saveDraft} style={styles.primaryAction}>
                  Salvar serviço na base local
                </button>

                <button type="button" onClick={() => clearForm(savedCount + 1)} style={styles.secondaryAction}>
                  Limpar formulário
                </button>

                <button type="button" onClick={clearSavedServices} style={styles.dangerAction}>
                  Limpar base local
                </button>
              </div>

              {lastSavedMessage ? (
                <div style={styles.feedbackBox}>{lastSavedMessage}</div>
              ) : null}
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.previewCard}>
              <span style={styles.sectionEyebrow}>PRÉVIA OPERACIONAL</span>
              <h2 style={styles.sidebarTitle}>Como o serviço nasce</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Etapa inicial</strong>
                  <span style={styles.ruleItemText}>Cotação</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Rota</strong>
                  <span style={styles.ruleItemText}>
                    {(form.origem || "Origem")} x {(form.destino || "Destino")}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Data</strong>
                  <span style={styles.ruleItemText}>
                    {formatDate(form.dataServico)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>OS sistema</strong>
                  <span style={styles.ruleItemText}>
                    {form.osSistema || "Não informada"}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Valor total</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(totals.valorTotal)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Repasse motorista</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(totals.valorMotorista)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Margem bruta</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(totals.margemBruta)}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio ao cadastro</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá sugerir valor ideal, alertar margem apertada,
                identificar custo alto, revisar campos faltando e preparar o serviço
                para seguir na operação com mais segurança.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler margem</div>
                <div style={styles.robotItem}>Apontar custo alto</div>
                <div style={styles.robotItem}>Revisar cadastro</div>
                <div style={styles.robotItem}>Preparar fluxo</div>
              </div>
            </div>

            <div style={styles.savedCard}>
              <span style={styles.sectionEyebrow}>BASE LOCAL SALVA</span>
              <h2 style={styles.sidebarTitle}>Serviços persistidos</h2>

              <div style={styles.savedList}>
                {savedServices.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum serviço salvo ainda. Preencha o formulário e clique em salvar.
                  </div>
                ) : (
                  savedServices.map((item) => (
                    <article key={item.id} style={styles.savedItem}>
                      <strong style={styles.savedTitle}>{item.servico}</strong>
                      <span style={styles.savedText}>
                        {item.osSistema} • {item.data}
                      </span>
                      <span style={styles.savedText}>
                        {item.empresa} • {item.cliente}
                      </span>
                      <span style={styles.savedText}>
                        {formatCurrency(item.valorTotal)} • motorista{" "}
                        {formatCurrency(item.valorMotorista)}
                      </span>
                      <span style={styles.savedTag}>{item.etapa}</span>
                    </article>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f6fbff 0%, #edf8ff 34%, #ffffff 72%, #f8fcff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "32px 20px 18px",
  },

  glowOne: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "rgba(0, 194, 255, 0.18)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1240,
    margin: "0 auto",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    borderRadius: 30,
    padding: "28px 22px 24px",
    boxShadow: "0 24px 60px rgba(14, 165, 233, 0.10)",
    backdropFilter: "blur(12px)",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)",
    gap: 18,
    alignItems: "start",
  },

  heroLeft: {
    minWidth: 0,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
    padding: "0 16px",
    borderRadius: 999,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0c4a6e",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.9rem, 3.7vw, 3.5rem)",
    lineHeight: 1.03,
    fontWeight: 950,
    letterSpacing: "-0.05em",
    maxWidth: 860,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 860,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 26,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.20)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#0f172a",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(125, 211, 252, 0.34)",
  },

  heroRightCard: {
    borderRadius: 26,
    padding: 22,
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    border: "1px solid rgba(125, 211, 252, 0.30)",
    boxShadow: "0 18px 44px rgba(8, 47, 73, 0.08)",
  },

  sideKicker: {
    display: "inline-block",
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 10,
  },

  sideTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  sideText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },

  sidePills: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  sidePill: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.84)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.55,
  },

  noticeBox: {
    marginTop: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(6, 182, 212, 0.08)",
    border: "1px solid rgba(6, 182, 212, 0.16)",
    color: "#164e63",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 700,
  },

  statsSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "8px 20px 4px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  statLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  statValue: {
    display: "block",
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  statDetail: {
    display: "block",
    marginTop: 8,
    color: "#0891b2",
    fontSize: 13,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
    gap: 18,
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  formCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  sectionEyebrow: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(1.5rem, 2.6vw, 2.3rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  fieldWide: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    gridColumn: "1 / -1",
  },

  label: {
    fontSize: 13,
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "0.02em",
  },

  input: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  textarea: {
    minHeight: 130,
    borderRadius: 16,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 14,
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  primaryAction: {
    border: "none",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.18)",
  },

  secondaryAction: {
    border: "1px solid rgba(125, 211, 252, 0.28)",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#0f172a",
    background: "#ffffff",
  },

  dangerAction: {
    border: "1px solid rgba(248, 113, 113, 0.28)",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#991b1b",
    background: "#ffffff",
  },

  feedbackBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  previewCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  savedCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  ruleItem: {
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  ruleItemTitle: {
    display: "block",
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleItemText: {
    display: "block",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.65,
    color: "#475569",
  },

  darkCard: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  robotTag: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sidebarTitleDark: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#ffffff",
  },

  sidebarTextDark: {
    marginTop: 12,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 15,
  },

  robotList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  robotItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },

  savedList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  savedItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  savedTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
  },

  savedText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#475569",
    fontWeight: 700,
  },

  savedTag: {
    display: "inline-flex",
    alignSelf: "flex-start",
    marginTop: 4,
    minHeight: 28,
    padding: "0 10px",
    alignItems: "center",
    borderRadius: 999,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0e7490",
    border: "1px solid rgba(6, 182, 212, 0.18)",
    fontSize: 12,
    fontWeight: 800,
  },

  emptyState: {
    padding: 18,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px dashed rgba(125, 211, 252, 0.34)",
    color: "#475569",
    fontSize: 15,
    fontWeight: 700,
  },
};