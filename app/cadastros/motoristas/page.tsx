"use client";

import { useState } from "react";

export default function MotoristasPage() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");

  function salvar() {
    alert("Motorista salvo (versão inicial)");
    setNome("");
    setTelefone("");
    setCidade("");
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Cadastrar Motorista</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />

        <button onClick={salvar}>Salvar</button>
      </div>
    </main>
  );
}