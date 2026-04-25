"use client";

import { useState } from "react";

export default function CadastroMotoristaPage() {
  const [form, setForm] = useState({
    provider_type: "pessoa_fisica",
    full_name: "",
    cpf: "",
    cnpj: "",
    company_name: "",
    trade_name: "",
    branch_name: "",
    phone: "",
    email: "",
    cep: "",
    address: "",
    address_number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    cnh_number: "",
    pix_type: "cpf",
    pix_key: "",
  });

  const [message, setMessage] = useState("");

  function update(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function buscarCep() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (!cepLimpo) return;

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      setMessage("CEP não encontrado.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      address: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    }));

    setMessage("Endereço preenchido pelo CEP.");
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    setMessage(
      result.ok
        ? "Cadastro enviado para análise. Só poderá receber serviços após aprovação humana."
        : result.message || "Erro ao cadastrar."
    );
  }

  const isPessoaFisica = form.provider_type === "pessoa_fisica";
  const isEmpresa = form.provider_type === "empresa";
  const isFilial = form.provider_type === "filial";

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 1050, margin: "0 auto", background: "white", borderRadius: 24, padding: 24 }}>
        <p style={{ color: "#2563eb", fontWeight: 800 }}>Aurora Motoristas</p>
        <h1>Cadastro de motorista / prestador</h1>
        <p>Todo cadastro fica em análise e depende de aprovação humana.</p>

        <form onSubmit={salvar} style={{ marginTop: 24 }}>
          <div style={grid}>
            <label>
              <span style={label}>Tipo de cadastro</span>
              <select
                value={form.provider_type}
                onChange={(e) => update("provider_type", e.target.value)}
                style={input}
              >
                <option value="pessoa_fisica">Pessoa física / Motorista</option>
                <option value="empresa">Empresa / Prestador</option>
                <option value="filial">Filial</option>
              </select>
            </label>

            {isPessoaFisica && (
              <>
                <Campo label="Nome completo" name="full_name" value={form.full_name} onChange={update} />
                <Campo label="CPF" name="cpf" value={form.cpf} onChange={update} />
                <Campo label="CNH" name="cnh_number" value={form.cnh_number} onChange={update} />
              </>
            )}

            {(isEmpresa || isFilial) && (
              <>
                <Campo label="CNPJ" name="cnpj" value={form.cnpj} onChange={update} />
                <Campo label="Razão social" name="company_name" value={form.company_name} onChange={update} />
                <Campo label="Nome fantasia" name="trade_name" value={form.trade_name} onChange={update} />
              </>
            )}

            {isFilial && (
              <Campo label="Nome da filial" name="branch_name" value={form.branch_name} onChange={update} />
            )}

            <Campo label="Telefone" name="phone" value={form.phone} onChange={update} />
            <Campo label="E-mail" name="email" value={form.email} onChange={update} />

            <label>
              <span style={label}>CEP</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={form.cep} onChange={(e) => update("cep", e.target.value)} style={input} />
                <button type="button" onClick={buscarCep} style={btnSmall}>Buscar CEP</button>
              </div>
            </label>

            <Campo label="Endereço" name="address" value={form.address} onChange={update} />
            <Campo label="Número" name="address_number" value={form.address_number} onChange={update} />
            <Campo label="Bairro" name="neighborhood" value={form.neighborhood} onChange={update} />
            <Campo label="Cidade" name="city" value={form.city} onChange={update} />
            <Campo label="Estado" name="state" value={form.state} onChange={update} />
            <Campo label="Complemento" name="complement" value={form.complement} onChange={update} />

            <label>
              <span style={label}>Tipo de PIX</span>
              <select value={form.pix_type} onChange={(e) => update("pix_type", e.target.value)} style={input}>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="aleatoria">Chave aleatória</option>
              </select>
            </label>

            <Campo label="Chave PIX" name="pix_key" value={form.pix_key} onChange={update} />
          </div>

          <button style={btn} type="submit">Enviar cadastro para análise</button>

          {message && <p style={msg}>{message}</p>}
        </form>
      </section>
    </main>
  );
}

function Campo({ label, name, value, onChange }: any) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      <input value={value} onChange={(e) => onChange(name, e.target.value)} style={input} />
    </label>
  );
}

const grid = { display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" };
const labelStyle = { display: "block", fontSize: 13, color: "#475569", fontWeight: 700, marginBottom: 6 };
const label = labelStyle;
const input = { width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px 14px" };
const btn = { marginTop: 22, border: 0, background: "#2563eb", color: "white", borderRadius: 16, padding: "14px 22px", fontWeight: 900 };
const btnSmall = { border: 0, background: "#0f172a", color: "white", borderRadius: 12, padding: "10px 12px", fontWeight: 800 };
const msg = { marginTop: 16, background: "#dbeafe", padding: 14, borderRadius: 14, fontWeight: 800 };