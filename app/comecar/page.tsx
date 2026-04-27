"use client";

import Link from "next/link";

export default function Comecar() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: 30
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>
          Escolha como você quer usar a Aurora
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: 30 }}>
          A Aurora possui dois fluxos principais. Escolha o caminho correto para evitar erros e começar mais rápido.
        </p>

        <div style={{
          display: "grid",
          gap: 20
        }}>

          {/* OPERAÇÕES */}
          <Link href="/empresas/cadastrar">
            <div style={card("#22c55e")}>
              <h2 style={titulo}>Aurora Operações</h2>
              <p style={texto}>
                Para locadoras, empresas, mobilização, desmobilização, transfer e serviços com motorista.
              </p>
              <span style={botao}>Entrar como empresa / locadora</span>
            </div>
          </Link>

          {/* DELIVERY */}
          <Link href="/solicitar">
            <div style={card("#0ea5e9")}>
              <h2 style={titulo}>Aurora Express</h2>
              <p style={texto}>
                Para entregas, coletas, documentos, pacotes, moto, carro, van e caminhão.
              </p>
              <span style={botao}>Fazer envio / entrega</span>
            </div>
          </Link>

          {/* MOTORISTA */}
          <Link href="/motoristas/cadastro">
            <div style={card("#f59e0b")}>
              <h2 style={titulo}>Motorista Operacional</h2>
              <p style={texto}>
                Para motoristas que querem atender locadoras, empresas, mobilização e operações Aurora.
              </p>
              <span style={botao}>Cadastrar como motorista</span>
            </div>
          </Link>

          {/* LOGIN */}
          <Link href="/entrar">
            <div style={card("#8b5cf6")}>
              <h2 style={titulo}>Já tenho acesso</h2>
              <p style={texto}>
                Entrar no painel seguro da plataforma.
              </p>
              <span style={botao}>Acessar plataforma</span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}

const card = (cor: string) => ({
  background: cor,
  padding: 24,
  borderRadius: 16,
  cursor: "pointer"
});

const titulo = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 10
};

const texto = {
  opacity: 0.9,
  marginBottom: 15
};

const botao = {
  fontWeight: 900
};
