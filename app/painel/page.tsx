"use client";

import Link from "next/link";

export default function PainelPage() {
  return (
    <main style={page}>
      <div style={container}>
        {/* ALERTA DO PROJETO */}
        <section style={alertBox}>
          <strong style={{ color: "#b91c1c" }}>
            ⚠️ Regra de ouro do projeto Aurora Motoristas
          </strong>

          <p style={alertText}>
            Não alterar arquivos já em produção. Toda evolução deve ser feita por
            novas páginas, camadas isoladas ou melhorias controladas. Alterações
            diretas só são permitidas para correção de erros críticos.
          </p>
        </section>

        {/* TÍTULO */}
        <section style={hero}>
          <h1 style={title}>Painel de Acessos Aurora Motoristas</h1>
          <p style={subtitle}>
            Central de navegação segura para operação, administração e evolução
            da plataforma sem risco de quebrar o que já está em produção.
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

          <Card title="Novo serviço" desc="Cadastro direto de serviço">
            <Link href="/servicos/novo" style={btnPrimary}>Cadastrar</Link>
          </Card>

          <Card title="Operação" desc="Visão operacional ativa">
            <Link href="/servicos" style={btn}>Abrir</Link>
          </Card>

          <Card title="Admin • Serviços" desc="Controle total da base">
            <Link href="/admin/servicos" style={btn}>Abrir</Link>
          </Card>

          <Card title="Relatórios" desc="Visão financeira estilo Excel">
            <Link href="/relatorios" style={btnPrimary}>Abrir</Link>
          </Card>

          <Card title="Quero ser motorista" desc="Cadastro público de motoristas">
            <Link href="/quero-ser-motorista" style={btn}>Acessar</Link>
          </Card>
        </section>

        {/* FUTURO */}
        <section style={future}>
          <h2 style={{ margin: 0 }}>Expansão planejada</h2>
          <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
            <li>Relatórios diário / semanal / mensal / anual</li>
            <li>Contas a receber integrado</li>
            <li>Contas a pagar integrado</li>
            <li>Mapa de serviços (visual)</li>
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