"use client";

import { useEffect, useMemo, useState } from "react";

type Cliente = {
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
  cliente_contatos?: {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    setor: string | null;
    tipo: string | null;
  }[];
};

type Despesa = {
  id: string;
  tipo: string;
  valor: string;
  observacao: string;
};

type Cotacao = {
  id: string;
  cliente_nome: string | null;
  solicitante_nome: string | null;
  os_cliente: string | null;
  origem: string | null;
  destino: string | null;
  km: number | null;
  valor_km: number | null;
  valor_servico: number | null;
  valor_motorista: number | null;
  diaria_patio_valor: number | null;
  diaria_patio_quantidade: number | null;
  observacao: string | null;
  status: string | null;
  aprovado_por?: string | null;
  numero_aprovador?: string | null;
  numero_pedido?: string | null;
  data_pedido?: string | null;
  created_at: string;
  cotacao_despesas?: {
    id: string;
    tipo: string;
    valor: number;
    observacao: string | null;
  }[];
};

type AprovacaoState = {
  aprovado_por: string;
  numero_aprovador: string;
  numero_pedido: string;
  data_pedido: string;
};

export default function CotacoesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [solicitanteNome, setSolicitanteNome] = useState("");
  const [solicitanteTelefone, setSolicitanteTelefone] = useState("");
  const [solicitanteEmail, setSolicitanteEmail] = useState("");
  const [osCliente, setOsCliente] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [km, setKm] = useState("");
  const [valorKm, setValorKm] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [valorMotorista, setValorMotorista] = useState("");
  const [diariaPatioValor, setDiariaPatioValor] = useState("");
  const [diariaPatioQuantidade, setDiariaPatioQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [tipoDespesa, setTipoDespesa] = useState("Combustível");
  const [valorDespesa, setValorDespesa] = useState("");
  const [obsDespesa, setObsDespesa] = useState("");

  const [aprovacoes, setAprovacoes] = useState<Record<string, AprovacaoState>>({});

  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [aprovandoId, setAprovandoId] = useState("");

  const clienteSelecionado = useMemo(() => {
    return clientes.find((c) => c.id === clienteId) || null;
  }, [clientes, clienteId]);

  const totalDespesas = useMemo(() => {
    return despesas.reduce((total, item) => total + moedaParaNumero(item.valor), 0);
  }, [despesas]);

  const totalDiarias = useMemo(() => {
    return moedaParaNumero(diariaPatioValor) * (Number(diariaPatioQuantidade) || 0);
  }, [diariaPatioValor, diariaPatioQuantidade]);

  const totalPrevisto = useMemo(() => {
    return moedaParaNumero(valorServico) + totalDespesas + totalDiarias;
  }, [valorServico, totalDespesas, totalDiarias]);

  async function carregarTudo() {
    setMsg("");
    setCarregando(true);

    try {
      const [clientesRes, cotacoesRes] = await Promise.all([
        fetch("/api/clientes-financeiro", { cache: "no-store" }),
        fetch("/api/cotacoes", { cache: "no-store" }),
      ]);

      const clientesData = await clientesRes.json();
      const cotacoesData = await cotacoesRes.json();

      if (!clientesRes.ok || !clientesData?.success) {
        setMsg(clientesData?.message || "Erro ao carregar clientes.");
        return;
      }

      if (!cotacoesRes.ok || !cotacoesData?.success) {
        setMsg(cotacoesData?.message || "Erro ao carregar cotações.");
        return;
      }

      setClientes(Array.isArray(clientesData.clientes) ? clientesData.clientes : []);
      setCotacoes(Array.isArray(cotacoesData.cotacoes) ? cotacoesData.cotacoes : []);

      const hoje = new Date().toISOString().slice(0, 10);
      const estados: Record<string, AprovacaoState> = {};

      for (const cotacao of cotacoesData.cotacoes || []) {
        estados[cotacao.id] = {
          aprovado_por: cotacao.aprovado_por || "",
          numero_aprovador: cotacao.numero_aprovador || "",
          numero_pedido: cotacao.numero_pedido || "",
          data_pedido: cotacao.data_pedido || hoje,
        };
      }

      setAprovacoes(estados);
    } catch (error) {
      console.error("ERRO AO CARREGAR COTAÇÕES:", error);
      setMsg("Erro inesperado ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  }

  function selecionarCliente(id: string) {
    setClienteId(id);

    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    setValorKm(formatarNumeroCampo(cliente.valor_km || 0));
    setDiariaPatioValor(formatarNumeroCampo(cliente.valor_diaria_patio || 0));

    const contatoPrincipal =
      cliente.cliente_contatos?.find((c) => c.tipo === "Operacional") ||
      cliente.cliente_contatos?.[0];

    if (contatoPrincipal) {
      setSolicitanteNome(contatoPrincipal.nome || "");
      setSolicitanteTelefone(contatoPrincipal.telefone || "");
      setSolicitanteEmail(contatoPrincipal.email || "");
    }
  }

  function adicionarDespesa() {
    setMsg("");

    if (!valorDespesa.trim()) {
      setMsg("Informe o valor da despesa.");
      return;
    }

    const nova: Despesa = {
      id: crypto.randomUUID(),
      tipo: tipoDespesa,
      valor: valorDespesa,
      observacao: obsDespesa,
    };

    setDespesas((lista) => [...lista, nova]);
    setValorDespesa("");
    setObsDespesa("");
  }

  function removerDespesa(id: string) {
    setDespesas((lista) => lista.filter((item) => item.id !== id));
  }

  function atualizarAprovacao(
    cotacaoId: string,
    campo: keyof AprovacaoState,
    valor: string
  ) {
    setAprovacoes((atual) => ({
      ...atual,
      [cotacaoId]: {
        aprovado_por: atual[cotacaoId]?.aprovado_por || "",
        numero_aprovador: atual[cotacaoId]?.numero_aprovador || "",
        numero_pedido: atual[cotacaoId]?.numero_pedido || "",
        data_pedido: atual[cotacaoId]?.data_pedido || new Date().toISOString().slice(0, 10),
        [campo]: valor,
      },
    }));
  }

  async function salvarCotacao() {
    setMsg("");

    if (!clienteSelecionado) return setMsg("Selecione um cliente real do Supabase.");
    if (!solicitanteNome.trim()) return setMsg("Informe o solicitante.");
    if (!origem.trim()) return setMsg("Informe a origem.");
    if (!destino.trim()) return setMsg("Informe o destino.");
    if (!valorServico.trim()) return setMsg("Informe o valor do serviço.");

    setSalvando(true);

    try {
      const res = await fetch("/api/cotacoes", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteSelecionado.id,
          cliente_nome: clienteSelecionado.nome,
          solicitante_nome: solicitanteNome,
          solicitante_telefone: solicitanteTelefone,
          solicitante_email: solicitanteEmail,
          os_cliente: osCliente,
          origem,
          destino,
          km,
          valor_km: valorKm,
          valor_servico: valorServico,
          valor_motorista: valorMotorista,
          diaria_patio_valor: diariaPatioValor,
          diaria_patio_quantidade: diariaPatioQuantidade,
          observacao,
          despesas,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao salvar cotação.");
        return;
      }

      setMsg("Cotação salva no Supabase.");
      limparFormulario();
      await carregarTudo();
    } catch (error) {
      console.error("ERRO AO SALVAR COTAÇÃO:", error);
      setMsg("Erro inesperado ao salvar cotação.");
    } finally {
      setSalvando(false);
    }
  }

  async function aprovarCotacao(cotacaoId: string) {
    setMsg("");

    const aprovacao = aprovacoes[cotacaoId];

    if (!aprovacao?.aprovado_por?.trim()) {
      setMsg("Informe quem aprovou a cotação.");
      return;
    }

    if (!aprovacao?.numero_aprovador?.trim()) {
      setMsg("Informe o número/telefone de quem aprovou.");
      return;
    }

    if (!aprovacao?.numero_pedido?.trim()) {
      setMsg("Informe o número do pedido.");
      return;
    }

    if (!aprovacao?.data_pedido?.trim()) {
      setMsg("Informe a data do pedido.");
      return;
    }

    setAprovandoId(cotacaoId);

    try {
      const res = await fetch("/api/cotacoes/aprovar", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cotacao_id: cotacaoId,
          aprovado_por: aprovacao.aprovado_por,
          numero_aprovador: aprovacao.numero_aprovador,
          numero_pedido: aprovacao.numero_pedido,
          data_pedido: aprovacao.data_pedido,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao aprovar cotação.");
        return;
      }

      setMsg(data.message || "Cotação aprovada e serviço gerado com sucesso.");
      await carregarTudo();
    } catch (error) {
      console.error("ERRO AO APROVAR COTAÇÃO:", error);
      setMsg("Erro inesperado ao aprovar cotação.");
    } finally {
      setAprovandoId("");
    }
  }

  function limparFormulario() {
    setClienteId("");
    setSolicitanteNome("");
    setSolicitanteTelefone("");
    setSolicitanteEmail("");
    setOsCliente("");
    setOrigem("");
    setDestino("");
    setKm("");
    setValorKm("");
    setValorServico("");
    setValorMotorista("");
    setDiariaPatioValor("");
    setDiariaPatioQuantidade("");
    setObservacao("");
    setDespesas([]);
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-300 font-semibold">Aurora Motoristas</p>
          <h1 className="text-3xl font-bold mt-2">Cotações / Clientes</h1>
          <p className="text-slate-300 mt-2">
            Cotação conectada ao Supabase, usando cliente real, aprovação, serviço,
            regras financeiras, despesas e diárias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card titulo="Clientes" valor={String(clientes.length)} />
          <Card titulo="Cotações" valor={String(cotacoes.length)} />
          <Card titulo="Pendentes" valor={String(cotacoes.filter((c) => c.status === "pendente").length)} />
          <Card titulo="Status" valor={carregando ? "Carregando..." : "Supabase OK"} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <h2 className="text-xl font-bold">Nova cotação</h2>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Cliente / Locadora
            </label>

            <select
              value={clienteId}
              onChange={(e) => selecionarCliente(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
            >
              <option value="">Selecione cliente do Supabase</option>

              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.documento || "sem documento"}
                </option>
              ))}
            </select>
          </div>

          {clienteSelecionado && (
            <div className="rounded-xl border border-cyan-800 bg-cyan-950/30 p-4 text-sm text-cyan-100">
              <p><strong>Cliente:</strong> {clienteSelecionado.nome}</p>
              <p><strong>Tipo cobrança:</strong> {clienteSelecionado.tipo_cobranca}</p>
              <p><strong>Prazo:</strong> {clienteSelecionado.prazo_pagamento}</p>
              <p><strong>Regra KM:</strong> {clienteSelecionado.regra_km}</p>
              <p><strong>Regra despesas:</strong> {clienteSelecionado.regra_despesas}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Solicitante" value={solicitanteNome} onChange={setSolicitanteNome} placeholder="Nome de quem pediu" />
            <Campo label="Telefone solicitante" value={solicitanteTelefone} onChange={setSolicitanteTelefone} placeholder="WhatsApp / telefone" />
            <Campo label="E-mail solicitante" value={solicitanteEmail} onChange={setSolicitanteEmail} placeholder="email@cliente.com.br" />
            <Campo label="OS do cliente" value={osCliente} onChange={setOsCliente} placeholder="Número da OS do cliente" />
            <Campo label="Origem" value={origem} onChange={setOrigem} placeholder="Ex.: BH" />
            <Campo label="Destino" value={destino} onChange={setDestino} placeholder="Ex.: SP" />
            <Campo label="KM estimado" value={km} onChange={setKm} placeholder="Ex.: 585" />
            <Campo label="Valor KM combinado" value={valorKm} onChange={setValorKm} placeholder="Ex.: 2,00" />
            <Campo label="Valor do serviço / cliente" value={valorServico} onChange={setValorServico} placeholder="Ex.: 3000,00" />
            <Campo label="Valor previsto motorista" value={valorMotorista} onChange={setValorMotorista} placeholder="Ex.: 2200,00" />
            <Campo label="Valor diária pátio" value={diariaPatioValor} onChange={setDiariaPatioValor} placeholder="Ex.: 250,00" />
            <Campo label="Qtd. diárias pátio" value={diariaPatioQuantidade} onChange={setDiariaPatioQuantidade} placeholder="Ex.: 2" />
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3">
            <h3 className="font-bold">Despesas previstas / reembolsáveis</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={tipoDespesa}
                onChange={(e) => setTipoDespesa(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              >
                <option>Combustível</option>
                <option>Pedágio</option>
                <option>Hospedagem</option>
                <option>Alimentação</option>
                <option>Táxi / Uber</option>
                <option>Lavagem</option>
                <option>Estacionamento</option>
                <option>Outras</option>
              </select>

              <input
                value={valorDespesa}
                onChange={(e) => setValorDespesa(e.target.value)}
                placeholder="Valor"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={obsDespesa}
                onChange={(e) => setObsDespesa(e.target.value)}
                placeholder="Observação"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <button
                type="button"
                onClick={adicionarDespesa}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3"
              >
                Adicionar despesa
              </button>
            </div>

            {despesas.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma despesa adicionada.</p>
            ) : (
              <div className="space-y-2">
                {despesas.map((despesa) => (
                  <div
                    key={despesa.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3"
                  >
                    <p className="text-sm">
                      {despesa.tipo} • R$ {despesa.valor} • {despesa.observacao || "sem observação"}
                    </p>

                    <button
                      type="button"
                      onClick={() => removerDespesa(despesa.id)}
                      className="text-red-300 text-sm font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-slate-300">
              Total despesas: <strong>R$ {formatarMoeda(totalDespesas)}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Observação / descrição da cotação
            </label>

            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Descrição completa editável da operação."
              className="w-full min-h-28 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="rounded-xl border border-cyan-800 bg-cyan-950/30 p-4">
            <p className="text-sm text-cyan-100">
              Total previsto cliente: <strong>R$ {formatarMoeda(totalPrevisto)}</strong>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Serviço + despesas + diárias. Valor do motorista é interno/admin.
            </p>
          </div>

          {msg && (
            <div className="rounded-xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100">
              {msg}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              onClick={salvarCotacao}
              disabled={salvando}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold px-5 py-3"
            >
              {salvando ? "Salvando..." : "Salvar cotação no Supabase"}
            </button>

            <button
              type="button"
              onClick={carregarTudo}
              className="rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-bold px-5 py-3"
            >
              Atualizar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-bold">Cotações salvas no Supabase</h2>

          {cotacoes.length === 0 ? (
            <p className="text-slate-400">Nenhuma cotação cadastrada ainda.</p>
          ) : (
            cotacoes.map((cotacao) => {
              const aprovacao = aprovacoes[cotacao.id] || {
                aprovado_por: "",
                numero_aprovador: "",
                numero_pedido: "",
                data_pedido: new Date().toISOString().slice(0, 10),
              };

              const totalDespesaCotacao =
                cotacao.cotacao_despesas?.reduce((t, d) => t + Number(d.valor || 0), 0) || 0;

              const total =
                Number(cotacao.valor_servico || 0) +
                totalDespesaCotacao +
                Number(cotacao.diaria_patio_valor || 0) *
                  Number(cotacao.diaria_patio_quantidade || 0);

              return (
                <div key={cotacao.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-lg">{cotacao.cliente_nome}</p>

                      <p className="text-sm text-slate-400">
                        OS: {cotacao.os_cliente || "não informada"} • Solicitante:{" "}
                        {cotacao.solicitante_nome || "não informado"}
                      </p>

                      <p className="text-sm text-slate-400">
                        {cotacao.origem || "origem"} → {cotacao.destino || "destino"} • KM:{" "}
                        {cotacao.km || 0}
                      </p>

                      <p className="text-sm text-slate-400">
                        Serviço: R$ {formatarMoeda(Number(cotacao.valor_servico || 0))} •
                        Despesas: R$ {formatarMoeda(totalDespesaCotacao)}
                      </p>

                      <p className="text-yellow-300 font-bold mt-2">
                        Status: {cotacao.status}
                      </p>

                      {cotacao.status !== "pendente" && (
                        <div className="mt-3 rounded-xl border border-emerald-800 bg-emerald-950/20 p-3 text-sm text-emerald-100">
                          <p>Aprovado por: {cotacao.aprovado_por || "não informado"}</p>
                          <p>Número aprovador: {cotacao.numero_aprovador || "não informado"}</p>
                          <p>Pedido: {cotacao.numero_pedido || "não informado"}</p>
                          <p>Data pedido: {cotacao.data_pedido || "não informada"}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-400">Total cliente</p>
                      <p className="text-2xl font-bold text-cyan-300">
                        R$ {formatarMoeda(total)}
                      </p>
                    </div>
                  </div>

                  {cotacao.status === "pendente" && (
                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3">
                      <h3 className="font-bold text-emerald-300">
                        Aprovação da cotação
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          value={aprovacao.aprovado_por}
                          onChange={(e) =>
                            atualizarAprovacao(cotacao.id, "aprovado_por", e.target.value)
                          }
                          placeholder="Aprovado por"
                          className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
                        />

                        <input
                          value={aprovacao.numero_aprovador}
                          onChange={(e) =>
                            atualizarAprovacao(cotacao.id, "numero_aprovador", e.target.value)
                          }
                          placeholder="Telefone/número"
                          className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
                        />

                        <input
                          value={aprovacao.numero_pedido}
                          onChange={(e) =>
                            atualizarAprovacao(cotacao.id, "numero_pedido", e.target.value)
                          }
                          placeholder="Número do pedido"
                          className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
                        />

                        <input
                          type="date"
                          value={aprovacao.data_pedido}
                          onChange={(e) =>
                            atualizarAprovacao(cotacao.id, "data_pedido", e.target.value)
                          }
                          className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => aprovarCotacao(cotacao.id)}
                        disabled={aprovandoId === cotacao.id}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold px-5 py-3"
                      >
                        {aprovandoId === cotacao.id
                          ? "Aprovando..."
                          : "Aprovar cotação e gerar serviço"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
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
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
      />
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

function moedaParaNumero(valor: string) {
  return Number(String(valor || "0").replace(/\./g, "").replace(",", ".")) || 0;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarNumeroCampo(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
