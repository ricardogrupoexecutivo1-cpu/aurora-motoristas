"use client";

import { useMemo, useState } from "react";

type ItemCliente = {
  id: string;
  numeroServico: string;
  osCliente: string;
  data: string;
  origem: string;
  destino: string;
  descricao: string;
  valor: string;
  despesas: string;
  diarias: string;
  numeroND: string;
  status: "a_cobrar" | "cobrado" | "a_receber" | "recebido";
};

export default function PainelCliente() {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [itens, setItens] = useState<ItemCliente[]>([]);

  const filtrados = useMemo(() => {
    return itens.filter((item) =>
      clienteFiltro
        ? item.numeroServico.toLowerCase().includes(clienteFiltro.toLowerCase())
        : true
    );
  }, [itens, clienteFiltro]);

  const total = useMemo(() => {
    return filtrados.reduce((t, i) => t + totalItem(i), 0);
  }, [filtrados]);

  const recebido = useMemo(() => {
    return filtrados
      .filter((i) => i.status === "recebido")
      .reduce((t, i) => t + totalItem(i), 0);
  }, [filtrados]);

  const aberto = total - recebido;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="max-w-7xl mx-auto space-y-6">

        <div>
          <p className="text-sm text-cyan-300 font-semibold">
            Aurora Motoristas
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Painel do Cliente
          </h1>

          <p className="text-slate-300 mt-2">
            Acompanhe seus serviços, OS, notas de débito e status financeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card titulo="Serviços" valor={String(filtrados.length)} />
          <Card titulo="Total" valor={`R$ ${formatarMoeda(total)}`} />
          <Card titulo="Recebido" valor={`R$ ${formatarMoeda(recebido)}`} />
          <Card titulo="Em aberto" valor={`R$ ${formatarMoeda(aberto)}`} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <input
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
            placeholder="Buscar por número do serviço"
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700"
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          {filtrados.length === 0 ? (
            <p className="text-slate-400">
              Nenhum serviço encontrado.
            </p>
          ) : (
            <div className="space-y-4">
              {filtrados.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    
                    <div>
                      <p className="font-bold text-lg">
                        Serviço {item.numeroServico}
                      </p>

                      <p className="text-sm text-slate-400">
                        OS: {item.osCliente}
                      </p>

                      <p className="text-sm text-slate-400">
                        {item.data} • {item.origem} → {item.destino}
                      </p>

                      <p className="text-sm text-slate-300 mt-2">
                        {item.descricao}
                      </p>

                      <p className="text-sm text-slate-400 mt-2">
                        ND: {item.numeroND || "não emitida"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-400">Total</p>

                      <p className="text-2xl font-bold text-cyan-300">
                        R$ {formatarMoeda(totalItem(item))}
                      </p>

                      <p className="text-yellow-300 font-bold">
                        {labelStatus(item.status)}
                      </p>
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

function totalItem(item: ItemCliente) {
  return (
    moedaParaNumero(item.valor) +
    moedaParaNumero(item.despesas) +
    moedaParaNumero(item.diarias)
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function labelStatus(status: ItemCliente["status"]) {
  const mapa = {
    a_cobrar: "A cobrar",
    cobrado: "Cobrado",
    a_receber: "A receber",
    recebido: "Recebido",
  };

  return mapa[status];
}
