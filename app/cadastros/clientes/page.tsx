export default function ClientesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1d4ed8",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            AURORA MOTORISTAS • CLIENTES
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Cadastro de clientes
          </h1>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#334155",
              maxWidth: 760,
            }}
          >
            Área inicial do módulo de clientes do Aurora Motoristas. Esta página
            foi recriada para estabilizar o build em produção. Sistema em
            constante atualização e pode haver momentos de instabilidade durante
            melhorias.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: 18,
                color: "#0f172a",
              }}
            >
              Base comercial
            </h2>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              Organize clientes corporativos, contatos, origem do atendimento e
              histórico de relacionamento.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: 18,
                color: "#0f172a",
              }}
            >
              Próxima evolução
            </h2>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              Depois da estabilização do deploy, nós dois ligamos esta tela no
              Supabase com cadastro real, edição, filtros e integração com CPF
              ou CNPJ.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: 18,
                color: "#0f172a",
              }}
            >
              Status atual
            </h2>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              Página válida, exportada corretamente e pronta para passar no type
              check da Vercel.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}