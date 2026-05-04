"use client";

import { useEffect, useState } from "react";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  status: string;
  ativo?: boolean;
};

export default function AdminConvitesMotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [motoristaId, setMotoristaId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function carregarMotoristas() {
    setMsg("");

    try {
      const res = await fetch("/api/motoristas?scope=admin");
      const data = await res.json();

      const lista = data.motoristas || [];

      const aprovados = lista.filter((m: Motorista) => {
        const status = String(m.status || "").toLowerCase();

        return (
          m.ativo === true ||
          status === "aprovado" ||
          status === "aprovada" ||
          status === "approved"
        );
      });

      setMotoristas(aprovados);
    } catch {
      setMotoristas([]);
      setMsg("Erro ao carregar motoristas aprovados.");
    }
  }

  async function criarConviteIndividual() {
    setMsg("");

    if (!motoristaId) {
      setMsg("Selecione um motorista aprovado.");
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch("/api/motoristas/convites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motorista_id: motoristaId,
          observacao,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Erro ao criar convite.");
        return;
      }

      setMsg("Convite individual criado com sucesso.");
      setMotoristaId("");
      setObservacao("");
    } catch {
      setMsg("Erro ao criar convite individual.");
    } finally {
      setCarregando(false);
    }
  }

  async function dispararParaTodos() {
    setMsg("");

    const confirmar = window.confirm(
      "Confirmar disparo para todos os motoristas aprovados/livres?"
    );

    if (!confirmar) return;

    setCarregando(true);

    try {
      const res = await fetch("/api/motoristas/convites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todos: true,
          observacao,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Erro ao disparar convites.");
        return;
      }

      setMsg(`Convites disparados com sucesso. Total: ${data.total || 0}`);
      setMotoristaId("");
      setObservacao("");
    } catch {
      setMsg("Erro ao disparar convites.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMotoristas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <section className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-400 font-semibold">
            Aurora Motoristas
          </p>

          <h1 className="text-3xl font-bold">
            Convidar motoristas aprovados
          </h1>

          <p className="text-slate-400 mt-2">
            Crie convites individuais ou dispare para todos os motoristas aprovados/livres.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-sm text-slate-400">
              Motoristas aprovados encontrados
            </p>

            <p className="text-3xl font-bold text-cyan-300">
              {motoristas.length}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Motorista aprovado para convite individual
            </label>

            <select
              value={motoristaId}
              onChange={(e) => setMotoristaId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3"
            >
              <option value="">Selecione</option>

              {motoristas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — CPF {m.cpf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Observação do convite
            </label>

            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 min-h-28"
              placeholder="Ex.: Viagem de BH para Canaã dos Carajás."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <button
              onClick={criarConviteIndividual}
              disabled={carregando}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl p-3"
            >
              Criar convite individual
            </button>

            <button
              onClick={dispararParaTodos}
              disabled={carregando}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl p-3"
            >
              Disparar para todos aprovados/livres
            </button>
          </div>

          <button
            onClick={carregarMotoristas}
            disabled={carregando}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl p-3"
          >
            Recarregar motoristas
          </button>

          {msg && (
            <p className="text-sm text-cyan-300">
              {msg}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}