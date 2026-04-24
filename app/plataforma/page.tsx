"use client";

/*
  Regra de ouro do projeto Aurora Motoristas:
  NÃ£o alterar arquivos jÃ¡ em produÃ§Ã£o.
  Toda evoluÃ§Ã£o deve ser feita por novas pÃ¡ginas, camadas isoladas
  ou melhorias controladas.
  AlteraÃ§Ãµes diretas sÃ³ sÃ£o permitidas para correÃ§Ã£o de erros crÃ­ticos.

  Regra estrutural desta camada:
  - Cliente nÃ£o paga para usar a operaÃ§Ã£o.
  - As duas empresas internas operam o sistema.
  - Operadoras externas sÃ³ entram com plano e liberaÃ§Ã£o.
  - Operadoras externas nunca podem acessar a base interna de motoristas.
*/

import Link from "next/link";

export default function PlataformaPage() {
  return (
    <main style={page}>
      <div style={container}>
        <section style={hero}>
          <span style={chip}>Aurora Motoristas â€¢ Plataforma</span>

          <h1 style={title}>Estrutura segura de uso da plataforma</h1>

          <p style={subtitle}>
            Esta Ã¡rea foi criada para organizar a lÃ³gica da plataforma sem mexer
            no que jÃ¡ estÃ¡ no ar. Aqui ficam as regras de separaÃ§Ã£o entre
            clientes, operaÃ§Ã£o interna, operadoras externas e base protegida de
            motoristas.
          </p>

          <div style={heroActions}>
            <Link href="/painel" style={secondaryButton}>
              Voltar ao painel
            </Link>

            <Link href="/plataforma/operadoras" style={primaryButton}>
              Ver operadoras
            </Link>

            <Link href="/plataforma/motoristas" style={secondaryButton}>
              Ver blindagem de motoristas
            </Link>

            <Link href="/plataforma/tutorial" style={secondaryButton}>
              ðŸ“˜ Tutorial / Ajuda
            </Link>
          </div>
        </section>

        <section style={grid}>
          <Card
            title="Clientes"
            text="Empresas clientes contratam o serviÃ§o e nÃ£o pagam para usar a plataforma como operadoras."
          />
          <Card
            title="OperaÃ§Ã£o interna"
            text="As empresas internas usam a plataforma como base principal de atendimento, gestÃ£o e controle."
          />
          <Card
            title="Operadoras externas"
            text="Empresas do mesmo ramo sÃ³ podem usar a plataforma com autorizaÃ§Ã£o, plano ativo e regras prÃ³prias."
          />
          <Card
            title="Base blindada"
            text="A base interna de motoristas permanece protegida e nunca pode ser exposta a operadoras externas."
          />
        </section>

        <section style={rulesBox}>
          <h2 style={sectionTitle}>Regras principais</h2>

          <div style={rulesGrid}>
            <RuleItem
              title="1. Cliente nÃ£o paga"
              text="Cliente entra no fluxo comercial e operacional, mas nÃ£o paga para usar a plataforma como ferramenta de operaÃ§Ã£o."
            />

            <RuleItem
              title="2. Operadoras internas usam normalmente"
              text="As empresas internas usam a plataforma com acesso controlado por papel, empresa e nÃ­vel administrativo."
            />

            <RuleItem
              title="3. Operadora externa sÃ³ entra com plano"
              text="Empresas externas do mesmo segmento sÃ³ podem usar a plataforma mediante aprovaÃ§Ã£o, plano ativo e regras de segregaÃ§Ã£o."
            />

            <RuleItem
              title="4. Base interna de motoristas Ã© intocÃ¡vel"
              text="Nenhuma operadora externa pode visualizar, pesquisar, exportar ou acessar a base de motoristas internos da operaÃ§Ã£o master."
            />

            <RuleItem
              title="5. Cada operadora externa usa a prÃ³pria base"
              text="Se uma operadora externa entrar, ela deve trabalhar apenas com motoristas vinculados Ã  prÃ³pria base dela."
            />

            <RuleItem
              title="6. Admin master vÃª tudo"
              text="A administraÃ§Ã£o master da plataforma pode enxergar a estrutura completa para controle e auditoria."
            />
          </div>
        </section>

        <section style={compareBox}>
          <h2 style={sectionTitle}>SeparaÃ§Ã£o da plataforma</h2>

          <div style={compareGrid}>
            <div style={compareCard}>
              <div style={compareTitle}>Empresa cliente</div>
              <ul style={list}>
                <li>Contrata atendimento</li>
                <li>NÃ£o paga uso da plataforma como operadora</li>
                <li>NÃ£o vÃª admin interno</li>
                <li>NÃ£o vÃª base de motoristas</li>
              </ul>
            </div>

            <div style={compareCard}>
              <div style={compareTitle}>Operadora interna</div>
              <ul style={list}>
                <li>Opera o sistema</li>
                <li>Usa serviÃ§os, admin, relatÃ³rios e controle</li>
                <li>VÃª a prÃ³pria base interna de motoristas</li>
                <li>Pode atuar com lÃ³gica completa da operaÃ§Ã£o</li>
              </ul>
            </div>

            <div style={compareCard}>
              <div style={compareTitle}>Operadora externa</div>
              <ul style={list}>
                <li>SÃ³ entra com aprovaÃ§Ã£o e plano</li>
                <li>Usa apenas a prÃ³pria base</li>
                <li>NÃ£o vÃª motoristas internos da operaÃ§Ã£o master</li>
                <li>NÃ£o vÃª dados estratÃ©gicos da operaÃ§Ã£o principal</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={warningBox}>
          <strong style={{ color: "#9a3412" }}>
            Blindagem comercial e operacional
          </strong>

          <p style={warningText}>
            O uso da plataforma por operadoras externas nÃ£o concede acesso Ã 
            rede interna de motoristas, contatos, documentos, avaliaÃ§Ãµes
            estratÃ©gicas ou qualquer base que permita aproveitamento da rede de
            freelancers da operaÃ§Ã£o principal.
          </p>
        </section>

        <section style={nextBox}>
          <h2 style={sectionTitle}>PrÃ³ximos arquivos desta camada</h2>

          <div style={nextGrid}>
            <Link href="/plataforma/operadoras" style={accessCard}>
              <span style={accessTitle}>Operadoras</span>
              <span style={accessText}>
                Regras de acesso, cobranÃ§a e segregaÃ§Ã£o para empresas externas.
              </span>
            </Link>

            <Link href="/plataforma/motoristas" style={accessCard}>
              <span style={accessTitle}>Blindagem de motoristas</span>
              <span style={accessText}>
                Regras para impedir acesso de terceiros Ã  base interna.
              </span>
            </Link>

            <Link href="/plataforma/tutorial" style={accessCard}>
              <span style={accessTitle}>Tutorial / Ajuda</span>
              <span style={accessText}>
                Guia oficial para entender o sistema, consultar o fluxo e evitar
                dÃºvidas operacionais.
              </span>
            </Link>
          </div>
        </section>

        <section style={footerNote}>
          Sistema em constante atualizaÃ§Ã£o e podem ocorrer instabilidades
          momentÃ¢neas durante melhorias. Esta camada foi criada separadamente
          para evoluir a plataforma sem risco de quebrar a base jÃ¡ publicada.
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={card}>
      <div style={cardTitle}>{title}</div>
      <div style={cardText}>{text}</div>
    </div>
  );
}

function RuleItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={ruleItem}>
      <div style={ruleTitle}>{title}</div>
      <div style={ruleText}>{text}</div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
  padding: "24px 16px 48px",
  fontFamily: "Arial, sans-serif",
  color: "#123047",
};

const container: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const hero: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 28,
  padding: 24,
  border: "1px solid #e7eef6",
  boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const chip: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#e0f2fe",
  color: "#075985",
  borderRadius: 999,
  padding: "7px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 46px)",
  lineHeight: 1.04,
  color: "#0f172a",
};

const subtitle: React.CSSProperties = {
  margin: 0,
  color: "#4b6478",
  fontSize: 15,
  lineHeight: 1.75,
  maxWidth: 980,
};

const heroActions: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const primaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
  boxShadow: "0 12px 24px rgba(14, 165, 233, 0.18)",
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 22,
  padding: 18,
  border: "1px solid #e7eef6",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
};

const cardTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 800,
  color: "#123047",
  marginBottom: 8,
};

const cardText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
};

const rulesBox: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  color: "#0f172a",
};

const rulesGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 12,
};

const ruleItem: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  borderRadius: 16,
  padding: 16,
};

const ruleTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#123047",
  marginBottom: 8,
};

const ruleText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
};

const compareBox: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const compareGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 14,
};

const compareCard: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  borderRadius: 18,
  padding: 18,
};

const compareTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#123047",
  marginBottom: 10,
};

const list: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.8,
};

const warningBox: React.CSSProperties = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 12px 30px rgba(154, 52, 18, 0.06)",
};

const warningText: React.CSSProperties = {
  margin: "8px 0 0 0",
  color: "#9a3412",
  fontSize: 14,
  lineHeight: 1.8,
};

const nextBox: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const nextGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 14,
};

const accessCard: React.CSSProperties = {
  textDecoration: "none",
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  borderRadius: 18,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
};

const accessTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#123047",
};

const accessText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
};

const footerNote: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e7eef6",
  borderRadius: 18,
  padding: 16,
  color: "#4b6478",
  fontSize: 13,
  lineHeight: 1.8,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
};
