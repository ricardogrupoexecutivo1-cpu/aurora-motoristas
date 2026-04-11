"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DriverService = {
  id: string;
  osSistema: string;
  osCliente: string;
  cliente: string;
  empresa: string;
  rota: string;
  tipo: string;
  status:
    | "Em cotação"
    | "Confirmado"
    | "Em andamento"
    | "Aguardando pagamento"
    | "Pago"
    | "Cancelado";
  data: string;
  contatoAutorizado: boolean;
  telefoneCliente: string;
  valorMotorista: string;
  observacao: string;
};

const driverProfile = {
  nome: "Carlos Henrique Almeida",
  codigo: "MOT-0001",
  cidade: "Belo Horizonte - MG",
  cnh: "Categoria B",
  status: "Ativo",
  disponibilidade: "Disponível",
  empresa: "Aurora Locadoras Premium",
  telefone: "(31) 99888-1101",
  email: "carlos.henrique@aurora.local",
};

const services: DriverService[] = [
  {
    id: "SER-0001",
    osSistema: "OS-2026-000145",
    osCliente: "OS-CLI-4511",
    cliente: "Cliente Executivo BH",
    empresa: "Aurora Locadoras Premium",
    rota: "Belo Horizonte x Confins",
    tipo: "Transfer executivo",
    status: "Confirmado",
    data: "10/04/2026",
    contatoAutorizado: true,
    telefoneCliente: "(31) 97777-1000",
    valorMotorista: "R$ 350,00",
    observacao: "Chegar 20 minutos antes no ponto combinado.",
  },
  {
    id: "SER-0002",
    osSistema: "OS-2026-000146",
    osCliente: "OS-CLI-4512",
    cliente: "Operação Eventos SP",
    empresa: "Aurora Locadoras Premium",
    rota: "Belo Horizonte x São Paulo",
    tipo: "Viagem por KM",
    status: "Em andamento",
    data: "10/04/2026",
    contatoAutorizado: false,
    telefoneCliente: "(11) 98888-7700",
    valorMotorista: "R$ 480,00",
    observacao: "Contato do cliente bloqueado; comunicação via empresa.",
  },
  {
    id: "SER-0003",
    osSistema: "OS-2026-000147",
    osCliente: "OS-CLI-4513",
    cliente: "Contrato Corporativo Nacional",
    empresa: "Aurora Locadoras Premium",
    rota: "Contagem x Savassi",
    tipo: "Diária corporativa",
    status: "Aguardando pagamento",
    data: "09/04/2026",
    contatoAutorizado: true,
    telefoneCliente: "(31) 96666-4400",
    valorMotorista: "R$ 420,00",
    observacao:
      "Serviço concluído. Aguardando baixa para sair da visão do motorista.",
  },
  {
    id: "SER-0004",
    osSistema: "OS-2026-000148",
    osCliente: "OS-CLI-4514",
    cliente: "Cliente Premium Sul",
    empresa: "Aurora Locadoras Premium",
    rota: "Belo Horizonte x Ouro Preto",
    tipo: "Fechado",
    status: "Pago",
    data: "08/04/2026",
    contatoAutorizado: true,
    telefoneCliente: "(31) 95555-3300",
    valorMotorista: "R$ 390,00",
    observacao:
      "Este serviço não deve aparecer na visão do motorista após a baixa.",
  },
];

const ruleCards = [
  {
    title: "Serviço pago sai da visão",
    text: "Depois da baixa, o motorista não vê mais o serviço. O registro segue apenas no histórico interno protegido da administração.",
  },
  {
    title: "Contato do cliente só quando autorizado",
    text: "O telefone do cliente só aparece quando a locadora ou empresa liberar o contato naquele serviço específico.",
  },
  {
    title: "Sem financeiro completo",
    text: "Motorista não tem acesso à margem, custos internos, relatório completo ou dados financeiros detalhados da empresa.",
  },
  {
    title: "Visão operacional própria",
    text: "A área do motorista é focada em execução, status, instruções e pagamentos visíveis até o recebimento.",
  },
];

function getStatusStyle(status: DriverService["status"]): React.CSSProperties {
  if (status === "Em andamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (status === "Confirmado") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  if (status === "Aguardando pagamento") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  if (status === "Pago") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
      color: "#475569",
      border: "1px solid rgba(148, 163, 184, 0.22)",
    };
}

export default function MotoristasCadastroPage() {
  const [search, setSearch] = useState("");

  const visibleServices = useMemo(() => {
    return services
      .filter((item) => item.status !== "Pago")
      .filter((item) => {
        const target = [
          item.id,
          item.osSistema,
          item.osCliente,
          item.cliente,
          item.empresa,
          item.rota,
          item.tipo,
          item.status,
        ]
          .join(" ")
          .toLowerCase();

        return target.includes(search.toLowerCase());
      });
  }, [search]);

  const stats = useMemo(() => {
    return {
      ativos: visibleServices.length,
      andamento: visibleServices.filter((item) => item.status === "Em andamento").length,
      aguardandoPagamento: visibleServices.filter(
        (item) => item.status === "Aguardando pagamento"
      ).length,
      contatoLiberado: visibleServices.filter((item) => item.contatoAutorizado).length,
    };
  }, [visibleServices]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • ÁREA DO MOTORISTA</div>
              <h1 style={styles.heroTitle}>
                Visão operacional limpa, protegida e focada apenas no que é do motorista
              </h1>
              <p style={styles.heroText}>
                Esta área foi desenhada para mostrar ao motorista apenas seus dados,
                seus serviços ativos, instruções necessárias, contato autorizado e
                pagamentos visíveis até a baixa. Nada de mistura com financeiro
                completo ou base geral de clientes.
              </p>

              <div style={styles.heroActions}>
                <Link href="/cadastros" style={styles.secondaryButton}>
                  Voltar para cadastros
                </Link>

                <Link href="/servicos" style={styles.primaryButton}>
                  Ir para serviços
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>REGRA DE OURO</span>
              <h2 style={styles.sideTitle}>Depois de pago, some da visão do motorista</h2>
              <p style={styles.sideText}>
                O serviço pode aparecer até o recebimento. Após a baixa, ele sai
                da área do motorista e permanece apenas em histórico interno
                protegido para administradores e autorizados.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Sem passivo visual indevido</div>
                <div style={styles.sidePill}>Histórico protegido</div>
                <div style={styles.sidePill}>Operação mais segura</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. A visibilidade do motorista está
            sendo estruturada para mostrar somente o necessário e evitar mistura
            com dados sensíveis de clientes e da empresa.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Serviços visíveis</span>
            <strong style={styles.statValue}>{stats.ativos}</strong>
            <span style={styles.statDetail}>Sem incluir serviços já pagos</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Em andamento</span>
            <strong style={styles.statValue}>{stats.andamento}</strong>
            <span style={styles.statDetail}>Execução ativa</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aguardando pagamento</span>
            <strong style={styles.statValue}>{stats.aguardandoPagamento}</strong>
            <span style={styles.statDetail}>Visíveis até a baixa</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Contato liberado</span>
            <strong style={styles.statValue}>{stats.contatoLiberado}</strong>
            <span style={styles.statDetail}>Somente por autorização</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.profileCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>PERFIL DO MOTORISTA</span>
                  <h2 style={styles.sectionTitle}>Dados próprios visíveis</h2>
                </div>
              </div>

              <div style={styles.profileGrid}>
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Nome</span>
                  <strong style={styles.dataValue}>{driverProfile.nome}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Código</span>
                  <strong style={styles.dataValue}>{driverProfile.codigo}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Cidade</span>
                  <strong style={styles.dataValue}>{driverProfile.cidade}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>CNH</span>
                  <strong style={styles.dataValue}>{driverProfile.cnh}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Status</span>
                  <strong style={styles.dataValue}>{driverProfile.status}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Disponibilidade</span>
                  <strong style={styles.dataValue}>{driverProfile.disponibilidade}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Empresa</span>
                  <strong style={styles.dataValue}>{driverProfile.empresa}</strong>
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Telefone</span>
                  <strong style={styles.dataValue}>{driverProfile.telefone}</strong>
                </div>

                <div style={styles.dataItemWide}>
                  <span style={styles.dataLabel}>E-mail</span>
                  <strong style={styles.dataValue}>{driverProfile.email}</strong>
                </div>
              </div>
            </div>

            <div style={styles.servicesCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>SERVIÇOS VISÍVEIS</span>
                  <h2 style={styles.sectionTitle}>Somente serviços em aberto</h2>
                </div>

                <div style={styles.searchBox}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por OS, cliente, rota ou status"
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.serviceList}>
                {visibleServices.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum serviço em aberto encontrado para este filtro.
                  </div>
                ) : (
                  visibleServices.map((service) => (
                    <article key={service.id} style={styles.serviceCard}>
                      <div style={styles.serviceTop}>
                        <div>
                          <h3 style={styles.serviceTitle}>{service.rota}</h3>
                          <p style={styles.serviceSubline}>
                            {service.id} • {service.tipo} • {service.data}
                          </p>
                        </div>

                        <div style={styles.serviceTopRight}>
                          <strong style={styles.serviceValue}>{service.valorMotorista}</strong>
                          <span style={{ ...styles.badge, ...getStatusStyle(service.status) }}>
                            {service.status}
                          </span>
                        </div>
                      </div>

                      <div style={styles.serviceGrid}>
                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OS sistema</span>
                          <strong style={styles.dataValue}>{service.osSistema}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OS cliente</span>
                          <strong style={styles.dataValue}>{service.osCliente}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Cliente</span>
                          <strong style={styles.dataValue}>{service.cliente}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Empresa</span>
                          <strong style={styles.dataValue}>{service.empresa}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Contato liberado</span>
                          <strong style={styles.dataValue}>
                            {service.contatoAutorizado ? "Sim" : "Não"}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Telefone do cliente</span>
                          <strong style={styles.dataValue}>
                            {service.contatoAutorizado
                              ? service.telefoneCliente
                              : "Bloqueado pela empresa/locadora"}
                          </strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação operacional</span>
                          <strong style={styles.dataValue}>{service.observacao}</strong>
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
              <span style={styles.sectionEyebrow}>TRAVAS OFICIAIS</span>
              <h2 style={styles.sidebarTitle}>Regras da visão do motorista</h2>

              <div style={styles.ruleList}>
                {ruleCards.map((item) => (
                  <div key={item.title} style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>{item.title}</strong>
                    <span style={styles.ruleItemText}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio ao motorista</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora pode orientar sobre status do serviço, horário,
                ponto de atendimento, necessidade de contato liberado e próximos
                passos operacionais sem expor dados indevidos.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler instruções do serviço</div>
                <div style={styles.robotItem}>Confirmar andamento</div>
                <div style={styles.robotItem}>Avisar mudança de status</div>
                <div style={styles.robotItem}>Bloquear dados não autorizados</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/cadastros" style={styles.navItem}>
                  Voltar para cadastros
                </Link>
                <Link href="/servicos" style={styles.navItem}>
                  Abrir serviços
                </Link>
                <Link href="/financeiro" style={styles.navItem}>
                  Abrir financeiro
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

  profileCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  servicesCard: {
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
    minWidth: 280,
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

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },

  serviceList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  serviceCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  serviceTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  serviceTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  serviceSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  serviceTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  serviceValue: {
    fontSize: 22,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
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

  serviceGrid: {
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