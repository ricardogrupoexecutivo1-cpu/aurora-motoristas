"use client";

/*
  Regra de ouro do projeto Aurora Motoristas:
  Não alterar arquivos já em produção.
  Toda evolução deve ser feita por novas páginas, camadas isoladas
  ou melhorias controladas.
  Alterações diretas só são permitidas para correção de erros críticos.

  Regras desta página:
  - Clientes não pagam para usar a plataforma como operadoras.
  - Operadoras internas usam a plataforma como base oficial.
  - Operadoras externas só entram com autorização e plano ativo.
  - Operadoras externas nunca acessam a base interna de motoristas.
*/

import Link from "next/link";

export default function PlataformaOperadorasPage() {
  return (
    <main style={page}>
      <div style={container}>
        <section style={hero}>
          <span style={chip}>Aurora Motoristas â€¢ Operadoras</span>

          <h1 style={title}>
            Regras de acesso para operadoras internas e externas
          </h1>

          <p style={subtitle}>
            Esta página organiza a lógica de uso da plataforma por empresas do
            mesmo segmento, separando operação interna, operação externa,
            cobrança, liberação e blindagem da base interna de motoristas.
          </p>

          <div style={heroActions}>
            <Link href="/plataforma" style={secondaryButton}>
              Voltar para Plataforma
            </Link>

            <Link href="/plataforma/motoristas" style={primaryButton}>
              Blindagem de motoristas
            </Link>
          </div>
        </section>

        <section style={grid}>
          <Card
            title="Operadora interna"
            text="Empresa da própria estrutura principal, com acesso operacional controlado e uso oficial da plataforma."
          />
          <Card
            title="Operadora externa"
            text="Empresa do mesmo ramo que pode usar a plataforma apenas com autorização formal, plano ativo e limites bem definidos."
          />
          <Card
            title="Cliente"
            text="Empresa atendida pela operação. Não paga pelo uso da plataforma como ferramenta operacional."
          />
          <Card
            title="Base blindada"
            text="A base interna de motoristas permanece exclusiva da operação principal e nunca pode ser exposta a terceiros."
          />
        </section>

        <section style={compareBox}>
          <h2 style={sectionTitle}>Comparativo de acesso</h2>

          <div style={compareGrid}>
            <div style={compareCard}>
              <div style={compareTitle}>Operadora interna</div>
              <ul style={list}>
                <li>Usa a plataforma como base oficial</li>
                <li>Opera serviços e relatórios internos</li>
                <li>Enxerga a própria estrutura autorizada</li>
                <li>Pode usar administração conforme papel</li>
                <li>Tem vínculo direto com a operação principal</li>
              </ul>
            </div>

            <div style={compareCard}>
              <div style={compareTitle}>Operadora externa</div>
              <ul style={list}>
                <li>Só entra com aprovação</li>
                <li>Precisa de plano ativo</li>
                <li>Usa somente a própria base</li>
                <li>Não enxerga motoristas internos da operação master</li>
                <li>Não acessa dados estratégicos da concorrência</li>
              </ul>
            </div>

            <div style={compareCard}>
              <div style={compareTitle}>Cliente</div>
              <ul style={list}>
                <li>Não usa a plataforma como operadora</li>
                <li>Não paga para operar o sistema</li>
                <li>Fica no fluxo comercial e operacional atendido</li>
                <li>Não vê admin interno</li>
                <li>Não vê base de motoristas</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={rulesBox}>
          <h2 style={sectionTitle}>Regras principais para operadoras externas</h2>

          <div style={rulesGrid}>
            <RuleItem
              title="1. Entrada somente com autorização"
              text="Nenhuma operadora externa deve entrar livremente. O uso da plataforma depende de aprovação da administração principal."
            />

            <RuleItem
              title="2. Plano obrigatório"
              text="Se a empresa externa quiser usar a plataforma como ferramenta operacional, o acesso deve depender de plano ativo."
            />

            <RuleItem
              title="3. Uso limitado Ã  própria base"
              text="A operadora externa só pode visualizar, cadastrar e operar serviços vinculados Ã  própria estrutura e Ã  própria base de motoristas."
            />

            <RuleItem
              title="4. Proibição absoluta de acesso Ã  base interna"
              text="A base de motoristas internos da operação principal não pode ser pesquisada, exportada, listada ou sugerida para operadoras externas."
            />

            <RuleItem
              title="5. Sem acesso Ã  inteligência comercial"
              text="Operadora externa não deve acessar relatórios estratégicos, margens consolidadas globais, bases internas ou visão total da operação master."
            />

            <RuleItem
              title="6. Cada empresa vê apenas o que é dela"
              text="A plataforma deve manter segregação rígida por empresa, com visão isolada de dados, serviços, relatórios e cadastros."
            />
          </div>
        </section>

        <section style={billingBox}>
          <h2 style={sectionTitle}>Lógica de cobrança</h2>

          <div style={billingGrid}>
            <BillingCard
              title="Cliente"
              destaque="Não paga"
              text="Cliente não paga para usar a plataforma como operadora. Ele entra como empresa atendida."
            />

            <BillingCard
              title="Operadora interna"
              destaque="Uso oficial"
              text="As empresas da estrutura principal usam a plataforma como base operacional oficial da operação."
            />

            <BillingCard
              title="Operadora externa"
              destaque="Plano obrigatório"
              text="Empresas externas do mesmo segmento só podem operar na plataforma mediante plano ativo e liberação."
            />
          </div>
        </section>

        <section style={warningBox}>
          <strong style={{ color: "#9a3412" }}>
            Proteção contra aproveitamento da rede interna
          </strong>

          <p style={warningText}>
            O uso da plataforma por operadoras externas não concede acesso Ã 
            rede interna de freelancers, motoristas, documentos, contatos,
            avaliações, histórico ou qualquer base que permita aproveitamento da
            estrutura da operação principal.
          </p>
        </section>

        <section style={flowBox}>
          <h2 style={sectionTitle}>Fluxo recomendado</h2>

          <div style={flowGrid}>
            <FlowStep
              numero="01"
              titulo="Identificar o tipo da empresa"
              texto="Separar cliente, operadora interna e operadora externa."
            />
            <FlowStep
              numero="02"
              titulo="Validar autorização"
              texto="Somente empresas externas aprovadas podem seguir para uso operacional."
            />
            <FlowStep
              numero="03"
              titulo="Checar plano"
              texto="Operadora externa só usa a plataforma com plano ativo."
            />
            <FlowStep
              numero="04"
              titulo="Isolar a base"
              texto="Cada operadora trabalha apenas com a própria base e nunca com a base interna master."
            />
          </div>
        </section>

        <section style={nextBox}>
          <h2 style={sectionTitle}>Próximo módulo</h2>

          <div style={nextGrid}>
            <Link href="/plataforma/motoristas" style={accessCard}>
              <span style={accessTitle}>Blindagem de motoristas</span>
              <span style={accessText}>
                Regras específicas para proteger sua base de freelancers e evitar
                captação por outras operadoras.
              </span>
            </Link>
          </div>
        </section>

        <section style={footerNote}>
          Sistema em constante atualização e podem ocorrer instabilidades
          momentÃ¢neas durante melhorias. Esta página foi criada como camada nova
          e isolada para evoluir a governança da plataforma sem tocar na base já
          publicada.
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

function BillingCard({
  title,
  destaque,
  text,
}: {
  title: string;
  destaque: string;
  text: string;
}) {
  return (
    <div style={billingCard}>
      <div style={billingTitle}>{title}</div>
      <div style={billingBadge}>{destaque}</div>
      <div style={billingText}>{text}</div>
    </div>
  );
}

function FlowStep({
  numero,
  titulo,
  texto,
}: {
  numero: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div style={flowCard}>
      <div style={flowNumber}>{numero}</div>
      <div style={flowTitle}>{titulo}</div>
      <div style={flowText}>{texto}</div>
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

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  color: "#0f172a",
};

const compareGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const compareCard: React.CSSProperties = {
  background: "#fcfdff",
  border: "1px solid #e7eef6",
  borderRadius: 18,
  padding: 16,
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

const billingBox: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const billingGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const billingCard: React.CSSProperties = {
  background: "#fcfdff",
  border: "1px solid #e7eef6",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const billingTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#123047",
};

const billingBadge: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 800,
};

const billingText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
};

const warningBox: React.CSSProperties = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: 20,
  padding: 18,
};

const warningText: React.CSSProperties = {
  margin: "8px 0 0 0",
  color: "#7c2d12",
  fontSize: 14,
  lineHeight: 1.75,
};

const flowBox: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const flowGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const flowCard: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  borderRadius: 16,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const flowNumber: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#0ea5e9",
};

const flowTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#123047",
};

const flowText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 14,
  lineHeight: 1.7,
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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const accessCard: React.CSSProperties = {
  textDecoration: "none",
  background: "#fcfdff",
  border: "1px solid #e7eef6",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const accessTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#123047",
};

const accessText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 13,
  lineHeight: 1.65,
};

const footerNote: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  borderRadius: 16,
  padding: 16,
  color: "#435b6e",
  fontSize: 13,
  lineHeight: 1.75,
};

