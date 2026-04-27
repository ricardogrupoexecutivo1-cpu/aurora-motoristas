"use client";

import { useEffect, useMemo, useState } from "react";

type Contato = {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  setor: string;
  tipo: string;
};

type ClienteFinanceiro = {
  id: string;
  nome: string;
  documento: string | null;
  tipo_cobranca: string | null;
  prazo_pagamento: string | null;
  valor_km: number | null;
  regra_km: string | null;
  regra_despesas: string | null;
  valor_diaria_patio: number | null;
  regra_diaria_patio: string | null;
  observacoes: string | null;
  status: string | null;
  created_at: string;
  cliente_contatos?: Contato[];
};

export default function ClientesFinanceiroPage() {
  const [clientes, setClientes] = useState<ClienteFinanceiro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipoCobranca, setTipoCobranca] = useState("por_viagem");
  const [prazoPagamento, setPrazoPagamento] = useState("Após emissão da NF/ND");
  const [valorKm, setValorKm] = useState("");
  const [regraKm, setRegraKm] = useState("KM combinado anual");
  const [regraDespesas, setRegraDespesas] = useState("Despesas por conta Aurora");
  const [valorDiariaPatio, setValorDiariaPatio] = useState("");
  const [regraDiariaPatio, setRegraDiariaPatio] = useState("Conforme necessidade operacional");
  const [observacoes, setObservacoes] = useState("");

  const [contatos, setContatos] = useState<Contato[]>([]);
  const [contatoNome, setContatoNome] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [contatoSetor, setContatoSetor] = useState("");
  const [contatoTipo, setContatoTipo] = useState("Operacional");

  const ativos = useMemo(() => {
    return clientes.filter((c) => c.status === "ativo").length;
  }, [clientes]);

  async function carregarClientes() {
    setMsg("");
    setCarregando(true);

    try {
      const res = await fetch("/api/clientes-financeiro", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao carregar clientes.");
        setClientes([]);
        return;
      }

      setClientes(Array.isArray(data.clientes) ? data.clientes : []);
    } catch (error) {
      console.error("ERRO AO CARREGAR CLIENTES:", error);
      setMsg("Erro inesperado ao carregar clientes.");
      setClientes([]);
    } finally {
      setCarregando(false);
    }
  }

  function adicionarContato() {
    setMsg("");

    if (!contatoNome.trim()) {
      setMsg("Informe o nome do contato.");
      return;
    }

    const novoContato: Contato = {
      nome: contatoNome,
      email: contatoEmail,
      telefone: contatoTelefone,
      setor: contatoSetor,
      tipo: contatoTipo,
    };

    setContatos((lista) => [...lista, novoContato]);

    setContatoNome("");
    setContatoEmail("");
    setContatoTelefone("");
    setContatoSetor("");
    setContatoTipo("Operacional");
  }

  function removerContato(index: number) {
    setContatos((lista) => lista.filter((_, i) => i !== index));
  }

  async function salvarCliente() {
    setMsg("");

    if (!nome.trim()) {
      setMsg("Informe o nome do cliente/locadora.");
      return;
    }

    if (!documento.trim()) {
      setMsg("Informe o CNPJ/CPF do cliente.");
      return;
    }

    setSalvando(true);

    try {
      const res = await fetch("/api/clientes-financeiro", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          documento,
          contatos,
          tipo_cobranca: tipoCobranca,
          prazo_pagamento: prazoPagamento,
          valor_km: valorKm,
          regra_km: regraKm,
          regra_despesas: regraDespesas,
          valor_diaria_patio: valorDiariaPatio,
          regra_diaria_patio: regraDiariaPatio,
          observacoes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao salvar cliente financeiro.");
        return;
      }

      setMsg("Cliente financeiro salvo no Supabase.");

      setNome("");
      setDocumento("");
      setContatos([]);
      setTipoCobranca("por_viagem");
      setPrazoPagamento("Após emissão da NF/ND");
      setValorKm("");
      setRegraKm("KM combinado anual");
      setRegraDespesas("Despesas por conta Aurora");
      setValorDiariaPatio("");
      setRegraDiariaPatio("Conforme necessidade operacional");
      setObservacoes("");

      await carregarClientes();
    } catch (error) {
      console.error("ERRO AO SALVAR CLIENTE:", error);
      setMsg("Erro inesperado ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-300 font-semibold">
            Aurora Motoristas
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Clientes Financeiro / Locadoras
          </h1>

          <p className="text-slate-300 mt-2">
            Cadastro real no Supabase com regras de cobrança, contatos múltiplos,
            KM, despesas, diárias e prazo de pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card titulo="Clientes cadastrados" valor={String(clientes.length)} />
          <Card titulo="Clientes ativos" valor={String(ativos)} />
          <Card titulo="Status da leitura" valor={carregando ? "Carregando..." : "Supabase OK"} />
          <Card titulo="Visão cliente" valor="Sem motorista" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <h2 className="text-xl font-bold">
            Cadastro financeiro do cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Cliente / Locadora" value={nome} onChange={setNome} placeholder="Ex.: Localiza, Movida, Unidas, Empresa X" />
            <Campo label="CNPJ / CPF" value={documento} onChange={setDocumento} placeholder="Ex.: 00.000.000/0001-00" />
            <Campo label="Prazo de pagamento" value={prazoPagamento} onChange={setPrazoPagamento} placeholder="Ex.: 15 dias após emissão da NF/ND" />
            <Campo label="Valor KM combinado" value={valorKm} onChange={setValorKm} placeholder="Ex.: 2,00 / 2,50 / 3,00" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectBox
              label="Tipo de cobrança"
              value={tipoCobranca}
              onChange={setTipoCobranca}
              options={[
                ["por_viagem", "Por viagem / serviço"],
                ["mensal_agrupado", "Mensal agrupado"],
                ["por_os", "Por OS do cliente"],
                ["misto", "Misto / conforme contrato"],
              ]}
            />

            <SelectBox
              label="Regra de KM"
              value={regraKm}
              onChange={setRegraKm}
              options={[
                ["KM combinado anual", "KM combinado anual"],
                ["KM mais baixo + despesas Aurora", "KM mais baixo + despesas Aurora"],
                ["KM mais baixo + reembolso despesas", "KM mais baixo + reembolso despesas"],
                ["Valor fechado por rota", "Valor fechado por rota"],
                ["Conforme cotação aprovada", "Conforme cotação aprovada"],
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectBox
              label="Regra de despesas"
              value={regraDespesas}
              onChange={setRegraDespesas}
              options={[
                ["Despesas por conta Aurora", "Despesas por conta Aurora"],
                ["Reembolso de todas as despesas", "Reembolso de todas as despesas"],
                ["Reembolso mediante comprovante", "Reembolso mediante comprovante"],
                ["Despesas inclusas no valor fechado", "Despesas inclusas no valor fechado"],
                ["Conforme negociação do serviço", "Conforme negociação do serviço"],
              ]}
            />

            <Campo label="Valor diária de pátio" value={valorDiariaPatio} onChange={setValorDiariaPatio} placeholder="Ex.: 250,00" />
          </div>

          <SelectBox
            label="Regra de diária de pátio"
            value={regraDiariaPatio}
            onChange={setRegraDiariaPatio}
            options={[
              ["Conforme necessidade operacional", "Conforme necessidade operacional"],
              ["Cobrança por diária avulsa", "Cobrança por diária avulsa"],
              ["Inclusa no valor do serviço", "Inclusa no valor do serviço"],
              ["Somente com aprovação prévia", "Somente com aprovação prévia"],
              ["Conforme OS do cliente", "Conforme OS do cliente"],
            ]}
          />

          <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-4">
            <h3 className="font-bold text-lg">
              Contatos / setores do cliente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                value={contatoNome}
                onChange={(e) => setContatoNome(e.target.value)}
                placeholder="Nome"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={contatoEmail}
                onChange={(e) => setContatoEmail(e.target.value)}
                placeholder="E-mail"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={contatoTelefone}
                onChange={(e) => setContatoTelefone(e.target.value)}
                placeholder="Telefone"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={contatoSetor}
                onChange={(e) => setContatoSetor(e.target.value)}
                placeholder="Setor / Unidade"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <select
                value={contatoTipo}
                onChange={(e) => setContatoTipo(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              >
                <option>Operacional</option>
                <option>Financeiro</option>
                <option>Compras</option>
                <option>Fiscal</option>
                <option>Gestor</option>
              </select>
            </div>

            <button
              type="button"
              onClick={adicionarContato}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3"
            >
              Adicionar contato
            </button>

            {contatos.length === 0 ? (
              <p className="text-sm text-slate-400">
                Nenhum contato adicionado ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {contatos.map((contato, index) => (
                  <div
                    key={`${contato.nome}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold">{contato.nome}</p>
                      <p className="text-sm text-slate-400">
                        {contato.tipo} • {contato.setor || "sem setor"} •{" "}
                        {contato.email || "sem e-mail"} •{" "}
                        {contato.telefone || "sem telefone"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerContato(index)}
                      className="text-red-300 font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Observações / contrato / regra especial
            </label>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: cliente paga agrupado mensalmente, prazo de 15 dias após emissão da ND, despesas com recibo, OS obrigatória."
              className="w-full min-h-28 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {msg && (
            <div className="rounded-xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100">
              {msg}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              onClick={salvarCliente}
              disabled={salvando}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold px-5 py-3 transition"
            >
              {salvando ? "Salvando..." : "Salvar cliente no Supabase"}
            </button>

            <button
              type="button"
              onClick={carregarClientes}
              className="rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-bold px-5 py-3 transition"
            >
              Atualizar lista
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-4">
            Clientes cadastrados no Supabase
          </h2>

          {clientes.length === 0 ? (
            <p className="text-slate-400">
              Nenhum cliente financeiro cadastrado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{cliente.nome}</p>

                      <p className="text-sm text-slate-400">
                        Documento: {cliente.documento || "não informado"}
                      </p>

                      <p className="text-sm text-slate-400">
                        Cobrança: {cliente.tipo_cobranca || "não informada"}
                      </p>

                      <p className="text-sm text-slate-400">
                        Prazo: {cliente.prazo_pagamento || "não informado"}
                      </p>

                      <p className="text-sm text-slate-400">
                        KM: R$ {formatarMoeda(cliente.valor_km || 0)} •{" "}
                        {cliente.regra_km || "sem regra"}
                      </p>

                      <p className="text-sm text-slate-400">
                        Despesas: {cliente.regra_despesas || "sem regra"}
                      </p>

                      <p className="text-sm text-slate-400">
                        Diária pátio: R${" "}
                        {formatarMoeda(cliente.valor_diaria_patio || 0)} •{" "}
                        {cliente.regra_diaria_patio || "sem regra"}
                      </p>

                      <p className="text-sm text-emerald-300">
                        Status: {cliente.status || "ativo"}
                      </p>

                      <div className="pt-3">
                        <p className="text-sm font-bold text-cyan-200">
                          Contatos:
                        </p>

                        {!cliente.cliente_contatos ||
                        cliente.cliente_contatos.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            Nenhum contato cadastrado.
                          </p>
                        ) : (
                          <div className="space-y-1 mt-1">
                            {cliente.cliente_contatos.map((contato) => (
                              <p
                                key={contato.id || contato.nome}
                                className="text-sm text-slate-400"
                              >
                                {contato.nome} • {contato.tipo || "Contato"} •{" "}
                                {contato.setor || "sem setor"} •{" "}
                                {contato.email || "sem e-mail"} •{" "}
                                {contato.telefone || "sem telefone"}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">
                      ID: {cliente.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
      />
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  options: string[][];
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
      >
        {options.map(([valueOption, labelOption]) => (
          <option key={valueOption} value={valueOption}>
            {labelOption}
          </option>
        ))}
      </select>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{titulo}</p>
      <h2 className="text-2xl font-bold mt-2">{valor}</h2>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
