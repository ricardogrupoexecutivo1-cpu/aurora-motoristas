"use client";

import { useMemo, useState } from "react";

type ItemND = {
  id: string;
  servico: string;
  osCliente: string;
  dataServico: string;
  descricao: string;
  valor: string;
};

type NotaDebito = {
  id: string;
  numeroND: string;
  dataEmissao: string;
  vencimento: string;
  periodo: string;
  auroraNome: string;
  auroraDocumento: string;
  auroraEndereco: string;
  clienteNome: string;
  clienteDocumento: string;
  clienteEndereco: string;
  clienteEmail: string;
  descricaoGeral: string;
  itens: ItemND[];
  status: "rascunho" | "emitida" | "enviada" | "paga" | "cancelada";
  createdAt: string;
};

export default function NotaDebitoPage() {
  const [notas, setNotas] = useState<NotaDebito[]>([]);
  const [itens, setItens] = useState<ItemND[]>([]);

  const [numeroND, setNumeroND] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [auroraNome, setAuroraNome] = useState("Aurora Motoristas");
  const [auroraDocumento, setAuroraDocumento] = useState("");
  const [auroraEndereco, setAuroraEndereco] = useState("");

  const [clienteNome, setClienteNome] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [clienteEndereco, setClienteEndereco] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");

  const [descricaoGeral, setDescricaoGeral] = useState("");

  const [servico, setServico] = useState("");
  const [osCliente, setOsCliente] = useState("");
  const [dataServico, setDataServico] = useState("");
  const [descricaoItem, setDescricaoItem] = useState("");
  const [valorItem, setValorItem] = useState("");

  const [status, setStatus] = useState<NotaDebito["status"]>("rascunho");
  const [msg, setMsg] = useState("");

  const totalItens = useMemo(() => {
    return itens.reduce((total, item) => total + moedaParaNumero(item.valor), 0);
  }, [itens]);

  const totalEmitido = useMemo(() => {
    return notas.reduce((total, nota) => total + totalNota(nota), 0);
  }, [notas]);

  const totalPago = useMemo(() => {
    return notas
      .filter((nota) => nota.status === "paga")
      .reduce((total, nota) => total + totalNota(nota), 0);
  }, [notas]);

  const totalAberto = totalEmitido - totalPago;

  function adicionarItem() {
    setMsg("");

    if (!servico.trim()) return setMsg("Informe o número do serviço.");
    if (!valorItem.trim()) return setMsg("Informe o valor do item.");

    const novo: ItemND = {
      id: crypto.randomUUID(),
      servico,
      osCliente,
      dataServico,
      descricao: descricaoItem,
      valor: valorItem,
    };

    setItens((lista) => [...lista, novo]);

    setServico("");
    setOsCliente("");
    setDataServico("");
    setDescricaoItem("");
    setValorItem("");
  }

  function removerItem(id: string) {
    setItens((lista) => lista.filter((item) => item.id !== id));
  }

  function salvarND() {
    setMsg("");

    if (!numeroND.trim()) return setMsg("Informe o número da ND.");
    if (!clienteNome.trim()) return setMsg("Informe o cliente.");
    if (itens.length === 0) return setMsg("Adicione pelo menos um serviço/item na ND.");

    const nova: NotaDebito = {
      id: crypto.randomUUID(),
      numeroND,
      dataEmissao,
      vencimento,
      periodo,
      auroraNome,
      auroraDocumento,
      auroraEndereco,
      clienteNome,
      clienteDocumento,
      clienteEndereco,
      clienteEmail,
      descricaoGeral,
      itens,
      status,
      createdAt: new Date().toISOString(),
    };

    setNotas((lista) => [nova, ...lista]);

    setNumeroND("");
    setDataEmissao("");
    setVencimento("");
    setPeriodo("");
    setClienteNome("");
    setClienteDocumento("");
    setClienteEndereco("");
    setClienteEmail("");
    setDescricaoGeral("");
    setItens([]);
    setStatus("rascunho");

    setMsg("Nota de Débito criada com sucesso.");
  }

  function alterarStatus(id: string, novoStatus: NotaDebito["status"]) {
    setNotas((lista) =>
      lista.map((nota) =>
        nota.id === id ? { ...nota, status: novoStatus } : nota
      )
    );
  }

  function imprimirND() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8 print:bg-white print:text-black">
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="print:hidden">
          <p className="text-sm text-cyan-300 font-semibold">Aurora Motoristas</p>
          <h1 className="text-3xl font-bold mt-2">Nota de Débito / ND</h1>
          <p className="text-slate-300 mt-2">
            Gere ND por serviço ou por período, com descrição editável, itens e status financeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
          <Card titulo="NDs criadas" valor={String(notas.length)} />
          <Card titulo="Total emitido" valor={`R$ ${formatarMoeda(totalEmitido)}`} />
          <Card titulo="Total pago" valor={`R$ ${formatarMoeda(totalPago)}`} />
          <Card titulo="Em aberto" valor={`R$ ${formatarMoeda(totalAberto)}`} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 print:border print:bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-xl font-bold">Nova Nota de Débito</h2>

            <button
              type="button"
              onClick={imprimirND}
              className="print:hidden rounded-xl border border-slate-600 hover:bg-slate-800 px-4 py-2 font-semibold"
            >
              Imprimir / salvar PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
            <Campo label="Número ND" value={numeroND} onChange={setNumeroND} placeholder="Ex.: ND-2026-0001" />
            <Campo label="Data emissão" value={dataEmissao} onChange={setDataEmissao} placeholder="Ex.: 30/04/2026" />
            <Campo label="Vencimento" value={vencimento} onChange={setVencimento} placeholder="Ex.: 15/05/2026" />
            <Campo label="Período" value={periodo} onChange={setPeriodo} placeholder="Ex.: Abril/2026" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Bloco titulo="Dados Aurora">
              <Campo label="Nome / Razão" value={auroraNome} onChange={setAuroraNome} placeholder="Aurora Motoristas" />
              <Campo label="CNPJ / CPF" value={auroraDocumento} onChange={setAuroraDocumento} placeholder="Documento Aurora" />
              <Campo label="Endereço" value={auroraEndereco} onChange={setAuroraEndereco} placeholder="Endereço Aurora" />
            </Bloco>

            <Bloco titulo="Dados do Cliente">
              <Campo label="Cliente / Locadora" value={clienteNome} onChange={setClienteNome} placeholder="Ex.: Localiza" />
              <Campo label="CNPJ / CPF" value={clienteDocumento} onChange={setClienteDocumento} placeholder="Documento cliente" />
              <Campo label="Endereço" value={clienteEndereco} onChange={setClienteEndereco} placeholder="Endereço cliente" />
              <Campo label="E-mail financeiro" value={clienteEmail} onChange={setClienteEmail} placeholder="financeiro@cliente.com.br" />
            </Bloco>
          </div>

          <div className="print:hidden rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3">
            <h3 className="font-bold">Adicionar serviço / item da ND</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                placeholder="Serviço Aurora"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={osCliente}
                onChange={(e) => setOsCliente(e.target.value)}
                placeholder="OS cliente"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={dataServico}
                onChange={(e) => setDataServico(e.target.value)}
                placeholder="Data serviço"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <input
                value={valorItem}
                onChange={(e) => setValorItem(e.target.value)}
                placeholder="Valor"
                className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              />

              <button
                type="button"
                onClick={adicionarItem}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3"
              >
                Adicionar
              </button>
            </div>

            <textarea
              value={descricaoItem}
              onChange={(e) => setDescricaoItem(e.target.value)}
              placeholder="Descrição do item/serviço"
              className="w-full min-h-20 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2 print:text-black">
              Descrição geral editável
            </label>

            <textarea
              value={descricaoGeral}
              onChange={(e) => setDescricaoGeral(e.target.value)}
              placeholder="Descrição geral da ND, contrato, período, observações e condições de pagamento."
              className="w-full min-h-24 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white print:bg-white print:text-black"
            />
          </div>

          <div className="rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 print:bg-white">
                <tr>
                  <th className="text-left p-3">Serviço</th>
                  <th className="text-left p-3">OS</th>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Descrição</th>
                  <th className="text-right p-3">Valor</th>
                  <th className="text-right p-3 print:hidden">Ação</th>
                </tr>
              </thead>

              <tbody>
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-slate-400">
                      Nenhum item adicionado.
                    </td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id} className="border-t border-slate-800">
                      <td className="p-3">{item.servico}</td>
                      <td className="p-3">{item.osCliente}</td>
                      <td className="p-3">{item.dataServico}</td>
                      <td className="p-3 whitespace-pre-wrap">{item.descricao}</td>
                      <td className="p-3 text-right">
                        R$ {formatarMoeda(moedaParaNumero(item.valor))}
                      </td>
                      <td className="p-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => removerItem(item.id)}
                          className="text-red-300 font-bold"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot className="border-t border-slate-700">
                <tr>
                  <td colSpan={4} className="p-3 font-bold text-right">
                    Total
                  </td>
                  <td className="p-3 text-right font-bold text-cyan-300 print:text-black">
                    R$ {formatarMoeda(totalItens)}
                  </td>
                  <td className="print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="print:hidden">
            <label className="block text-sm text-slate-300 mb-2">Status da ND</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NotaDebito["status"])}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
            >
              <option value="rascunho">Rascunho</option>
              <option value="emitida">Emitida</option>
              <option value="enviada">Enviada</option>
              <option value="paga">Paga</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {msg && (
            <div className="print:hidden rounded-xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100">
              {msg}
            </div>
          )}

          <button
            type="button"
            onClick={salvarND}
            className="print:hidden rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3"
          >
            Salvar ND
          </button>
        </div>

        <div className="print:hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-bold">NDs cadastradas</h2>

          {notas.length === 0 ? (
            <p className="text-slate-400">Nenhuma ND cadastrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {notas.map((nota) => (
                <div key={nota.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-lg">{nota.numeroND}</p>
                      <p className="text-sm text-slate-400">
                        Cliente: {nota.clienteNome} • Período: {nota.periodo || "não informado"}
                      </p>
                      <p className="text-sm text-slate-400">
                        Emissão: {nota.dataEmissao || "não informada"} • Vencimento: {nota.vencimento || "não informado"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-400">Total ND</p>
                      <p className="text-2xl font-bold text-cyan-300">
                        R$ {formatarMoeda(totalNota(nota))}
                      </p>
                      <p className="text-yellow-300 font-bold">
                        {labelStatus(nota.status)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <BotaoStatus texto="Emitida" onClick={() => alterarStatus(nota.id, "emitida")} />
                    <BotaoStatus texto="Enviada" onClick={() => alterarStatus(nota.id, "enviada")} />
                    <BotaoStatus texto="Paga" onClick={() => alterarStatus(nota.id, "paga")} />
                    <BotaoStatus texto="Cancelada" onClick={() => alterarStatus(nota.id, "cancelada")} />
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

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3 print:bg-white">
      <h3 className="font-bold">{titulo}</h3>
      {children}
    </div>
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
      <label className="block text-sm text-slate-300 mb-2 print:text-black">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400 print:bg-white print:text-black"
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

function totalNota(nota: NotaDebito) {
  return nota.itens.reduce((total, item) => total + moedaParaNumero(item.valor), 0);
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function labelStatus(status: NotaDebito["status"]) {
  const mapa = {
    rascunho: "Rascunho",
    emitida: "Emitida",
    enviada: "Enviada",
    paga: "Paga",
    cancelada: "Cancelada",
  };

  return mapa[status];
}
