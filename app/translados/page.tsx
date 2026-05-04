"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Status =
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Concluído"
  | "Atrasado"
  | "Cancelado";

type TransferItem = {
  id: string;
  empresa: string;
  locadora: string;
  origem: string;
  destino: string;
  ufOrigem: string;
  ufDestino: string;
  cliente: string;
  motorista: string;
  motoristaReserva: string;
  horarioPrevisto: string;
  horarioAtualizado: string;
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  status: Status;
  observacao: string;
};

const STORAGE_KEY = "aurora-frotas-brasil-translados";

/* ================== VISUAL PADRÃO ================== */

const bgMain =
  "min-h-screen bg-gradient-to-br from-[#f7f9ff] via-[#eef4ff] to-[#faf0ff] text-gray-900";

const card =
  "bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg";

const input =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur focus:ring-2 focus:ring-indigo-400 outline-none";

const buttonPrimary =
  "px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-[1.02] transition";

const buttonSoft =
  "px-6 py-3 rounded-xl border border-gray-200 bg-white/70 hover:bg-white";

/* ================== FUNÇÕES ================== */

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function TransladosPage() {
  const [data, setData] = useState<TransferItem[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  const filtrados = useMemo(() => {
    return data.filter((item) =>
      `${item.origem} ${item.destino} ${item.motorista}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [data, busca]);

  return (
    <main className={bgMain}>
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
          Aurora Motoristas • Operação Nacional
        </p>

        <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🚛 FROTAS BRASIL
        </h1>

        <p className="text-gray-600 max-w-2xl">
          Painel nacional para mobilização, translados e operações.
        </p>

        <div className="flex gap-3 mt-6">
          <Link href="/operacoes-brasil" className={buttonPrimary}>
            Operações Brasil
          </Link>

          <Link href="/solicitar" className={buttonSoft}>
            ← Voltar
          </Link>
        </div>
      </section>

      {/* BUSCA */}
      <section className="max-w-7xl mx-auto px-6 mb-6">
        <input
          className={input}
          placeholder="Buscar operação..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </section>

      {/* LISTA */}
      <section className="max-w-7xl mx-auto px-6 pb-10 grid gap-4">
        {filtrados.map((item) => {
          const custo = item.valorMotorista + item.despesas;
          const lucro = item.valorTransfer - custo;

          return (
            <div key={item.id} className={`${card} p-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">
                    {item.origem} → {item.destino}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.cliente}</p>
                </div>

                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  {item.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <Box label="Receita" value={money(item.valorTransfer)} />
                <Box label="Custo" value={money(custo)} />
                <Box
                  label="Lucro"
                  value={money(lucro)}
                  highlight={lucro >= 0}
                />
              </div>

              <p className="mt-4 text-sm text-gray-600 bg-white/60 p-3 rounded-xl">
                {item.observacao || "Sem observação"}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function Box({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}