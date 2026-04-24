"use client";

import Link from "next/link";

export default function PainelPage() {
  return (
    <main style={page}>
      <div style={container}>
        {/* ALERTA DO PROJETO */}
        <section style={alertBox}>
          <strong style={{ color: "#b91c1c" }}>
            âš ï¸ Regra de ouro do projeto Aurora Motoristas
          </strong>

          <p style={alertText}>
            NÃ£o alterar arquivos jÃ¡ em produÃ§Ã£o. Toda evoluÃ§Ã£o deve ser feita por
            novas pÃ¡ginas, camadas isoladas ou melhorias controladas. AlteraÃ§Ãµes
            diretas sÃ³ sÃ£o permitidas para correÃ§Ã£o de erros crÃ­ticos.
          </p>
        </section>

        {/* TÃTULO */}
        <section style={hero}>
          <h1 style={title}>Painel de Acessos Aurora Motoristas</h1>
          <p style={subtitle}>
            Central de navegaÃ§Ã£o segura para operaÃ§Ã£o, administraÃ§Ã£o e evoluÃ§Ã£o
            da plataforma sem risco de quebrar o que jÃ¡ estÃ¡ em produÃ§Ã£o.
          </p>
        </section>

        {/* ACESSOS */}
        <section style={grid}>
          <Card title="Home" desc="Entrada principal da plataforma">
            <Link href="/" style={btn}>Abrir</Link>
          </Card>

          <Card title="Login" desc="Acesso empresarial ao sistema">
            <Link href="/login" style={btn}>Entrar</Link>
          </Card>

          <Card title="Novo serviÃ§o" desc="Cadastro direto de serviÃ§o">
            <Link href="/servicos/novo" style={btnPrimary}>Cadastrar</Link>
          </Card>

          <Card title="OperaÃ§Ã£o" desc="VisÃ£o operacional ativa">
            <Link href="/servicos" style={btn}>Abrir</Link>
          </Card>

          <Card title="Admin â€¢ ServiÃ§os" desc="Controle total da base">
            <Link href="/admin/servicos" style={btn}>Abrir</Link>
          </Card>

          <Card title="RelatÃ³rios" desc="VisÃ£o financeira estilo Excel">
            <Link href="/relatorios" style={btnPrimary}>Abrir</Link>
          </Card>

          <Card title="Quero ser motorista" desc="Cadastro pÃºblico de motoristas">
            <Link href="/quero-ser-motorista" style={btn}>Acessar</Link>
          </Card>
        </section>

        {/* FUTURO */}
        <section style={future}>
          <h2 style={{ margin: 0 }}>ExpansÃ£o planejada</h2>
          <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
            <li>RelatÃ³rios diÃ¡rio / semanal / mensal / anual</li>
            <li>Contas a receber integrado</li>
            <li>Contas a pagar integrado</li>
            <li>Mapa de serviÃ§os (visual)</li>
            <li>Controle por motorista</li>
            <li>Controle por empresa</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div style={card}>
      <strong>{title}</strong>
      <p style={cardText}>{desc}</p>
      <div>{children}</div>
    </div>
  );
}

/* ESTILO */

const page = {
  minHeight: "100vh",
  background: "#f4f8fc",
  padding: 24,
};

const container = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column" as const,
  gap: 20,
};

const alertBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 16,
  padding: 16,
};

const alertText = {
  marginTop: 6,
  color: "#7f1d1d",
  fontSize: 14,
};

const hero = {
  background: "#ffffff",
  borderRadius: 20,
  padding: 20,
  border: "1px solid #e5edf5",
};

const title = {
  margin: 0,
  fontSize: 28,
};

const subtitle = {
  marginTop: 6,
  color: "#64748b",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const card = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 16,
  border: "1px solid #e5edf5",
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
};

const cardText = {
  fontSize: 13,
  color: "#64748b",
};

const btn = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  textDecoration: "none",
  color: "#123047",
  fontWeight: 700,
};

const btnPrimary = {
  ...btn,
  background: "#0ea5e9",
  color: "#fff",
  border: "none",
};

const future = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 16,
  border: "1px solid #e5edf5",
};
