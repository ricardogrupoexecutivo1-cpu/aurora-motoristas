export default function GuiaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* HEADER */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
          }}
        >
          <span
            style={{
              background: "#e0f2fe",
              color: "#075985",
              padding: "6px 12px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Guia oficial
          </span>

          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: 32,
              color: "#0f172a",
            }}
          >
            Guia completo • Aurora Motoristas
          </h1>

          <p style={{ color: "#4b6478", lineHeight: 1.7 }}>
            Sistema profissional para gestão de motoristas, empresas, clientes,
            serviços e operação completa. Este guia mostra o fluxo correto de uso.
          </p>
        </section>

        {/* FLUXO */}
        <section style={card}>
          <h2 style={title}>Ordem correta de uso</h2>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Cadastrar empresa",
              "Cadastrar cliente",
              "Cadastrar motorista",
              "Criar serviço",
              "Realizar pagamento",
              "Consultar histórico",
            ].map((item, i) => (
              <div key={i} style={step}>
                {i + 1}. {item}
              </div>
            ))}
          </div>
        </section>

        {/* MODULOS */}
        <section style={card}>
          <h2 style={title}>Módulos do sistema</h2>

          <div style={grid}>
            <Box title="Empresas" text="Base empresarial da operação." />
            <Box title="Clientes" text="Controle dos clientes atendidos." />
            <Box title="Motoristas" text="Base operacional dos motoristas." />
            <Box title="Serviços" text="Coração da operação." />
            <Box title="Financeiro" text="Controle de valores e resultados." />
          </div>
        </section>

        {/* REGRAS */}
        <section style={card}>
          <h2 style={title}>Regras importantes</h2>

          <ul style={{ lineHeight: 2 }}>
            <li>Serviços pagos saem da visão ativa</li>
            <li>Motoristas não veem financeiro completo</li>
            <li>Histórico é preservado para controle interno</li>
          </ul>
        </section>

        {/* AVISO */}
        <section style={card}>
          <h2 style={title}>Observação</h2>

          <p style={{ color: "#4b6478", lineHeight: 1.7 }}>
            Sistema em constante atualização e podem ocorrer melhorias contínuas
            durante o uso.
          </p>
        </section>
      </div>
    </main>
  );
}

/* COMPONENTES */

function Box({ title, text }: any) {
  return (
    <div
      style={{
        background: "#f8fbff",
        border: "1px solid #e5edf5",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <strong>{title}</strong>
      <p style={{ marginTop: 6, color: "#4b6478" }}>{text}</p>
    </div>
  );
}

/* ESTILOS */

const card = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 20,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
};

const title = {
  marginBottom: 12,
  fontSize: 22,
  color: "#0f172a",
};

const step = {
  background: "#f1f5f9",
  padding: "12px 16px",
  borderRadius: 12,
  fontWeight: 700,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};