import Link from "next/link";

export default function AcessoNegadoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          background: "#ffffff",
          borderRadius: 28,
          padding: 28,
          border: "1px solid #e7eef6",
          boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            width: "fit-content",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 999,
            padding: "7px 12px",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Acesso restrito
        </span>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.05,
            color: "#0f172a",
          }}
        >
          Você não tem permissão para acessar esta área
        </h1>

        <p
          style={{
            margin: 0,
            color: "#496276",
            fontSize: 16,
            lineHeight: 1.8,
          }}
        >
          Esta área está protegida por perfil de acesso. Isso ajuda a manter a
          operação organizada, proteger o financeiro e evitar exposição de dados
          que não fazem parte da rotina do seu usuário.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <InfoCard
            title="Operacional"
            text="Foco em cadastros, serviços, operação e acompanhamento do fluxo."
          />
          <InfoCard
            title="Financeiro"
            text="Acesso específico para pagamentos, valores, margens e relatórios financeiros."
          />
          <InfoCard
            title="Administração"
            text="Controle mais amplo do sistema, permissões e organização da base."
          />
        </div>

        <div
          style={{
            borderRadius: 18,
            background: "#f8fbff",
            border: "1px solid #e5edf5",
            padding: 16,
            color: "#435b6e",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#123047" }}>Orientação:</strong> se você
          precisa acessar esta área, solicite liberação ao administrador do
          sistema.
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Link href="/" style={primaryLink}>
            Voltar para a home
          </Link>

          <Link href="/servicos" style={secondaryLink}>
            Ir para operação
          </Link>

          <Link href="/guia" style={secondaryLink}>
            Ver guia completo
          </Link>
        </div>

        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 700,
            paddingTop: 4,
          }}
        >
          Sistema em constante atualização â€¢ podem ocorrer instabilidades
          momentÃ¢neas durante melhorias.
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#fcfdff",
        border: "1px solid #e7eef6",
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#4b6478",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const primaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
};

const secondaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
};

