"use client";

import { useState } from "react";

type FormMotorista = {
  nome: string;
  cpf: string;
  cnh: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
  pix_type: string;
  pix_key: string;
};

const estadoInicial: FormMotorista = {
  nome: "",
  cpf: "",
  cnh: "",
  telefone: "",
  email: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",
  pix_type: "CPF",
  pix_key: "",
};

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function cpfValido(cpf: string) {
  const limpo = somenteNumeros(cpf);
  if (limpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(limpo[i]) * (10 - i);
  let digito1 = 11 - (soma % 11);
  if (digito1 >= 10) digito1 = 0;
  if (digito1 !== Number(limpo[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(limpo[i]) * (11 - i);
  let digito2 = 11 - (soma % 11);
  if (digito2 >= 10) digito2 = 0;

  return digito2 === Number(limpo[10]);
}

export default function CadastroMotoristaPrestadorPage() {
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<FormMotorista>(estadoInicial);

  function setCampo(nome: keyof FormMotorista, valor: string) {
    setForm((atual) => ({ ...atual, [nome]: valor }));
  }

  async function buscarCep() {
    const cepLimpo = somenteNumeros(form.cep);

    if (cepLimpo.length !== 8) {
      setMsg("Informe um CEP válido com 8 números.");
      return;
    }

    setBuscandoCep(true);
    setMsg("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data?.erro) throw new Error("CEP não encontrado.");

      setForm((atual) => ({
        ...atual,
        cep: cepLimpo,
        endereco: data.logradouro || atual.endereco,
        bairro: data.bairro || atual.bairro,
        cidade: data.localidade || atual.cidade,
        estado: data.uf || atual.estado,
      }));

      setMsg("CEP localizado. Confira o número e complemento.");
    } catch (error: any) {
      setMsg(error.message || "Erro ao buscar CEP.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function validarFormulario() {
    if (!form.nome.trim()) return "Nome completo é obrigatório.";
    if (!cpfValido(form.cpf)) return "CPF inválido. Confira os 11 números.";
    if (!form.cnh.trim()) return "CNH é obrigatória.";
    if (somenteNumeros(form.telefone).length < 10) return "Telefone é obrigatório.";
    if (!form.email.trim() || !form.email.includes("@")) return "E-mail válido é obrigatório.";
    if (somenteNumeros(form.cep).length !== 8) return "CEP é obrigatório.";
    if (!form.endereco.trim()) return "Endereço é obrigatório.";
    if (!form.numero.trim()) return "Número é obrigatório.";
    if (!form.bairro.trim()) return "Bairro é obrigatório.";
    if (!form.cidade.trim()) return "Cidade é obrigatória.";
    if (!form.estado.trim()) return "Estado é obrigatório.";
    if (!form.pix_type.trim()) return "Tipo de PIX é obrigatório.";
    if (!form.pix_key.trim()) return "Chave PIX é obrigatória.";
    return "";
  }

  async function salvar() {
    setMsg("");

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setMsg(erroValidacao);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: form.nome.trim(),
        cpf: somenteNumeros(form.cpf),
        cnh: form.cnh.trim(),
        telefone: somenteNumeros(form.telefone),
        email: form.email.trim(),
        cep: somenteNumeros(form.cep),
        endereco: form.endereco.trim(),
        logradouro: form.endereco.trim(),
        numero: form.numero.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim().toUpperCase().slice(0, 2),
        complemento: form.complemento.trim() || null,
        pix_type: form.pix_type || "CPF",
        pix_key: form.pix_key.trim(),
        observacoes: "Cadastro público de motorista/prestador operacional Aurora.",
        ativo: false,
      };

      const response = await fetch("/api/motoristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const texto = await response.text();

      let data: any = {};
      try {
        data = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error(
          `A API /api/motoristas não retornou JSON. Status: ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || data?.erro || "Erro ao enviar cadastro.");
      }

      setMsg("Cadastro enviado com sucesso. O motorista/prestador ficará em análise humana.");
      setForm(estadoInicial);
    } catch (error: any) {
      setMsg(error.message || "Erro ao enviar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 24 }}>
      <section style={{ maxWidth: 920, margin: "0 auto" }}>
        <a href="/" style={{ color: "#93c5fd", textDecoration: "none" }}>
          ← Voltar para home
        </a>

        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 24 }}>
          <p style={{ color: "#22c55e", fontWeight: 900 }}>Aurora Motoristas</p>
          <h1 style={{ fontSize: 34, marginTop: 8 }}>Cadastro de motorista / prestador</h1>

          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            Para atender locadoras, empresas, mobilização, desmobilização, transfer,
            diárias e serviços operacionais Aurora. Todo cadastro fica em análise e
            depende de aprovação humana.
          </p>

          <div style={{ marginTop: 18, padding: 14, borderRadius: 16, background: "#111827", border: "1px solid #334155", color: "#cbd5e1" }}>
            Todos os campos principais são obrigatórios. O motorista cadastrado entra como pendente e não acessa serviços antes da aprovação.
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 24 }}>
            <Campo obrigatorio label="Nome completo" value={form.nome} onChange={(v) => setCampo("nome", v)} />
            <Campo obrigatorio label="CPF" value={form.cpf} onChange={(v) => setCampo("cpf", v)} />
            <Campo obrigatorio label="CNH" value={form.cnh} onChange={(v) => setCampo("cnh", v)} />
            <Campo obrigatorio label="Telefone" value={form.telefone} onChange={(v) => setCampo("telefone", v)} />
            <Campo obrigatorio label="E-mail" value={form.email} onChange={(v) => setCampo("email", v)} />

            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: "#cbd5e1", fontSize: 13, marginBottom: 6 }}>CEP *</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input required value={form.cep} onChange={(e) => setCampo("cep", e.target.value)} onBlur={buscarCep} style={inputStyle} />
                <button type="button" onClick={buscarCep} disabled={buscandoCep} style={botaoCepStyle}>
                  {buscandoCep ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </label>

            <Campo obrigatorio label="Endereço" value={form.endereco} onChange={(v) => setCampo("endereco", v)} />
            <Campo obrigatorio label="Número" value={form.numero} onChange={(v) => setCampo("numero", v)} />
            <Campo obrigatorio label="Bairro" value={form.bairro} onChange={(v) => setCampo("bairro", v)} />
            <Campo obrigatorio label="Cidade" value={form.cidade} onChange={(v) => setCampo("cidade", v)} />
            <Campo obrigatorio label="Estado" value={form.estado} onChange={(v) => setCampo("estado", v)} />
            <Campo label="Complemento" value={form.complemento} onChange={(v) => setCampo("complemento", v)} />

            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: "#cbd5e1", fontSize: 13, marginBottom: 6 }}>Tipo de PIX *</span>
              <select required value={form.pix_type || "CPF"} onChange={(e) => setCampo("pix_type", e.target.value || "CPF")} style={inputStyle}>
                <option value="CPF">CPF</option>
                <option value="Telefone">Telefone</option>
                <option value="E-mail">E-mail</option>
                <option value="Aleatória">Aleatória</option>
              </select>
            </label>

            <Campo obrigatorio label="Chave PIX" value={form.pix_key} onChange={(v) => setCampo("pix_key", v)} />
          </div>

          <button onClick={salvar} disabled={loading || buscandoCep} style={botaoEnviarStyle(loading)}>
            {loading ? "Enviando cadastro..." : "Enviar cadastro para análise"}
          </button>

          {msg && (
            <p style={{ marginTop: 16, color: msg.includes("sucesso") || msg.includes("CEP localizado") ? "#86efac" : "#fca5a5", fontWeight: 800 }}>
              {msg}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 13,
  borderRadius: 14,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
};

const botaoCepStyle: React.CSSProperties = {
  padding: "0 12px",
  borderRadius: 14,
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: 900,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

function botaoEnviarStyle(loading: boolean): React.CSSProperties {
  return {
    marginTop: 24,
    width: "100%",
    padding: 16,
    borderRadius: 16,
    border: "none",
    background: loading ? "#64748b" : "#22c55e",
    color: "#020617",
    fontWeight: 900,
    cursor: loading ? "not-allowed" : "pointer",
  };
}

function Campo({
  label,
  value,
  onChange,
  obrigatorio = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  obrigatorio?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", color: "#cbd5e1", fontSize: 13, marginBottom: 6 }}>
        {label}{obrigatorio ? " *" : ""}
      </span>
      <input required={obrigatorio} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}