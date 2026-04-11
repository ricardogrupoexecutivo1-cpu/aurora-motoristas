"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CompanyRecord = {
  id: string;
  nome: string;
  tipo: "Locadora" | "Empresa" | "Operação" | "Parceiro";
  cidade: string;
  estado: string;
  status: "Ativa" | "Em implantação" | "Bloqueada";
  escopo: "Base própria" | "Base controlada" | "Operação limitada";
  responsavel: string;
  whatsapp: string;
  email: string;
  clientes: number;
  motoristas: number;
  servicosAtivos: number;
  osSistemaInicial: string;
  ocSistemaInicial: string;
  politicaContato: "Liberado por serviço" | "Somente interno" | "Parcial";
  observacao: string;
};

const companies: CompanyRecord[] = [
  {
    id: "EMP-0001",
    nome: "Aurora Locadoras Premium",
    tipo: "Locadora",
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "Ativa",
    escopo: "Base própria",
    responsavel: "Ricardo Leonardo Moreira",
    whatsapp: "(31) 99999-0001",
    email: "contato@auroramotoristas.local",
    clientes: 18,
    motoristas: 36,
    servicosAtivos: 12,
    osSistemaInicial: "OS-2026-000001",
    ocSistemaInicial: "OC-2026-000001",
    politicaContato: "Liberado por serviço",
    observacao:
      "Empresa principal da operação com segregação total da própria base, clientes, motoristas e fluxo interno.",
  },
  {
    id: "EMP-0002",
    nome: "Grupo Executivo Mobilidade",
    tipo: "Empresa",
    cidade: "Contagem",
    estado: "MG",
    status: "Em implantação",
    escopo: "Base controlada",
    responsavel: "Patrícia Alves",
    whatsapp: "(31) 98888-2211",
    email: "implantacao@executivomobilidade.local",
    clientes: 9,
    motoristas: 14,
    servicosAtivos: 5,
    osSistemaInicial: "OS-2026-000301",
    ocSistemaInicial: "OC-2026-000201",
    politicaContato: "Somente interno",
    observacao:
      "Empresa em implantação com regras mais restritas de contato e maior controle administrativo.",
  },
  {
    id: "EMP-0003",
    nome: "Operação Nacional Eventos",
    tipo: "Operação",
    cidade: "São Paulo",
    estado: "SP",
    status: "Ativa",
    escopo: "Operação limitada",
    responsavel: "Marcos Vinícius",
    whatsapp: "(11) 97777-3300",
    email: "operacao@eventosnacional.local",
    clientes: 6,
    motoristas: 11,
    servicosAtivos: 7,
    osSistemaInicial: "OS-2026-000601",
    ocSistemaInicial: "OC-2026-000451",
    politicaContato: "Parcial",
    observacao:
      "Operação de eventos com visualização limitada ao escopo operacional definido pela administração master.",
  },
];

const governanceRules = [
  {
    title: "Cada empresa tem sua própria base",
    text: "Clientes, motoristas, serviços e relacionamentos ficam separados por empresa para evitar mistura operacional.",
  },
  {
    title: "Escopo de visualização controlado",
    text: "A empresa só enxerga aquilo que foi liberado no seu escopo: base própria, base controlada ou operação limitada.",
  },
  {
    title: "Sem acesso cruzado entre empresas",
    text: "Uma empresa não vê base, ordens, clientes ou motoristas de outra empresa sem autorização específica.",
  },
  {
    title: "OS e OC seguem o sistema",
    text: "Cada empresa opera com numeração oficial do sistema e também pode guardar a numeração própria do cliente quando necessário.",
  },
];

const suggestions = [
  "Definir administrador master por empresa ou grupo econômico.",
  "Permitir múltiplos administradores autorizados por base.",
  "Criar centro de custo próprio por empresa.",
  "Separar políticas de contato e privacidade por empresa.",
  "Definir modelo de pagamento por empresa: salário, diária, fixo, km ou híbrido.",
  "Controlar acesso ao financeiro por empresa e por nível autorizado.",
];

function getStatusStyle(status: CompanyRecord["status"]): React.CSSProperties {
  if (status === "Ativa") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "Em implantação") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.18)",
  };
}

function getScopeStyle(scope: CompanyRecord["escopo"]): React.CSSProperties {
  if (scope === "Base própria") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  if (scope === "Base controlada") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

export default function EmpresasCadastroPage() {
  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    return companies.filter((item) => {
      const target = [
        item.id,
        item.nome,
        item.tipo,
        item.cidade,
        item.estado,
        item.status,
        item.escopo,
        item.responsavel,
        item.politicaContato,
      ]
        .join(" ")
        .toLowerCase();

      return target.includes(search.toLowerCase());
    });
  }, [search]);

  const stats = useMemo(() => {
    return {
      total: filteredCompanies.length,
      ativas: filteredCompanies.filter((item) => item.status === "Ativa").length,
      clientes: filteredCompanies.reduce((acc, item) => acc + item.clientes, 0),
      motoristas: filteredCompanies.reduce((acc, item) => acc + item.motoristas, 0),
    };
  }, [filteredCompanies]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • EMPRESAS</div>
              <h1 style={styles.heroTitle}>
                Empresas e locadoras com base própria, escopo controlado e governança real
              </h1>
              <p style={styles.heroText}>
                Esta área organiza as empresas do app independente, deixando clara
                a separação de base, clientes, motoristas, serviços, escopo de
                visualização e política de privacidade operacional.
              </p>

              <div style={styles.heroActions}>
                <Link href="/cadastros" style={styles.secondaryButton}>
                  Voltar para cadastros
                </Link>

                <Link href="/cadastros/clientes" style={styles.primaryButton}>
                  Ir para clientes
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>GOVERNANÇA DA BASE</span>
              <h2 style={styles.sideTitle}>Cada empresa com seu próprio território</h2>
              <p style={styles.sideText}>
                A lógica aqui é clara: cada empresa vê a própria base, opera no
                próprio escopo e não cruza clientes, motoristas ou relatórios com
                outras empresas sem autorização expressa.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Base própria</div>
                <div style={styles.sidePill}>Escopo controlado</div>
                <div style={styles.sidePill}>Sem acesso cruzado</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta camada já está sendo preparada
            para multiempresa real, com segregação de base, permissões por nível
            e futuras integrações sem misturar operações.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Empresas visíveis</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base empresarial carregada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Empresas ativas</span>
            <strong style={styles.statValue}>{stats.ativas}</strong>
            <span style={styles.statDetail}>Operação em curso</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Clientes totais</span>
            <strong style={styles.statValue}>{stats.clientes}</strong>
            <span style={styles.statDetail}>Somatório da base filtrada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Motoristas totais</span>
            <strong style={styles.statValue}>{stats.motoristas}</strong>
            <span style={styles.statDetail}>Somatório da base filtrada</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.companyCardWrap}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>BASE DE EMPRESAS</span>
                  <h2 style={styles.sectionTitle}>Empresas, locadoras e operações</h2>
                </div>

                <div style={styles.searchBox}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por empresa, cidade, tipo, escopo ou responsável"
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.companyList}>
                {filteredCompanies.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhuma empresa encontrada para este filtro.
                  </div>
                ) : (
                  filteredCompanies.map((company) => (
                    <article key={company.id} style={styles.companyCard}>
                      <div style={styles.companyTop}>
                        <div>
                          <h3 style={styles.companyTitle}>{company.nome}</h3>
                          <p style={styles.companySubline}>
                            {company.id} • {company.tipo} • {company.cidade} • {company.estado}
                          </p>
                        </div>

                        <div style={styles.companyTopRight}>
                          <span style={{ ...styles.badge, ...getStatusStyle(company.status) }}>
                            {company.status}
                          </span>
                          <span style={{ ...styles.badge, ...getScopeStyle(company.escopo) }}>
                            {company.escopo}
                          </span>
                        </div>
                      </div>

                      <div style={styles.companyGrid}>
                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Responsável</span>
                          <strong style={styles.dataValue}>{company.responsavel}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>WhatsApp</span>
                          <strong style={styles.dataValue}>{company.whatsapp}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>E-mail</span>
                          <strong style={styles.dataValue}>{company.email}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Clientes</span>
                          <strong style={styles.dataValue}>{company.clientes}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Motoristas</span>
                          <strong style={styles.dataValue}>{company.motoristas}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Serviços ativos</span>
                          <strong style={styles.dataValue}>{company.servicosAtivos}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OS inicial do sistema</span>
                          <strong style={styles.dataValue}>{company.osSistemaInicial}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OC inicial do sistema</span>
                          <strong style={styles.dataValue}>{company.ocSistemaInicial}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Política de contato</span>
                          <strong style={styles.dataValue}>{company.politicaContato}</strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação</span>
                          <strong style={styles.dataValue}>{company.observacao}</strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.rulesCard}>
              <span style={styles.sectionEyebrow}>REGRAS DE GOVERNANÇA</span>
              <h2 style={styles.sidebarTitle}>Base empresarial protegida</h2>

              <div style={styles.ruleList}>
                {governanceRules.map((item) => (
                  <div key={item.title} style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>{item.title}</strong>
                    <span style={styles.ruleItemText}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>SUGESTÕES EXTRAS</div>
              <h2 style={styles.sidebarTitleDark}>Ajustes para fortalecer o módulo</h2>

              <div style={styles.robotList}>
                {suggestions.map((item) => (
                  <div key={item} style={styles.robotItem}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/cadastros" style={styles.navItem}>
                  Voltar para cadastros
                </Link>
                <Link href="/cadastros/clientes" style={styles.navItem}>
                  Abrir clientes
                </Link>
                <Link href="/cadastros/motoristas" style={styles.navItem}>
                  Abrir motoristas
                </Link>
                <Link href="/" style={styles.navItem}>
                  Ir para home
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
    maxWidth: 820,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 820,
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
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.85fr)",
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

  companyCardWrap: {
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

  searchBox: {
    minWidth: 320,
  },

  searchInput: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  companyList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  companyCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  companyTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  companyTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  companySubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  companyTopRight: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  companyGrid: {
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

  emptyState: {
    padding: 18,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px dashed rgba(125, 211, 252, 0.34)",
    color: "#475569",
    fontSize: 15,
    fontWeight: 700,
  },

  rulesCard: {
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

  robotList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  robotItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.55,
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