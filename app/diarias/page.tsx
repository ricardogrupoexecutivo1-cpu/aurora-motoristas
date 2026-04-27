"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AccessRole =
  | "Admin Master"
  | "Administrador"
  | "Financeiro"
  | "Operacional"
  | "Leitura";

type PermissionItem = {
  id: string;
  nome: string;
  email: string;
  role: AccessRole;
  financeiro: boolean;
  cadastros: boolean;
  diarias: boolean;
  relatorios: boolean;
  operacao: boolean;
  translados: boolean;
  observacao: string;
};

type ProjectionItem = {
  id: string;
  cliente: string;
  motorista: string;
  empresa: string;
  valorDiaria: number;
  diariasSemana: number;
  semanas: number;
  faltas: number;
  descontos: number;
  adiantamentos: number;
  extras: number;
  observacao: string;
};

const PERMISSIONS_STORAGE_KEY = "aurora_motoristas_permissoes";
const SESSION_EMAIL_STORAGE_KEY = "aurora_motoristas_session_email";

const initialItems: ProjectionItem[] = [
  {
    id: "DIA-0001",
    cliente: "Aurora Locadoras Premium",
    motorista: "Pedro Paulo",
    empresa: "Aurora Motoristas",
    valorDiaria: 180,
    diariasSemana: 6,
    semanas: 1,
    faltas: 0,
    descontos: 0,
    adiantamentos: 100,
    extras: 80,
    observacao: "Motorista em operação intensiva de aeroporto.",
  },
  {
    id: "DIA-0002",
    cliente: "Grupo Executivo Mobilidade",
    motorista: "Carlos Henrique",
    empresa: "Aurora Motoristas",
    valorDiaria: 220,
    diariasSemana: 5,
    semanas: 2,
    faltas: 1,
    descontos: 50,
    adiantamentos: 150,
    extras: 120,
    observacao: "Cliente corporativo com operação semanal recorrente.",
  },
];

function safeReadPermissions(): PermissionItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as PermissionItem[];
  } catch {
    return [];
  }
}

function safeReadSessionEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SESSION_EMAIL_STORAGE_KEY) || "";
}

function safeWriteSessionEmail(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_EMAIL_STORAGE_KEY, email);
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calculateProjection(item: ProjectionItem) {
  const totalDiariasBase = item.diariasSemana * item.semanas;
  const diariasLiquidas = Math.max(totalDiariasBase - item.faltas, 0);
  const bruto = diariasLiquidas * item.valorDiaria;
  const total = bruto + item.extras - item.descontos - item.adiantamentos;

  return {
    totalDiariasBase,
    diariasLiquidas,
    bruto,
    total,
    semanal: item.diariasSemana * item.valorDiaria,
    quinzenal: item.valorDiaria * item.diariasSemana * 2,
    mensal: item.valorDiaria * item.diariasSemana * 4,
  };
}

export default function DiariasPage() {
  const [items, setItems] = useState<ProjectionItem[]>(initialItems);
  const [search, setSearch] = useState("");

  const [sessionEmail, setSessionEmail] = useState("");
  const [permissionName, setPermissionName] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");

  const [form, setForm] = useState<ProjectionItem>({
    id: "",
    cliente: "",
    motorista: "",
    empresa: "Aurora Motoristas",
    valorDiaria: 0,
    diariasSemana: 6,
    semanas: 1,
    faltas: 0,
    descontos: 0,
    adiantamentos: 0,
    extras: 0,
    observacao: "",
  });

  useEffect(() => {
    const savedEmail = safeReadSessionEmail();
    setSessionEmail(savedEmail);
    validateAccess(savedEmail);
  }, []);

  function validateAccess(emailToCheck: string) {
    const email = emailToCheck.trim().toLowerCase();
    const permissions = safeReadPermissions();

    if (!email) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName("");
      setAccessMessage("Informe o e-mail de sessão local para validar acesso Ã s diárias.");
      return;
    }

    const found = permissions.find(
      (item) => item.email.trim().toLowerCase() === email
    );

    if (!found) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName("");
      setAccessMessage("Este e-mail não está na base de autorizados.");
      return;
    }

    if (!found.diarias) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName(found.nome);
      setAccessMessage("Este usuário existe, mas não possui liberação para o módulo de diárias.");
      return;
    }

    setAccessGranted(true);
    setAccessChecked(true);
    setPermissionName(found.nome);
    setAccessMessage(`Acesso liberado para ${found.nome} (${found.role}).`);
  }

  function confirmarSessaoLocal() {
    safeWriteSessionEmail(sessionEmail);
    validateAccess(sessionEmail);
  }

  function updateForm<K extends keyof ProjectionItem>(
    field: K,
    value: ProjectionItem[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addProjection() {
    if (!form.cliente.trim() || !form.motorista.trim()) {
      alert("Preencha pelo menos cliente e motorista.");
      return;
    }

    const newItem: ProjectionItem = {
      ...form,
      id: `DIA-${String(items.length + 1).padStart(4, "0")}`,
    };

    setItems((current) => [newItem, ...current]);
    setForm({
      id: "",
      cliente: "",
      motorista: "",
      empresa: "Aurora Motoristas",
      valorDiaria: 0,
      diariasSemana: 6,
      semanas: 1,
      faltas: 0,
      descontos: 0,
      adiantamentos: 0,
      extras: 0,
      observacao: "",
    });
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      `${item.id} ${item.cliente} ${item.motorista} ${item.empresa} ${item.observacao}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        const projection = calculateProjection(item);
        acc.bruto += projection.bruto;
        acc.total += projection.total;
        acc.semanal += projection.semanal;
        acc.quinzenal += projection.quinzenal;
        acc.mensal += projection.mensal;
        return acc;
      },
      {
        bruto: 0,
        total: 0,
        semanal: 0,
        quinzenal: 0,
        mensal: 0,
      }
    );
  }, [filteredItems]);

  const preview = calculateProjection(form);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ DIÃRIAS</div>
              <h1 style={styles.heroTitle}>
                Projeção de pagamento por diária com visão semanal, quinzenal e mensal
              </h1>
              <p style={styles.heroText}>
                Esta área agora também valida se o e-mail de sessão local possui
                liberação para acessar o módulo de diárias.
              </p>

              <div style={styles.heroActions}>
                <Link href="/seguranca" style={styles.secondaryButton}>
                  Voltar para segurança
                </Link>
                <Link href="/financeiro" style={styles.primaryButton}>
                  Ir para financeiro
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>DIÃRIAS PROTEGIDAS</span>
              <h2 style={styles.sideTitle}>Acesso só para autorizados</h2>
              <p style={styles.sideText}>
                Esta camada já bloqueia o módulo para quem não tiver permissão
                específica de diárias na central de segurança.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Semanal</div>
                <div style={styles.sidePill}>Quinzenal</div>
                <div style={styles.sidePill}>Acesso controlado</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta tela já faz a trava real por
            permissão local e será conectada depois Ã  sessão completa do app.
          </div>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.accessCard}>
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionEyebrow}>VALIDAÇÃƒO DE ACESSO</span>
              <h2 style={styles.sectionTitle}>Sessão local das diárias</h2>
            </div>
          </div>

          <div style={styles.accessGrid}>
            <div style={styles.field}>
              <label style={styles.label}>E-mail da sessão local</label>
              <input
                value={sessionEmail}
                onChange={(e) => setSessionEmail(e.target.value)}
                style={styles.input}
                placeholder="Digite o e-mail liberado no módulo segurança"
              />
            </div>

            <div style={styles.actionRow}>
              <button type="button" onClick={confirmarSessaoLocal} style={styles.primaryAction}>
                Validar acesso
              </button>
            </div>
          </div>

          {accessChecked ? (
            <div
              style={
                accessGranted ? styles.accessSuccessBox : styles.accessErrorBox
              }
            >
              {accessMessage}
              {permissionName ? ` Usuário reconhecido: ${permissionName}.` : ""}
            </div>
          ) : null}
        </div>
      </section>

      {!accessGranted ? (
        <section style={styles.contentSection}>
          <div style={styles.blockedCard}>
            <span style={styles.sectionEyebrow}>ACESSO BLOQUEADO</span>
            <h2 style={styles.sidebarTitle}>Diárias protegidas</h2>
            <p style={styles.blockedText}>
              Esta área é sensível e só pode ser vista por administrador ou por quem
              tiver liberação específica no módulo de segurança.
            </p>

            <div style={styles.navList}>
              <Link href="/seguranca" style={styles.navItem}>
                Abrir segurança
              </Link>
              <Link href="/operacao" style={styles.navItem}>
                Voltar para operação
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section style={styles.statsSection}>
            <div style={styles.statsGrid}>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Projeção semanal</span>
                <strong style={styles.statValue}>{formatCurrency(totals.semanal)}</strong>
                <span style={styles.statDetail}>Base consolidada</span>
              </article>

              <article style={styles.statCard}>
                <span style={styles.statLabel}>Projeção quinzenal</span>
                <strong style={styles.statValue}>{formatCurrency(totals.quinzenal)}</strong>
                <span style={styles.statDetail}>Leitura intermediária</span>
              </article>

              <article style={styles.statCard}>
                <span style={styles.statLabel}>Projeção mensal</span>
                <strong style={styles.statValue}>{formatCurrency(totals.mensal)}</strong>
                <span style={styles.statDetail}>Visão de caixa</span>
              </article>

              <article style={styles.statCard}>
                <span style={styles.statLabel}>Total líquido</span>
                <strong style={styles.statValue}>{formatCurrency(totals.total)}</strong>
                <span style={styles.statDetail}>Após ajustes</span>
              </article>
            </div>
          </section>

          <section style={styles.contentSection}>
            <div style={styles.mainGrid}>
              <div style={styles.leftColumn}>
                <div style={styles.formCard}>
                  <div style={styles.sectionHeader}>
                    <div>
                      <span style={styles.sectionEyebrow}>LANÇAMENTO</span>
                      <h2 style={styles.sectionTitle}>Nova projeção de diária</h2>
                    </div>
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>Cliente</label>
                      <input
                        value={form.cliente}
                        onChange={(e) => updateForm("cliente", e.target.value)}
                        style={styles.input}
                        placeholder="Ex.: Aurora Locadoras Premium"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Motorista</label>
                      <input
                        value={form.motorista}
                        onChange={(e) => updateForm("motorista", e.target.value)}
                        style={styles.input}
                        placeholder="Ex.: Pedro Paulo"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Empresa</label>
                      <input
                        value={form.empresa}
                        onChange={(e) => updateForm("empresa", e.target.value)}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Valor da diária</label>
                      <input
                        value={String(form.valorDiaria)}
                        onChange={(e) =>
                          updateForm("valorDiaria", Number(e.target.value.replace(",", ".")) || 0)
                        }
                        style={styles.input}
                        placeholder="180"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Diárias por semana</label>
                      <input
                        value={String(form.diariasSemana)}
                        onChange={(e) =>
                          updateForm("diariasSemana", Number(e.target.value) || 0)
                        }
                        style={styles.input}
                        placeholder="6"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Semanas</label>
                      <input
                        value={String(form.semanas)}
                        onChange={(e) =>
                          updateForm("semanas", Number(e.target.value) || 0)
                        }
                        style={styles.input}
                        placeholder="1"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Faltas</label>
                      <input
                        value={String(form.faltas)}
                        onChange={(e) =>
                          updateForm("faltas", Number(e.target.value) || 0)
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Descontos</label>
                      <input
                        value={String(form.descontos)}
                        onChange={(e) =>
                          updateForm("descontos", Number(e.target.value.replace(",", ".")) || 0)
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Adiantamentos</label>
                      <input
                        value={String(form.adiantamentos)}
                        onChange={(e) =>
                          updateForm("adiantamentos", Number(e.target.value.replace(",", ".")) || 0)
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Extras</label>
                      <input
                        value={String(form.extras)}
                        onChange={(e) =>
                          updateForm("extras", Number(e.target.value.replace(",", ".")) || 0)
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.fieldWide}>
                      <label style={styles.label}>Observação</label>
                      <textarea
                        value={form.observacao}
                        onChange={(e) => updateForm("observacao", e.target.value)}
                        style={styles.textarea}
                        placeholder="Ex.: cliente com operação intensa, possíveis faltas, previsão de caixa apertado."
                      />
                    </div>
                  </div>

                  <div style={styles.actionRow}>
                    <button type="button" onClick={addProjection} style={styles.primaryAction}>
                      Salvar projeção
                    </button>
                  </div>
                </div>

                <div style={styles.listCard}>
                  <div style={styles.sectionHeader}>
                    <div>
                      <span style={styles.sectionEyebrow}>BASE DE PROJEÇÃƒO</span>
                      <h2 style={styles.sectionTitle}>Motoristas por diária</h2>
                    </div>

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={styles.searchInput}
                      placeholder="Buscar por cliente, motorista ou empresa"
                    />
                  </div>

                  <div style={styles.list}>
                    {filteredItems.length === 0 ? (
                      <div style={styles.emptyState}>Nenhuma projeção encontrada.</div>
                    ) : (
                      filteredItems.map((item) => {
                        const calc = calculateProjection(item);

                        return (
                          <article key={item.id} style={styles.itemCard}>
                            <div style={styles.itemTop}>
                              <div>
                                <h3 style={styles.itemTitle}>{item.motorista}</h3>
                                <p style={styles.itemSubline}>
                                  {item.cliente} â€¢ {item.empresa} â€¢ {item.id}
                                </p>
                              </div>

                              <strong style={styles.itemValue}>
                                {formatCurrency(calc.total)}
                              </strong>
                            </div>

                            <div style={styles.itemGrid}>
                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Valor diária</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(item.valorDiaria)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Diárias líquidas</span>
                                <strong style={styles.dataValue}>{calc.diariasLiquidas}</strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Semanal</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(calc.semanal)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Quinzenal</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(calc.quinzenal)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Mensal</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(calc.mensal)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Bruto</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(calc.bruto)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Descontos</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(item.descontos)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Adiantamentos</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(item.adiantamentos)}
                                </strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Extras</span>
                                <strong style={styles.dataValue}>
                                  {formatCurrency(item.extras)}
                                </strong>
                              </div>

                              <div style={styles.dataItemWide}>
                                <span style={styles.dataLabel}>Observação</span>
                                <strong style={styles.dataValue}>{item.observacao || "Sem observação."}</strong>
                              </div>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <aside style={styles.rightColumn}>
                <div style={styles.previewCard}>
                  <span style={styles.sectionEyebrow}>PRÉVIA RÃPIDA</span>
                  <h2 style={styles.sidebarTitle}>Projeção do lançamento atual</h2>

                  <div style={styles.ruleList}>
                    <div style={styles.ruleItem}>
                      <strong style={styles.ruleItemTitle}>Semanal</strong>
                      <span style={styles.ruleItemText}>
                        {formatCurrency(preview.semanal)}
                      </span>
                    </div>

                    <div style={styles.ruleItem}>
                      <strong style={styles.ruleItemTitle}>Quinzenal</strong>
                      <span style={styles.ruleItemText}>
                        {formatCurrency(preview.quinzenal)}
                      </span>
                    </div>

                    <div style={styles.ruleItem}>
                      <strong style={styles.ruleItemTitle}>Mensal</strong>
                      <span style={styles.ruleItemText}>
                        {formatCurrency(preview.mensal)}
                      </span>
                    </div>

                    <div style={styles.ruleItem}>
                      <strong style={styles.ruleItemTitle}>Bruto</strong>
                      <span style={styles.ruleItemText}>
                        {formatCurrency(preview.bruto)}
                      </span>
                    </div>

                    <div style={styles.ruleItem}>
                      <strong style={styles.ruleItemTitle}>Total líquido</strong>
                      <span style={styles.ruleItemText}>
                        {formatCurrency(preview.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.darkCard}>
                  <div style={styles.robotTag}>ROBÃ” AURORA</div>
                  <h2 style={styles.sidebarTitleDark}>Apoio Ã  projeção</h2>
                  <p style={styles.sidebarTextDark}>
                    O RobÃ´ Aurora poderá apontar motorista caro para a margem atual,
                    excesso de adiantamento, cliente pesado na semana e pressão no caixa.
                  </p>

                  <div style={styles.robotList}>
                    <div style={styles.robotItem}>Ler custo semanal</div>
                    <div style={styles.robotItem}>Ler custo mensal</div>
                    <div style={styles.robotItem}>Apontar adiantamentos</div>
                    <div style={styles.robotItem}>Ajudar no caixa</div>
                  </div>
                </div>

                <div style={styles.navCard}>
                  <span style={styles.sectionEyebrow}>NAVEGAÇÃƒO</span>
                  <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

                  <div style={styles.navList}>
                    <Link href="/seguranca" style={styles.navItem}>
                      Abrir segurança
                    </Link>
                    <Link href="/financeiro" style={styles.navItem}>
                      Abrir financeiro
                    </Link>
                    <Link href="/relatorios" style={styles.navItem}>
                      Abrir relatórios
                    </Link>
                    <Link href="/operacao" style={styles.navItem}>
                      Abrir operação
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </>
      )}
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

  contentSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 0",
  },

  accessCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  accessGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 14,
  },

  accessSuccessBox: {
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

  accessErrorBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    color: "#991b1b",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  blockedCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #fff7f7 100%)",
    borderRadius: 24,
    border: "1px solid rgba(239, 68, 68, 0.18)",
    padding: 24,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  blockedText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.8,
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
    fontSize: 26,
    lineHeight: 1.1,
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

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
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

  listCard: {
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
    fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)",
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

  textarea: {
    minHeight: 120,
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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  itemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  itemTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  itemSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 600,
  },

  itemValue: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
  },

  dataItemWide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    gridColumn: "1 / -1",
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  dataValue: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 800,
  },

  searchInput: {
    minHeight: 46,
    minWidth: 280,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
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

  previewCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
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

  navCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  navItem: {
    display: "block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 800,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },
};

