"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type TipoServico =
  | "Corrida"
  | "Viagem"
  | "Transfer"
  | "Mobilização"
  | "Desmobilização"
  | "Entrega"
  | "Cegonha"
  | "Guincho"
  | "Prancha"
  | "Outro";

type Status = "Pendente" | "Em andamento" | "Concluído";

type Operacao = {
  id: string;
  tipo: TipoServico;
  origem: string;
  destino: string;
  cliente: string;
  motorista: string;
  valor: number;
  custo: number;
  status: Status;
};

const STORAGE_KEY = "aurora-operacoes-brasil";

export default function OperacoesBrasilPage() {
  const [data, setData] = useState<Operacao[]>([]);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<TipoServico>("Corrida");

  const [form, setForm] = useState<Omit<Operacao, "id">>({
    tipo: "Corrida",
    origem: "",
    destino: "",
    cliente: "",
    motorista: "",
    valor: 0,
    custo: 0,
    status: "Pendente",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const resumo = useMemo(() => {
    const receita = data.reduce((acc, i) => acc + i.valor, 0);
    const custo = data.reduce((acc, i) => acc + i.custo, 0);
    const lucro = receita - custo;

    return {
      receita,
      custo,
      lucro,
      total: data.length,
    };
  }, [data]);

  function salvar() {
    if (!form.origem || !form.destino) {
      alert("Preencha origem e destino");
      return;
    }

    const nova: Operacao = {
      ...form,
      id: `OP-${Date.now()}`,
    };

    setData([nova, ...data]);

    setForm({
      tipo: "Corrida",
      origem: "",
      destino: "",
      cliente: "",
      motorista: "",
      valor: 0,
      custo: 0,
      status: "Pendente",
    });
  }

  const filtrados = data.filter((item) =>
    `${item.origem} ${item.destino} ${item.cliente}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black gradient-text">
            🚛 Aurora Operações Brasil
          </h1>
          <p className="text-muted-foreground">
            Gestão nacional de transporte, serviços e operações
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/70"
        >
          ← Voltar
        </Link>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Operações</p>
          <h2 className="text-xl font-bold">{resumo.total}</h2>
        </div>

        <div className="bg-card p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Receita</p>
          <h2 className="text-xl font-bold">R$ {resumo.receita}</h2>
        </div>

        <div className="bg-card p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Custo</p>
          <h2 className="text-xl font-bold">R$ {resumo.custo}</h2>
        </div>

        <div className="bg-card p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Lucro</p>
          <h2 className="text-xl font-bold text-green-500">
            R$ {resumo.lucro}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-card p-4 rounded-xl border mb-6">
        <h2 className="font-bold mb-3">Nova operação</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <select
            className="input"
            value={form.tipo}
            onChange={(e) =>
              setForm({ ...form, tipo: e.target.value as TipoServico })
            }
          >
            <option>Corrida</option>
            <option>Viagem</option>
            <option>Transfer</option>
            <option>Mobilização</option>
            <option>Desmobilização</option>
            <option>Entrega</option>
            <option>Cegonha</option>
            <option>Guincho</option>
            <option>Prancha</option>
            <option>Outro</option>
          </select>

          <input
            className="input"
            placeholder="Origem"
            value={form.origem}
            onChange={(e) => setForm({ ...form, origem: e.target.value })}
          />

          <input
            className="input"
            placeholder="Destino"
            value={form.destino}
            onChange={(e) => setForm({ ...form, destino: e.target.value })}
          />

          <input
            className="input"
            placeholder="Cliente"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />

          <input
            className="input"
            placeholder="Motorista"
            value={form.motorista}
            onChange={(e) => setForm({ ...form, motorista: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Valor"
            value={form.valor}
            onChange={(e) =>
              setForm({ ...form, valor: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="input"
            placeholder="Custo"
            value={form.custo}
            onChange={(e) =>
              setForm({ ...form, custo: Number(e.target.value) })
            }
          />
        </div>

        <button
          onClick={salvar}
          className="mt-4 px-6 py-2 rounded-xl gradient-premium text-white font-bold"
        >
          Salvar operação
        </button>
      </div>

      {/* BUSCA */}
      <input
        className="input mb-4"
        placeholder="Buscar operação..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* LISTA */}
      <div className="space-y-4">
        {filtrados.map((item) => {
          const lucro = item.valor - item.custo;

          return (
            <div key={item.id} className="bg-card p-4 rounded-xl border">
              <div className="flex justify-between">
                <h3 className="font-bold">{item.tipo}</h3>
                <span className="text-sm text-muted-foreground">
                  {item.status}
                </span>
              </div>

              <p>
                {item.origem} → {item.destino}
              </p>
              <p className="text-sm text-muted-foreground">
                Cliente: {item.cliente} • Motorista: {item.motorista}
              </p>

              <div className="mt-2 text-sm">
                💰 {item.valor} | 💸 {item.custo} | 📈{" "}
                <span className="text-green-500">{lucro}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}