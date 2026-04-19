"use client";

import Link from "next/link";

export default function HomePage() {
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
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                background: "#e0f2fe",
                color: "#075985",
                borderRadius: 999,
                padding: "7px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Aurora Motoristas
            </span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Link href="/login" style={secondaryButton}>
                Entrar
              </Link>

              <Link href="/servicos/novo" style={primaryButton}>
                Novo serviço
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 54px)",
                  lineHeight: 1.02,
                  color: "#0f172a",
                  wordBreak: "break-word",
                }}
              >
                Plataforma premium para operação, cadastro e gestão de motoristas
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#4b6478",
                  fontSize: 16,
                  lineHeight: 1.8,
                  maxWidth: 760,
                }}
              >
                Cadastre serviços, acompanhe a operação, organize motoristas e
                preserve o controle interno com separação clara entre visão
                operacional, histórico protegido e área administrativa.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <span style={miniChip}>Cadastro rápido</span>
                <span style={miniChip}>Uso em celular e PC</span>
                <span style={miniChip}>Operação protegida</span>
                <span style={miniChip}>Blindagem administrativa</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <Link href="/login" style={primaryButtonLarge}>
                  Entrar no sistema
                </Link>

                <Link href="/servicos/novo" style={secondaryButtonLarge}>
                  Cadastrar novo serviço
                </Link>

                <Link href="/cadastros/clientes" style={secondaryButtonLarge}>
                  Cadastrar cliente
                </Link>

                <Link href="/motoristas/cadastrar" style={secondaryButtonLarge}>
                  Quero ser motorista
                </Link>
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)",
                border: "1px solid #dbeafe",
                borderRadius: 24,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow: "0 18px 40px rgba(37, 99, 235, 0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Entrada clara do sistema
              </div>

              <div
                style={{
                  color: "#4b6478",
                  fontSize: 14,
                  lineHeight: 1.75,
                }}
              >
                Esta é a porta de entrada do Aurora Motoristas. A navegação foi
                separada para não jogar o usuário direto na operação interna sem
                contexto.
              </div>

              <div style={infoCard}>
                <div style={infoTitle}>Empresas e operação</div>
                <div style={infoText}>
                  Entram pelo sistema, fazem login e seguem para cadastro e
                  lançamento de serviços.
                </div>
              </div>

              <div style={infoCard}>
                <div style={infoTitle}>Clientes</div>
                <div style={infoText}>
                  Devem ser cadastrados antes dos serviços para manter a base
                  organizada e evitar lançamento sem vínculo correto.
                </div>
              </div>

              <div style={infoCard}>
                <div style={infoTitle}>Motoristas</div>
                <div style={infoText}>
                  Têm rota própria de cadastro, sem misturar com a área
                  administrativa da operação.
                </div>
              </div>

              <div style={infoCard}>
                <div style={infoTitle}>Blindagem</div>
                <div style={infoText}>
                  Motorista sem admin, cliente sem admin e controle interno
                  preservado para a empresa.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 14,
          }}
        >
          <FeatureCard
            title="Entrar"
            text="Acesso com e-mail e senha para operação empresarial e continuidade do uso."
          />
          <FeatureCard
            title="Clientes"
            text="Cadastre a base de clientes antes de criar novos serviços."
          />
          <FeatureCard
            title="Motoristas"
            text="Página própria para captação e cadastro de motoristas."
          />
          <FeatureCard
            title="Admin protegido"
            text="Controle interno separado da visão operacional e do público."
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Acessos principais
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <Link href="/login" style={accessCard}>
              <span style={accessTitle}>Entrar no sistema</span>
              <span style={accessText}>
                Login empresarial para continuar a operação.
              </span>
            </Link>

            <Link href="/cadastros/clientes" style={accessCard}>
              <span style={accessTitle}>Cadastrar cliente</span>
              <span style={accessText}>
                Abrir o cadastro de clientes para vincular corretamente os serviços.
              </span>
            </Link>

            <Link href="/servicos/novo" style={accessCard}>
              <span style={accessTitle}>Cadastrar serviço</span>
              <span style={accessText}>
                Abrir o formulário de novo serviço.
              </span>
            </Link>

            <Link href="/motoristas/cadastrar" style={accessCard}>
              <span style={accessTitle}>Quero ser motorista</span>
              <span style={accessText}>
                Ir para a área própria de cadastro de motorista.
              </span>
            </Link>

            <Link href="/plataforma/motoristas/painel" style={accessCard}>
              <span style={accessTitle}>Painel de motoristas</span>
              <span style={accessText}>
                Revisar a base e preparar a futura autorização dos motoristas cadastrados.
              </span>
            </Link>

            <Link href="/plataforma/ajuda" style={accessCard}>
              <span style={accessTitle}>Tutorial Aurora Motoristas</span>
              <span style={accessText}>
                Abrir a central oficial com tutorial interno, PDFs e materiais
                de apoio.
              </span>
            </Link>
          </div>
        </section>

        <section
          style={{
            borderRadius: 22,
            background: "#f8fbff",
            border: "1px solid #e5edf5",
            padding: 18,
            color: "#435b6e",
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          Sistema em constante atualização e podem ocorrer instabilidades
          momentâneas durante melhorias. Esta home foi organizada para servir
          como entrada correta da plataforma, sem misturar o público com a área
          operacional interna.
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 22,
        padding: 18,
        border: "1px solid #e7eef6",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: "#123047",
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

const infoCard: React.CSSProperties = {
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #dbeafe",
  padding: 14,
};

const infoTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#123047",
  marginBottom: 6,
};

const infoText: React.CSSProperties = {
  color: "#4b6478",
  fontSize: 13,
  lineHeight: 1.7,
};

const miniChip: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const primaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
  boxShadow: "0 12px 30px rgba(14, 165, 233, 0.18)",
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
};

const primaryButtonLarge: React.CSSProperties = {
  ...primaryButton,
  padding: "14px 18px",
};

const secondaryButtonLarge: React.CSSProperties = {
  ...secondaryButton,
  padding: "14px 18px",
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
  minWidth: 0,
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