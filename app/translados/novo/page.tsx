"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RiskLevel = "Baixo" | "MÃ©dio" | "Alto";
type TransferStatus =
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "ConcluÃ­do"
  | "Reagendado";

type FormState = {
  empresa: string;
  locadora: string;
  cliente: string;
  motorista: string;
  motoristaReserva: string;
  veiculoReserva: string;
  aeroporto: string;
  origem: string;
  destino: string;
  horarioPrevisto: string;
  horarioAtualizado: string;
  tempoEstimadoMin: string;
  acrescimoTransitoMin: string;
  risco: RiskLevel;
  valorTransfer: string;
  valorMotorista: string;
  despesas: string;
  adiantamento: string;
  status: TransferStatus;
  observacao: string;
};

type PersistedTransfer = {
  id: string;
  empresa: string;
  locadora: string;
  cliente: string;
  motorista: string;
  motoristaReserva: string;
  veiculoReserva: string;
  aeroporto: string;
  origem: string;
  destino: string;
  horarioPrevisto: string;
  horarioAtualizado: string;
  tempoEstimadoMin: number;
  acrescimoTransitoMin: number;
  risco: RiskLevel;
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  status: TransferStatus;
  observacao: string;
  createdAt: string;
};

const STORAGE_KEY = "aurora_motoristas_translados";

const initialForm: FormState = {
  empresa: "Aurora Locadoras Premium",
  locadora: "Aurora Frotas Executivas",
  cliente: "",
  motorista: "",
  motoristaReserva: "",
  veiculoReserva: "",
  aeroporto: "Confins",
  origem: "",
  destino: "",
  horarioPrevisto: "10/04/2026 08:30",
  horarioAtualizado: "10/04/2026 08:30",
  tempoEstimadoMin: "45",
  acrescimoTransitoMin: "0",
  risco: "Baixo",
  valorTransfer: "",
  valorMotorista: "",
  despesas: "",
  adiantamento: "",
  status: "Agendado",
  observacao: "",
};

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseDateTime(value: string) {
  const [datePart, timePart] = value.split(" ");
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  return new Date(year, month - 1, day, hour, minute);
}

function formatDateTime(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function safeReadStorage(): PersistedTransfer[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as PersistedTransfer[];
  } catch {
    return [];
  }
}

function safeWriteStorage(items: PersistedTransfer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function NovoTransladoPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [savedTransfers, setSavedTransfers] = useState<PersistedTransfer[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const existing = safeReadStorage();
    setSavedTransfers(existing);
  }, []);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const totals = useMemo(() => {
    const valorTransfer = toNumber(form.valorTransfer);
    const valorMotorista = toNumber(form.valorMotorista);
    const despesas = toNumber(form.despesas);
    const adiantamento = toNumber(form.adiantamento);
    const margem = valorTransfer - valorMotorista - despesas - adiantamento;

    const start = parseDateTime(form.horarioAtualizado || form.horarioPrevisto);
    const eta =
      start !== null
        ? new Date(
            start.getTime() +
              (toNumber(form.tempoEstimadoMin) + toNumber(form.acrescimoTransitoMin)) *
                60 *
                1000
          )
        : null;

    return {
      valorTransfer,
      valorMotorista,
      despesas,
      adiantamento,
      margem,
      eta,
    };
  }, [
    form.valorTransfer,
    form.valorMotorista,
    form.despesas,
    form.adiantamento,
    form.tempoEstimadoMin,
    form.acrescimoTransitoMin,
    form.horarioAtualizado,
    form.horarioPrevisto,
  ]);

  function resetForm() {
    setForm(initialForm);
  }

  function saveDraft() {
    if (
      !form.cliente.trim() ||
      !form.motorista.trim() ||
      !form.origem.trim() ||
      !form.destino.trim()
    ) {
      alert("Preencha pelo menos cliente, motorista, origem e destino.");
      return;
    }

    const existing = safeReadStorage();

    const newDraft: PersistedTransfer = {
      id: `TRA-LOCAL-${String(existing.length + 1).padStart(4, "0")}`,
      empresa: form.empresa.trim() || "Empresa nÃ£o informada",
      locadora: form.locadora.trim() || "Locadora nÃ£o informada",
      cliente: form.cliente.trim(),
      motorista: form.motorista.trim(),
      motoristaReserva: form.motoristaReserva.trim() || "NÃ£o informado",
      veiculoReserva: form.veiculoReserva.trim() || "NÃ£o informado",
      aeroporto: form.aeroporto.trim() || "NÃ£o informado",
      origem: form.origem.trim(),
      destino: form.destino.trim(),
      horarioPrevisto: form.horarioPrevisto.trim(),
      horarioAtualizado: form.horarioAtualizado.trim(),
      tempoEstimadoMin: toNumber(form.tempoEstimadoMin),
      acrescimoTransitoMin: toNumber(form.acrescimoTransitoMin),
      risco: form.risco,
      valorTransfer: totals.valorTransfer,
      valorMotorista: totals.valorMotorista,
      despesas: totals.despesas,
      adiantamento: totals.adiantamento,
      status: form.status,
      observacao:
        form.observacao.trim() ||
        "Translado salvo localmente para integraÃ§Ã£o com escala e operaÃ§Ã£o.",
      createdAt: new Date().toISOString(),
    };

    const updated = [newDraft, ...existing];
    safeWriteStorage(updated);
    setSavedTransfers(updated);
    setFeedback(`Translado ${newDraft.id} salvo na base local com sucesso.`);
    resetForm();
  }

  function clearSavedTransfers() {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(STORAGE_KEY);
    setSavedTransfers([]);
    setFeedback("Base local de translados limpa com sucesso.");
  }

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ NOVO TRANSLADO</div>
              <h1 style={styles.heroTitle}>
                Cadastro real de translado com persistÃªncia local, ETA, risco e reserva
              </h1>
              <p style={styles.heroText}>
                Esta Ã¡rea agora salva de verdade no navegador e prepara o translado
                para aparecer nas prÃ³ximas telas do mÃ³dulo, mantendo risco, reserva,
                horÃ¡rios e leitura financeira.
              </p>

              <div style={styles.heroActions}>
                <Link href="/translados" style={styles.secondaryButton}>
                  Voltar translados
                </Link>
                <Link href="/translados/escala" style={styles.primaryButton}>
                  Ir para escala
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>ENTRADA PERSISTENTE</span>
              <h2 style={styles.sideTitle}>O translado agora nÃ£o some</h2>
              <p style={styles.sideText}>
                O lanÃ§amento fica salvo localmente e pronto para alimentar a visÃ£o
                de translados e a escala operacional no prÃ³ximo passo.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Salva em localStorage</div>
                <div style={styles.sidePill}>Pronto para escala</div>
                <div style={styles.sidePill}>Pronto para operaÃ§Ã£o</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualizaÃ§Ã£o. Esta tela jÃ¡ persiste os translados
            para integraÃ§Ã£o direta com o restante do mÃ³dulo.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Valor transfer</span>
            <strong style={styles.statValue}>{formatCurrency(totals.valorTransfer)}</strong>
            <span style={styles.statDetail}>Receita prevista</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Valor motorista</span>
            <strong style={styles.statValue}>{formatCurrency(totals.valorMotorista)}</strong>
            <span style={styles.statDetail}>Repasse previsto</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Margem operacional</span>
            <strong style={styles.statValue}>{formatCurrency(totals.margem)}</strong>
            <span style={styles.statDetail}>Leitura inicial</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>ETA estimado</span>
            <strong style={styles.statValue}>
              {totals.eta ? formatDateTime(totals.eta) : "--/--/---- --:--"}
            </strong>
            <span style={styles.statDetail}>PrevisÃ£o de chegada</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Translados salvos</span>
            <strong style={styles.statValue}>{savedTransfers.length}</strong>
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
                  <h2 style={styles.sectionTitle}>LanÃ§ar novo translado</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Empresa</label>
                  <input
                    value={form.empresa}
                    onChange={(e) => updateField("empresa", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Locadora</label>
                  <input
                    value={form.locadora}
                    onChange={(e) => updateField("locadora", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Cliente</label>
                  <input
                    value={form.cliente}
                    onChange={(e) => updateField("cliente", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Executivo Nacional"
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
                  <label style={styles.label}>Motorista reserva</label>
                  <input
                    value={form.motoristaReserva}
                    onChange={(e) => updateField("motoristaReserva", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: JoÃ£o Pedro"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>VeÃ­culo reserva</label>
                  <input
                    value={form.veiculoReserva}
                    onChange={(e) => updateField("veiculoReserva", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Corolla Executivo - RES-01"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Aeroporto</label>
                  <input
                    value={form.aeroporto}
                    onChange={(e) => updateField("aeroporto", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Origem</label>
                  <input
                    value={form.origem}
                    onChange={(e) => updateField("origem", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Aeroporto de Confins"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Destino</label>
                  <input
                    value={form.destino}
                    onChange={(e) => updateField("destino", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Savassi"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>HorÃ¡rio previsto</label>
                  <input
                    value={form.horarioPrevisto}
                    onChange={(e) => updateField("horarioPrevisto", e.target.value)}
                    style={styles.input}
                    placeholder="10/04/2026 08:30"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>HorÃ¡rio atualizado</label>
                  <input
                    value={form.horarioAtualizado}
                    onChange={(e) => updateField("horarioAtualizado", e.target.value)}
                    style={styles.input}
                    placeholder="10/04/2026 08:45"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Tempo estimado (min)</label>
                  <input
                    value={form.tempoEstimadoMin}
                    onChange={(e) => updateField("tempoEstimadoMin", e.target.value)}
                    style={styles.input}
                    placeholder="45"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>AcrÃ©scimo trÃ¢nsito (min)</label>
                  <input
                    value={form.acrescimoTransitoMin}
                    onChange={(e) => updateField("acrescimoTransitoMin", e.target.value)}
                    style={styles.input}
                    placeholder="20"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Risco</label>
                  <select
                    value={form.risco}
                    onChange={(e) => updateField("risco", e.target.value as RiskLevel)}
                    style={styles.select}
                  >
                    <option>Baixo</option>
                    <option>MÃ©dio</option>
                    <option>Alto</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateField("status", e.target.value as TransferStatus)
                    }
                    style={styles.select}
                  >
                    <option>Agendado</option>
                    <option>Em deslocamento</option>
                    <option>Aguardando passageiro</option>
                    <option>ConcluÃ­do</option>
                    <option>Reagendado</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Valor transfer</label>
                  <input
                    value={form.valorTransfer}
                    onChange={(e) => updateField("valorTransfer", e.target.value)}
                    style={styles.input}
                    placeholder="280"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Valor motorista</label>
                  <input
                    value={form.valorMotorista}
                    onChange={(e) => updateField("valorMotorista", e.target.value)}
                    style={styles.input}
                    placeholder="130"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Despesas</label>
                  <input
                    value={form.despesas}
                    onChange={(e) => updateField("despesas", e.target.value)}
                    style={styles.input}
                    placeholder="24"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Adiantamento</label>
                  <input
                    value={form.adiantamento}
                    onChange={(e) => updateField("adiantamento", e.target.value)}
                    style={styles.input}
                    placeholder="40"
                  />
                </div>

                <div style={styles.fieldWide}>
                  <label style={styles.label}>ObservaÃ§Ã£o operacional</label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => updateField("observacao", e.target.value)}
                    style={styles.textarea}
                    placeholder="Descreva atraso de voo, combinaÃ§Ã£o com locadora, bagagem extra, ponto de encontro e riscos."
                  />
                </div>
              </div>

              <div style={styles.actionRow}>
                <button type="button" onClick={saveDraft} style={styles.primaryAction}>
                  Salvar translado na base local
                </button>

                <button type="button" onClick={resetForm} style={styles.secondaryAction}>
                  Limpar formulÃ¡rio
                </button>

                <button type="button" onClick={clearSavedTransfers} style={styles.dangerAction}>
                  Limpar base local
                </button>
              </div>

              {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : null}
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.previewCard}>
              <span style={styles.sectionEyebrow}>PRÃ‰VIA OPERACIONAL</span>
              <h2 style={styles.sidebarTitle}>Como o translado nasce</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Rota</strong>
                  <span style={styles.ruleItemText}>
                    {(form.origem || "Origem")} x {(form.destino || "Destino")}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Motorista principal</strong>
                  <span style={styles.ruleItemText}>
                    {form.motorista || "NÃ£o informado"}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Reserva</strong>
                  <span style={styles.ruleItemText}>
                    {form.motoristaReserva || "NÃ£o informado"} /{" "}
                    {form.veiculoReserva || "NÃ£o informado"}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>ETA previsto</strong>
                  <span style={styles.ruleItemText}>
                    {totals.eta ? formatDateTime(totals.eta) : "--/--/---- --:--"}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Risco</strong>
                  <span style={styles.ruleItemText}>{form.risco}</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Margem</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(totals.margem)}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.savedCard}>
              <span style={styles.sectionEyebrow}>BASE LOCAL SALVA</span>
              <h2 style={styles.sidebarTitle}>Translados persistidos</h2>

              <div style={styles.savedList}>
                {savedTransfers.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum translado salvo ainda. Preencha e clique em salvar.
                  </div>
                ) : (
                  savedTransfers.map((item) => (
                    <article key={item.id} style={styles.savedItem}>
                      <strong style={styles.savedTitle}>
                        {item.origem} x {item.destino}
                      </strong>
                      <span style={styles.savedText}>
                        {item.id} â€¢ {item.horarioAtualizado}
                      </span>
                      <span style={styles.savedText}>
                        {item.empresa} â€¢ {item.locadora}
                      </span>
                      <span style={styles.savedText}>
                        {item.motorista} â€¢ {item.status} â€¢ risco {item.risco}
                      </span>
                      <span style={styles.savedText}>
                        {formatCurrency(item.valorTransfer)} â€¢ motorista{" "}
                        {formatCurrency(item.valorMotorista)}
                      </span>
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
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 900,
    letterSpacing: "-0.03em",
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
  },

  input: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  select: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  textarea: {
    minHeight: 130,
    borderRadius: 16,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 14,
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
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
