"use client";

import { useMemo, useState } from "react";

type LancamentoCliente = {
  id: string;
  cliente: string;
  osCliente: string;
  numeroServico: string;
  dataServico: string;
  origem: string;
  destino: string;
  descricao: string;
  valorServico: string;
  despesasReembolsaveis: string;
  diariasPatio: string;
  numeroND: string;
  dataEmissaoND: string;
  vencimento: string;
  statusFinanceiro: "a_cobrar" | "cobrado" | "a_receber" | "recebido" | "cancelado";
  createdAt: string;
};

export default function RelatorioClientePage() {
  const [lancamentos, setLancamentos] = useState<LancamentoCliente[]>([]);

  const [cliente, setCliente] = useState("");
  const [osCliente, setOsCliente] = useState("");
  const [numeroServico, setNumeroServico] = useState("");
  const [dataServico, setDataServico] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [despesasReembolsaveis, setDespesasReembolsaveis] = useState("");
  const [diariasPatio, setDiariasPatio] = useState("");
  const [numeroND, setNumeroND] = useState("");
  const [dataEmissaoND, setDataEmissaoND] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [statusFinanceiro, setStatusFinanceiro] = useState<LancamentoCliente["statusFinanceiro"]>("a_cobrar");

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [msg, setMsg] = useState("");

  const filtrados = useMemo(() => {
    return lancamentos.filter((item) => {
      const clienteOk = filtroCliente
        ? item.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
        : true;

      const statusOk = filtroStatus ? item.statusFinanceiro === filtroStatus : true;

      return clienteOk && statusOk;
    });
  }, [lancamentos, filtroCliente, filtroStatus]);

  const totalGeral = useMemo(() => {
    return filtrados.reduce((total, item) => total + totalLancamento(item), 0);
  }, [filtrados]);

  const totalRecebido = useMemo(() => {
    return filtrados
      .filter((item) => item.statusFinanceiro === "recebido")
      .reduce((total, item) => total + totalLancamento(item), 0);
  }, [filtrados]);

  const totalAberto = totalGeral - totalRecebido;

  function salvarLancamento() {
    setMsg("");

    if (!cliente.trim()) return setMsg("Informe o cliente.");
    if (!numeroServico.trim()) return setMsg("Informe o número do serviço Aurora.");
    if (!valorServico.trim()) return setMsg("Informe o valor do serviço.");

    const novo: LancamentoCliente = {
      id: crypto.randomUUID(),
      cliente,
      osCliente,
      numeroServico,
      dataServico,
      origem,
      destino,
      descricao,
      valorServico,
      despesasReembolsaveis,
      diariasPatio,
      numeroND,
      dataEmissaoND,
      vencimento,
      statusFinanceiro,
      createdAt: new Date().toISOString(),
    };

    setLancamentos((lista) => [novo, ...lista]);

    setCliente("");
    setOsCliente("");
    setNumeroServico("");
    setDataServico("");
    setOrigem("");
    setDestino("");
    setDescricao("");
    setValorServico("");
    setDespesasReembolsaveis("");
    setDiariasPatio("");
    setNumeroND("");
    setDataEmissaoND("");
    setVencimento("");
    setStatusFinanceiro("a_cobrar");

    setMsg("Lançamento financeiro do cliente salvo.");
  }

  function alterarStatus(id: string, status: LancamentoCliente["statusFinanceiro"]) {
    setLancamentos((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, statusFinanceiro: status } : item
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-300 font-semibold">Aurora Motoristas</p>
          <h1 className="text-3xl font-bold mt-2">Relatório Financeiro do Cliente</h1>
          <p className="text-slate-300 mt-2">
            Controle de OS, serviços, ND, cobranças, recebimentos e conferência do cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card titulo="Lançamentos" valor={String(filtrados.length)} />
          <Card titulo="Total cliente" valor={`R$ ${formatarMoeda(totalGeral)}`} />
          <Card titulo="Recebido" valor={`R$ ${formatarMoeda(totalRecebido)}`} />
          <Card titulo="Em aberto" valor={`R$ ${formatarMoeda(totalAberto)}`} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <h2 className="text-xl font-bold">Novo lançamento / serviço do cliente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Cliente / Locadora" value={cliente} onChange={setCliente} placeholder="Ex.: Localiza" />
            <Campo label="OS do cliente" value={osCliente} onChange={setOsCliente} placeholder="Ex.: OS-001" />
            <Campo label="Número serviço Aurora" value={numeroServico} onChange={setNumeroServico} placeholder="Ex.: AM-2026-0001" />
            <Campo label="Data do serviço" value={dataServico} onChange={setDataServico} placeholder="Ex.: 27/04/2026" />
            <Campo label="Origem" value={origem} onChange={setOrigem} placeholder="Ex.: BH" />
            <Campo label="Destino" value={destino} onChange={setDestino} placeholder="Ex.: SP" />
            <Campo label="Valor serviço cliente" value={valorServico} onChange={setValorServico} placeholder="Ex.: 1170,00" />
            <Campo label="Despesas reembolsáveis" value={despesasReembolsaveis} onChange={setDespesasReembolsaveis} placeholder="Ex.: 180,00" />
            <Campo label="Diárias de pátio" value={diariasPatio} onChange={setDiariasPatio} placeholder="Ex.: 250,00" />
            <Campo label="Número ND" value={numeroND} onChange={setNumeroND} placeholder="Ex.: ND-0001" />
            <Campo label="Data emissão ND" value={dataEmissaoND} onChange={setDataEmissaoND} placeholder="Ex.: 30/04/2026" />
            <Campo label="Vencimento" value={vencimento} onChange={setVencimento} placeholder="Ex.: 15/05/2026" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Status financeiro</label>
            <select
              value={statusFinanceiro}
              onChange={(e) => setStatusFinanceiro(e.target.value as LancamentoCliente["statusFinanceiro"])}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
            >
              <option value="a_cobrar">A cobrar</option>
              <option value="cobrado">Cobrado</option>
              <option value="a_receber">A receber</option>
              <option value="recebido">Recebido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Descrição completa editável</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do serviço, veículo, rota, OS, período, despesas e observações da cobrança."
              className="w-full min-h-28 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {msg && (
            <div className="rounded-xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100">
              {msg}
            </div>
          )}

          <button
            type="button"
            onClick={salvarLancamento}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3"
          >
            Salvar lançamento financeiro
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-bold">Filtros do relatório</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Filtrar por cliente" value={filtroCliente} onChange={setFiltroCliente} placeholder="Digite o nome do cliente" />

            <div>
              <label className="block text-sm text-slate-300 mb-2">Filtrar por status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
              >
                <option value="">Todos</option>
                <option value="a_cobrar">A cobrar</option>
                <option value="cobrado">Cobrado</option>
                <option value="a_receber">A receber</option>
                <option value="recebido">Recebido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-bold">Relatório do cliente</h2>

          {filtrados.length === 0 ? (
            <p className="text-slate-400">Nenhum lançamento encontrado.</p>
          ) : (
            <div className="space-y-4">
              {filtrados.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-lg">{item.cliente}</p>
                      <p className="text-sm text-slate-400">
                        Serviço: {item.numeroServico} • OS: {item.osCliente || "não informada"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.dataServico || "sem data"} • {item.origem || "origem"} → {item.destino || "destino"}
                      </p>
                      <p className="text-sm text-slate-400">
                        ND: {item.numeroND || "não emitida"} • Vencimento: {item.vencimento || "não definido"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-400">Total cliente</p>
                      <p className="text-2xl font-bold text-cyan-300">
                        R$ {formatarMoeda(totalLancamento(item))}
                      </p>
                      <p className="text-sm text-yellow-300 font-bold">
                        {labelStatus(item.statusFinanceiro)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 whitespace-pre-wrap">
                    {item.descricao || "Sem descrição detalhada."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <BotaoStatus texto="A cobrar" onClick={() => alterarStatus(item.id, "a_cobrar")} />
                    <BotaoStatus texto="Cobrado" onClick={() => alterarStatus(item.id, "cobrado")} />
                    <BotaoStatus texto="A receber" onClick={() => alterarStatus(item.id, "a_receber")} />
                    <BotaoStatus texto="Recebido" onClick={() => alterarStatus(item.id, "recebido")} />
                    <BotaoStatus texto="Cancelado" onClick={() => alterarStatus(item.id, "cancelado")} />
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

function BotaoStatus({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-700 hover:bg-slate-800 px-3 py-2 text-sm font-semibold"
    >
      {texto}
    </button>
  );
}

function moedaParaNumero(valor: string) {
  return Number(String(valor || "0").replace(/\./g, "").replace(",", ".")) || 0;
}

function totalLancamento(item: LancamentoCliente) {
  return (
    moedaParaNumero(item.valorServico) +
    moedaParaNumero(item.despesasReembolsaveis) +
    moedaParaNumero(item.diariasPatio)
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function labelStatus(status: LancamentoCliente["statusFinanceiro"]) {
  const mapa = {
    a_cobrar: "A cobrar",
    cobrado: "Cobrado",
    a_receber: "A receber",
    recebido: "Recebido",
    cancelado: "Cancelado",
  };

  return mapa[status];
}
