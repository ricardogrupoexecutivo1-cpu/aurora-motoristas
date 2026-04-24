import Link from "next/link";

export const metadata = {
  title: "Cadastros | Aurora Motoristas",
  description:
    "Base de cadastros do Aurora Motoristas com segregação por perfil, privacidade operacional, regras de acesso e proteção dos dados.",
};

const statCards = [
  {
    label: "Perfis segregados",
    value: "7",
    detail: "Cada tipo vê só o que precisa",
  },
  {
    label: "Base protegida",
    value: "Ativa",
    detail: "Separação real entre operação e financeiro",
  },
  {
    label: "Serviços pagos",
    value: "Ocultos",
    detail: "Após baixa, somem da visão do motorista",
  },
  {
    label: "Controle",
    value: "Master",
    detail: "Autorização central de administradores",
  },
];

const profileCards = [
  {
    title: "Motorista",
    badge: "Restrito",
    href: "/cadastros/motoristas",
    description:
      "Vê apenas os próprios dados, serviços ativos, status permitidos e pagamentos visíveis até a baixa.",
    canView: [
      "Próprio perfil",
      "Próprios serviços em aberto",
      "Próprio status",
      "Telefone do cliente quando autorizado",
      "Pagamento visível até receber",
    ],
    cannotView: [
      "Base geral de clientes",
      "Relatórios financeiros",
      "Custos internos",
      "Margem da operação",
      "Histórico pago oculto após baixa",
    ],
  },
  {
    title: "Cliente",
    badge: "Isolado",
    href: "/cadastros/clientes",
    description:
      "Vê apenas o que pertence ao seu contrato, suas ordens, seus serviços e o acompanhamento autorizado.",
    canView: [
      "Serviços do próprio cliente",
      "Ordens do próprio cliente",
      "Status e andamento",
      "Documentos liberados",
      "Campos públicos permitidos",
    ],
    cannotView: [
      "Outros clientes",
      "Financeiro global",
      "Outras locadoras",
      "Dados internos da empresa",
      "Motoristas sem vínculo necessário",
    ],
  },
  {
    title: "Empresa / Locadora",
    badge: "Gestão",
    href: "/cadastros/empresas",
    description:
      "Visualiza sua própria base operacional, seus clientes, seus motoristas vinculados e suas ordens.",
    canView: [
      "Próprios clientes",
      "Próprios motoristas vinculados",
      "Próprias OS e OC",
      "Próprios serviços",
      "Campos de operação permitidos",
    ],
    cannotView: [
      "Base de outras empresas",
      "Financeiro total sem autorização",
      "Registros globais sem vínculo",
      "Clientes de outras empresas",
      "Relatórios restritos do sistema",
    ],
  },
  {
    title: "Usuário interno operacional",
    badge: "Operação",
    href: "/cadastros/operacional",
    description:
      "Acompanha a operação, mas não entra no financeiro completo. Vê apenas status como pago ou não pago.",
    canView: [
      "Andamento de serviços",
      "OS e OC operacionais",
      "Situação paga ou não paga",
      "Fluxo de atendimento",
      "Campos de operação",
    ],
    cannotView: [
      "DRE",
      "Margem",
      "Fechamento detalhado",
      "Relatório financeiro completo",
      "Repasse total sem autorização",
    ],
  },
  {
    title: "Administrador autorizado",
    badge: "Admin",
    href: "/cadastros/administradores",
    description:
      "Recebe autorização do administrador master para acessar áreas críticas, incluindo financeiro conforme o nível.",
    canView: [
      "Financeiro autorizado",
      "Auditoria",
      "Aprovações",
      "Histórico protegido",
      "Relatórios completos conforme permissão",
    ],
    cannotView: [
      "Nada fora do nível concedido pelo master",
      "Permissões não autorizadas",
      "Ãreas acima do nível delegado",
      "Escopos removidos ou bloqueados",
      "Dados sem vínculo ao acesso concedido",
    ],
  },
  {
    title: "Administrador master",
    badge: "Master",
    href: "/cadastros/master",
    description:
      "Controla quem pode administrar, quem entra no financeiro, quais níveis existem e quais bases podem ser acessadas.",
    canView: [
      "Tudo com rastreabilidade",
      "Permissões",
      "Financeiro total",
      "Auditoria completa",
      "Configurações críticas",
    ],
    cannotView: [
      "Nada sem registro",
      "Nada fora da trilha de auditoria",
      "Nada sem política",
      "Nada sem regra definida",
      "Nada sem responsabilidade",
    ],
  },
];

const structuralRules = [
  {
    title: "Segregação por perfil",
    text: "Cada perfil acessa apenas o que é necessário para sua função. O app não mistura motorista, cliente, empresa, operação e administração.",
  },
  {
    title: "Proteção dos dados do cliente",
    text: "Motorista não vê dados completos do cliente. Só recebe telefone quando a locadora ou empresa liberar esse contato no serviço.",
  },
  {
    title: "Financeiro blindado",
    text: "Usuários internos comuns não entram em relatório financeiro completo. Eles enxergam apenas indicadores simples como pago e não pago.",
  },
  {
    title: "Serviço pago sai da visão do motorista",
    text: "Depois da baixa, o serviço some da área do motorista e continua apenas no histórico interno protegido para administração autorizada.",
  },
  {
    title: "OS e OC sequenciais do sistema",
    text: "A administração terá numeração oficial única e sequencial do sistema para ordem de serviço e ordem de compra.",
  },
  {
    title: "Numeração própria do cliente",
    text: "Além do número do sistema, haverá campo para OS e OC próprias de cada cliente, facilitando conciliação e operação real.",
  },
];

const numberingExamples = [
  {
    label: "OS do sistema",
    value: "OS-2026-000001",
  },
  {
    label: "OC do sistema",
    value: "OC-2026-000001",
  },
  {
    label: "OS do cliente",
    value: "OS-CLIENTE-4587",
  },
  {
    label: "OC do cliente",
    value: "OC-INTERNA-9931",
  },
];

const suggestions = [
  "Campo de autorização para compartilhar contato do cliente com o motorista.",
  "Modo de privacidade por cliente: restrito, parcial, operacional ou liberado por serviço.",
  "Justificativa obrigatória para alteração após salvamento.",
  "Histórico de autorização financeira com quem autorizou e quando.",
  "Fluxo de aprovação em etapas: criado, revisado, aprovado, executado, faturado, pago e encerrado.",
  "Controle de visualização por registro: somente admin, interno, cliente, motorista ou combinações permitidas.",
];

export default function CadastrosPage() {
  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroTextBlock}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ CADASTROS</div>
              <h1 style={styles.heroTitle}>
                Cadastros com segregação real, privacidade forte e operação sem mistura
              </h1>
              <p style={styles.heroText}>
                Esta área organiza os perfis do app independente e define quem vê
                o quê. Motorista, cliente, locadora, usuário interno, admin
                autorizado e master seguem regras próprias para evitar mistura,
                vazamento e descontrole operacional.
              </p>

              <div style={styles.heroActions}>
                <Link href="/" style={styles.secondaryButton}>
                  Voltar para a home
                </Link>

                <Link href="/servicos" style={styles.primaryButton}>
                  Ir para serviços
                </Link>
              </div>
            </div>

            <div style={styles.heroSideCard}>
              <span style={styles.sideKicker}>REGRA DE OURO</span>
              <h2 style={styles.sideTitle}>Serviço pago some da visão do motorista</h2>
              <p style={styles.sideText}>
                O motorista acompanha o serviço até receber. Depois da baixa, o
                registro deixa a visão dele e segue somente no histórico interno
                protegido da administração e autorizados.
              </p>

              <div style={styles.sideBadgeList}>
                <div style={styles.sideBadge}>Sem mistura indevida</div>
                <div style={styles.sideBadge}>Blindagem operacional</div>
                <div style={styles.sideBadge}>Histórico interno protegido</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. A estrutura já está sendo desenhada
            para multiempresa, privacidade real, autorização por nível e futura
            integração apenas com cadastro geral e acesso externo.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {statCards.map((item) => (
            <article key={item.label} style={styles.statCard}>
              <span style={styles.statLabel}>{item.label}</span>
              <strong style={styles.statValue}>{item.value}</strong>
              <span style={styles.statDetail}>{item.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>PERFIS DO SISTEMA</span>
          <h2 style={styles.sectionTitle}>Cada usuário vê apenas o necessário</h2>
          <p style={styles.sectionText}>
            O objetivo aqui é impedir confusão operacional, proteger clientes,
            evitar exposição indevida e deixar o app preparado para contratos
            reais com empresas e locadoras.
          </p>
        </div>

        <div style={styles.profileGrid}>
          {profileCards.map((profile) => (
            <article key={profile.title} style={styles.profileCard}>
              <div style={styles.profileTop}>
                <div style={styles.profileBadge}>{profile.badge}</div>
                <Link href={profile.href} style={styles.profileLink}>
                  Abrir área
                </Link>
              </div>

              <h3 style={styles.profileTitle}>{profile.title}</h3>
              <p style={styles.profileDescription}>{profile.description}</p>

              <div style={styles.profileColumns}>
                <div style={styles.permissionBlock}>
                  <span style={styles.permissionTitle}>Pode ver</span>
                  <ul style={styles.permissionList}>
                    {profile.canView.map((item) => (
                      <li key={item} style={styles.permissionItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.permissionBlock}>
                  <span style={styles.permissionTitleDanger}>Não pode ver</span>
                  <ul style={styles.permissionList}>
                    {profile.cannotView.map((item) => (
                      <li key={item} style={styles.permissionItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.rulesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>REGRAS ESTRUTURAIS</span>
          <h2 style={styles.sectionTitle}>Base oficial de segurança operacional</h2>
          <p style={styles.sectionText}>
            Estas regras entram no coração do produto e devem guiar telas,
            permissões, banco e relatórios.
          </p>
        </div>

        <div style={styles.rulesGrid}>
          {structuralRules.map((rule) => (
            <article key={rule.title} style={styles.ruleCard}>
              <h3 style={styles.ruleTitle}>{rule.title}</h3>
              <p style={styles.ruleText}>{rule.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.numberingSection}>
        <div style={styles.mainNumberingGrid}>
          <div style={styles.numberingCard}>
            <span style={styles.sectionEyebrow}>OS E OC</span>
            <h2 style={styles.sectionTitle}>Dupla numeração para operação real</h2>
            <p style={styles.sectionText}>
              O sistema terá sua numeração oficial sequencial, enquanto o cliente
              poderá manter suas próprias referências internas sem quebrar o
              controle da administração.
            </p>

            <div style={styles.numberingGrid}>
              {numberingExamples.map((item) => (
                <div key={item.label} style={styles.numberItem}>
                  <span style={styles.numberLabel}>{item.label}</span>
                  <strong style={styles.numberValue}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.suggestionsCard}>
            <div style={styles.robotTag}>SUGESTÃ•ES EXTRAS</div>
            <h2 style={styles.sidebarTitle}>Ajustes que fortalecem muito o app</h2>

            <div style={styles.suggestionList}>
              {suggestions.map((item) => (
                <div key={item} style={styles.suggestionItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={styles.bottomSection}>
        <div style={styles.bottomCard}>
          <div style={styles.bottomTextBlock}>
            <span style={styles.sectionEyebrow}>PRÃ“XIMA ETAPA</span>
            <h2 style={styles.bottomTitle}>
              Depois daqui, a área de motoristas já pode nascer com essas travas
            </h2>
            <p style={styles.bottomText}>
              O próximo arquivo ideal é a página interna dos motoristas no app
              independente, já respeitando visibilidade própria, contato
              autorizado e remoção de serviços pagos da visão do condutor.
            </p>
          </div>

          <div style={styles.bottomActions}>
            <Link href="/servicos" style={styles.primaryButton}>
              Explorar serviços
            </Link>

            <Link href="/financeiro" style={styles.secondaryButton}>
              Explorar financeiro
            </Link>
          </div>
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

  heroTop: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
    gap: 18,
    alignItems: "start",
  },

  heroTextBlock: {
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
    fontSize: "clamp(1.9rem, 3.7vw, 3.8rem)",
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

  heroSideCard: {
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

  sideBadgeList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  sideBadge: {
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

  sectionHeader: {
    maxWidth: 860,
    marginBottom: 22,
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
    fontSize: "clamp(1.7rem, 3vw, 2.7rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  sectionText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 16,
    lineHeight: 1.75,
  },

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  },

  profileCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  profileTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },

  profileBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0e7490",
    fontSize: 12,
    fontWeight: 900,
  },

  profileLink: {
    color: "#0284c7",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
  },

  profileTitle: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 22,
    fontWeight: 900,
  },

  profileDescription: {
    marginTop: 10,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },

  profileColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 18,
  },

  permissionBlock: {
    borderRadius: 18,
    padding: 14,
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  permissionTitle: {
    display: "block",
    color: "#047857",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 10,
  },

  permissionTitleDanger: {
    display: "block",
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 10,
  },

  permissionList: {
    margin: 0,
    paddingLeft: 18,
  },

  permissionItem: {
    marginBottom: 8,
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.6,
  },

  rulesSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "28px 20px 0",
  },

  rulesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 16,
  },

  ruleCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  ruleTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  ruleText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },

  numberingSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "28px 20px 0",
  },

  mainNumberingGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
    gap: 18,
  },

  numberingCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 28,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 22,
    boxShadow: "0 18px 44px rgba(8, 47, 73, 0.05)",
  },

  numberingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginTop: 18,
  },

  numberItem: {
    padding: 16,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  numberLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  numberValue: {
    display: "block",
    marginTop: 8,
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 900,
  },

  suggestionsCard: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 28,
    padding: 22,
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

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#ffffff",
  },

  suggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  suggestionItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.55,
  },

  bottomSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "28px 20px 0",
  },

  bottomCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 28,
    padding: "24px 22px",
    background: "linear-gradient(135deg, #ecfeff 0%, #eff6ff 100%)",
    border: "1px solid rgba(125, 211, 252, 0.24)",
    boxShadow: "0 18px 44px rgba(8, 47, 73, 0.05)",
  },

  bottomTextBlock: {
    maxWidth: 820,
  },

  bottomTitle: {
    margin: 0,
    fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  bottomText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 16,
    lineHeight: 1.75,
  },

  bottomActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
};

