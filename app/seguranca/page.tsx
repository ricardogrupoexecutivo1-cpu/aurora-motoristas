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

const STORAGE_KEY = "aurora_motoristas_permissoes";

const initialPermissions: PermissionItem[] = [
  {
    id: "PERM-0001",
    nome: "Ricardo Leonardo Moreira",
    email: "ricardogrupoexecutivo1@gmail.com",
    role: "Admin Master",
    financeiro: true,
    cadastros: true,
    diarias: true,
    relatorios: true,
    operacao: true,
    translados: true,
    observacao: "Administrador principal com acesso total.",
  },
  {
    id: "PERM-0002",
    nome: "Neida Financeiro",
    email: "finance@ges.com",
    role: "Financeiro",
    financeiro: true,
    cadastros: false,
    diarias: true,
    relatorios: true,
    operacao: false,
    translados: false,
    observacao: "Acesso focado em financeiro e leitura de apoio.",
  },
];

function safeReadPermissions(): PermissionItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPermissions;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialPermissions;

    return parsed.filter(Boolean) as PermissionItem[];
  } catch {
    return initialPermissions;
  }
}

function safeWritePermissions(items: PermissionItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getRoleStyle(role: AccessRole): React.CSSProperties {
  if (role === "Admin Master") {
    return {
      background: "rgba(37, 99, 235, 0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.22)",
    };
  }

  if (role === "Administrador") {
    return {
      background: "rgba(6, 182, 212, 0.12)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.22)",
    };
  }

  if (role === "Financeiro") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (role === "Operacional") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

export default function SegurancaPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>(initialPermissions);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<PermissionItem>({
    id: "",
    nome: "",
    email: "",
    role: "Leitura",
    financeiro: false,
    cadastros: false,
    diarias: false,
    relatorios: false,
    operacao: false,
    translados: false,
    observacao: "",
  });

  useEffect(() => {
    const saved = safeReadPermissions();
    setPermissions(saved);
  }, []);

  function updateForm<K extends keyof PermissionItem>(
    field: K,
    value: PermissionItem[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function savePermission() {
    if (!form.nome.trim() || !form.email.trim()) {
      alert("Preencha pelo menos nome e e-mail.");
      return;
    }

    const newPermission: PermissionItem = {
      ...form,
      id: `PERM-${String(permissions.length + 1).padStart(4, "0")}`,
    };

    const updated = [newPermission, ...permissions];
    setPermissions(updated);
    safeWritePermissions(updated);

    setForm({
      id: "",
      nome: "",
      email: "",
      role: "Leitura",
      financeiro: false,
      cadastros: false,
      diarias: false,
      relatorios: false,
      operacao: false,
      translados: false,
      observacao: "",
    });

    setFeedback("Permissão salva com sucesso.");
  }

  function removePermission(id: string) {
    const updated = permissions.filter((item) => item.id !== id);
    setPermissions(updated);
    safeWritePermissions(updated);
    setFeedback("Permissão removida com sucesso.");
  }

  function togglePermission(
    id: string,
    field:
      | "financeiro"
      | "cadastros"
      | "diarias"
      | "relatorios"
      | "operacao"
      | "translados"
  ) {
    const updated = permissions.map((item) =>
      item.id === id ? { ...item, [field]: !item[field] } : item
    );
    setPermissions(updated);
    safeWritePermissions(updated);
    setFeedback("Permissão atualizada com sucesso.");
  }

  const filteredPermissions = useMemo(() => {
    return permissions.filter((item) =>
      `${item.id} ${item.nome} ${item.email} ${item.role} ${item.observacao}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [permissions, search]);

  const stats = useMemo(() => {
    return {
      total: permissions.length,
      adminMaster: permissions.filter((item) => item.role === "Admin Master").length,
      administradores: permissions.filter((item) => item.role === "Administrador").length,
      financeiro: permissions.filter((item) => item.financeiro).length,
      leitura: permissions.filter((item) => item.role === "Leitura").length,
      operacao: permissions.filter((item) => item.operacao).length,
    };
  }, [permissions]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • SEGURANÇA</div>
              <h1 style={styles.heroTitle}>
                Blindagem de acesso por administrador e usuários autorizados
              </h1>
              <p style={styles.heroText}>
                Esta central organiza quem pode entrar nas áreas sensíveis do app,
                separando acesso administrativo, financeiro, operacional e leitura.
              </p>

              <div style={styles.heroActions}>
                <Link href="/financeiro" style={styles.secondaryButton}>
                  Voltar para financeiro
                </Link>
                <Link href="/cadastros-inteligentes" style={styles.primaryButton}>
                  Ir para cadastros
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>BLINDAGEM INTERNA</span>
              <h2 style={styles.sideTitle}>Quem vê o quê</h2>
              <p style={styles.sideText}>
                Esta camada já separa papéis e módulos autorizados para preparar
                a proteção real do sistema sem atrapalhar a evolução.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Admin Master</div>
                <div style={styles.sidePill}>Financeiro</div>
                <div style={styles.sidePill}>Operacional</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta central já salva permissões no
            navegador e prepara a amarração das páginas sensíveis no próximo passo.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total autorizados</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base de acesso</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Admin Master</span>
            <strong style={styles.statValue}>{stats.adminMaster}</strong>
            <span style={styles.statDetail}>Controle total</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Administradores</span>
            <strong style={styles.statValue}>{stats.administradores}</strong>
            <span style={styles.statDetail}>Gestão liberada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Acesso financeiro</span>
            <strong style={styles.statValue}>{stats.financeiro}</strong>
            <span style={styles.statDetail}>Módulo sensível</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Leitura</span>
            <strong style={styles.statValue}>{stats.leitura}</strong>
            <span style={styles.statDetail}>Visualização limitada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Operação liberada</span>
            <strong style={styles.statValue}>{stats.operacao}</strong>
            <span style={styles.statDetail}>Fluxo operacional</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.formCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>NOVA LIBERAÇÃO</span>
                  <h2 style={styles.sectionTitle}>Cadastrar autorizado</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Nome</label>
                  <input
                    value={form.nome}
                    onChange={(e) => updateForm("nome", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Nome do usuário"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>E-mail</label>
                  <input
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    style={styles.input}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Perfil</label>
                  <select
                    value={form.role}
                    onChange={(e) => updateForm("role", e.target.value as AccessRole)}
                    style={styles.select}
                  >
                    <option>Admin Master</option>
                    <option>Administrador</option>
                    <option>Financeiro</option>
                    <option>Operacional</option>
                    <option>Leitura</option>
                  </select>
                </div>

                <div style={styles.fieldWide}>
                  <label style={styles.label}>Observação</label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => updateForm("observacao", e.target.value)}
                    style={styles.textarea}
                    placeholder="Ex.: pode ver financeiro, não pode alterar cadastros."
                  />
                </div>
              </div>

              <div style={styles.permissionBox}>
                <div style={styles.permissionTitle}>Módulos liberados</div>

                <div style={styles.checkboxGrid}>
                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.financeiro}
                      onChange={(e) => updateForm("financeiro", e.target.checked)}
                    />
                    <span>Financeiro</span>
                  </label>

                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.cadastros}
                      onChange={(e) => updateForm("cadastros", e.target.checked)}
                    />
                    <span>Cadastros</span>
                  </label>

                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.diarias}
                      onChange={(e) => updateForm("diarias", e.target.checked)}
                    />
                    <span>Diárias</span>
                  </label>

                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.relatorios}
                      onChange={(e) => updateForm("relatorios", e.target.checked)}
                    />
                    <span>Relatórios</span>
                  </label>

                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.operacao}
                      onChange={(e) => updateForm("operacao", e.target.checked)}
                    />
                    <span>Operação</span>
                  </label>

                  <label style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={form.translados}
                      onChange={(e) => updateForm("translados", e.target.checked)}
                    />
                    <span>Translados</span>
                  </label>
                </div>
              </div>

              <div style={styles.actionRow}>
                <button type="button" onClick={savePermission} style={styles.primaryAction}>
                  Salvar autorizado
                </button>
              </div>

              {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : null}
            </div>

            <div style={styles.listCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>BASE DE PERMISSÕES</span>
                  <h2 style={styles.sectionTitle}>Usuários autorizados</h2>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                  placeholder="Buscar por nome, e-mail ou perfil"
                />
              </div>

              <div style={styles.list}>
                {filteredPermissions.length === 0 ? (
                  <div style={styles.emptyState}>Nenhum autorizado encontrado.</div>
                ) : (
                  filteredPermissions.map((item) => (
                    <article key={item.id} style={styles.itemCard}>
                      <div style={styles.itemTop}>
                        <div>
                          <div style={styles.metaRow}>
                            <span style={{ ...styles.roleBadge, ...getRoleStyle(item.role) }}>
                              {item.role}
                            </span>
                          </div>

                          <h3 style={styles.itemTitle}>{item.nome}</h3>
                          <p style={styles.itemSubline}>
                            {item.email} • {item.id}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removePermission(item.id)}
                          style={styles.removeButton}
                        >
                          Remover
                        </button>
                      </div>

                      <div style={styles.itemGrid}>
                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Financeiro</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "financeiro")}
                            style={item.financeiro ? styles.switchOn : styles.switchOff}
                          >
                            {item.financeiro ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Cadastros</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "cadastros")}
                            style={item.cadastros ? styles.switchOn : styles.switchOff}
                          >
                            {item.cadastros ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Diárias</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "diarias")}
                            style={item.diarias ? styles.switchOn : styles.switchOff}
                          >
                            {item.diarias ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Relatórios</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "relatorios")}
                            style={item.relatorios ? styles.switchOn : styles.switchOff}
                          >
                            {item.relatorios ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Operação</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "operacao")}
                            style={item.operacao ? styles.switchOn : styles.switchOff}
                          >
                            {item.operacao ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.switchCard}>
                          <span style={styles.switchLabel}>Translados</span>
                          <button
                            type="button"
                            onClick={() => togglePermission(item.id, "translados")}
                            style={item.translados ? styles.switchOn : styles.switchOff}
                          >
                            {item.translados ? "Liberado" : "Bloqueado"}
                          </button>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação</span>
                          <strong style={styles.dataValue}>
                            {item.observacao || "Sem observação."}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.previewCard}>
              <span style={styles.sectionEyebrow}>LEITURA DA BLINDAGEM</span>
              <h2 style={styles.sidebarTitle}>O que este bloco resolve</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Admin Master</strong>
                  <span style={styles.ruleItemText}>
                    Mantém controle total sobre o sistema.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Financeiro protegido</strong>
                  <span style={styles.ruleItemText}>
                    Só quem for liberado poderá acessar o módulo sensível.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Permissão por módulo</strong>
                  <span style={styles.ruleItemText}>
                    Cada usuário pode ter uma combinação diferente de acessos.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Base pronta</strong>
                  <span style={styles.ruleItemText}>
                    Já deixa o app preparado para a trava real nas páginas.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio à segurança</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá apontar acesso excessivo, usuário sem perfil claro,
                módulo sensível exposto e distribuição ruim de permissões.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler excesso de acesso</div>
                <div style={styles.robotItem}>Apontar perfil fraco</div>
                <div style={styles.robotItem}>Separar financeiro</div>
                <div style={styles.robotItem}>Ajudar na blindagem</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/financeiro" style={styles.navItem}>
                  Abrir financeiro
                </Link>
                <Link href="/cadastros-inteligentes" style={styles.navItem}>
                  Abrir cadastros
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operação
                </Link>
                <Link href="/relatorios" style={styles.navItem}>
                  Abrir relatórios
                </Link>
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

  contentSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 0",
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
    minHeight: 110,
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

  permissionBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  permissionTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 12,
  },

  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },

  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: 46,
    padding: "0 14px",
    borderRadius: 14,
    background: "#f8fbff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    fontWeight: 700,
    color: "#0f172a",
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

  metaRow: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },

  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  removeButton: {
    border: "1px solid rgba(239, 68, 68, 0.20)",
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#b91c1c",
    background: "#ffffff",
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

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  switchCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
  },

  switchLabel: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#64748b",
  },

  switchOn: {
    border: "1px solid rgba(16, 185, 129, 0.20)",
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#047857",
    background: "rgba(16, 185, 129, 0.08)",
  },

  switchOff: {
    border: "1px solid rgba(148, 163, 184, 0.20)",
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#475569",
    background: "rgba(148, 163, 184, 0.08)",
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