"use client";

import { useEffect, useMemo, useState } from "react";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  cidade?: string | null;
  estado?: string | null;
  status: string;
  ativo: boolean;
  disponivel: boolean;
  em_servico: boolean;
};

export default function AdminMotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [motoristaId, setMotoristaId] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [valorMotorista, setValorMotorista] = useState("");
  const [observacao, setObservacao] = useState("");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  const motoristasAprovadosLivres = useMemo(() => {
    return motoristas.filter((m) => {
      return (
        String(m.status || "").toLowerCase().trim() === "aprovado" &&
        m.ativo === true &&
        m.disponivel === true &&
        m.em_servico !== true
      );
    });
  }, [motoristas]);

  async function carregarMotoristas() {
    setMsg("");
    setCarregando(true);

    try {
      const res = await fetch("/api/motoristas?scope=admin", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao carregar motoristas.");
        setMotoristas([]);
        return;
      }

      setMotoristas(Array.isArray(data.motoristas) ? data.motoristas : []);
    } catch (error) {
      console.error("ERRO AO CARREGAR MOTORISTAS:", error);
      setMsg("Erro inesperado ao carregar motoristas.");
      setMotoristas([]);
    } finally {
      setCarregando(false);
    }
  }

  function validarConvite() {
    if (!motoristaId) return "Selecione um motorista aprovado/livre.";
    if (!origem.trim()) return "Informe a origem do serviço.";
    if (!destino.trim()) return "Informe o destino do serviço.";
    if (!valorServico.trim()) return "Informe o valor do serviço.";
    if (!valorMotorista.trim()) return "Informe o valor a pagar ao motorista.";
    return "";
  }

  async function criarConviteIndividual() {
    setMsg("");

    const erro = validarConvite();

    if (erro) {
      setMsg(erro);
      return;
    }

    const motoristaSelecionado = motoristasAprovadosLivres.find(
      (m) => m.id === motoristaId
    );

    try {
      const res = await fetch("/api/convites", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motorista_id: motoristaId,
          motorista_nome: motoristaSelecionado?.nome || null,
          origem,
          destino,
          valor_servico: valorServico,
          valor_motorista: valorMotorista,
          observacao: observacao || "Convite criado pelo admin Aurora.",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao criar convite.");
        return;
      }

      setMsg("Convite criado com operação, valores e motorista vinculado.");
      setMotoristaId("");
      setOrigem("");
      setDestino("");
      setValorServico("");
      setValorMotorista("");
      setObservacao("");

      await carregarMotoristas();
    } catch (error) {
      console.error("ERRO AO CRIAR CONVITE:", error);
      setMsg("Erro inesperado ao criar convite.");
    }
  }

  useEffect(() => {
    carregarMotoristas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <section className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-300 font-semibold">
            Aurora Motoristas
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Convidar motorista para serviço
          </h1>

          <p className="text-slate-300 mt-2">
            Defina origem, destino, valor do serviço e valor a pagar ao
            motorista antes do aceite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Motoristas aprovados/livres
            </p>
            <h2 className="text-4xl font-bold mt-2">
              {motoristasAprovadosLivres.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total na base</p>
            <h2 className="text-4xl font-bold mt-2">{motoristas.length}</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status da leitura</p>
            <h2 className="text-lg font-bold mt-3">
              {carregando ? "Carregando..." : "API admin ativa"}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Convite</p>
            <h2 className="text-lg font-bold mt-3">Com valores</h2>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-bold">Dados do serviço</h2>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Motorista aprovado/livre
            </label>

            <select
              value={motoristaId}
              onChange={(e) => setMotoristaId(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white"
            >
              <option value="">Selecione</option>

              {motoristasAprovadosLivres.map((motorista) => (
                <option key={motorista.id} value={motorista.id}>
                  {motorista.nome} - CPF {motorista.cpf}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Origem
              </label>

              <input
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Ex.: Belo Horizonte - MG"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Destino
              </label>

              <input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex.: Canaã dos Carajás - PA"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Valor do serviço / cliente
              </label>

              <input
                value={valorServico}
                onChange={(e) => setValorServico(e.target.value)}
                placeholder="Ex.: 3000,00"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Valor a pagar ao motorista
              </label>

              <input
                value={valorMotorista}
                onChange={(e) => setValorMotorista(e.target.value)}
                placeholder="Ex.: 2200,00"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Observação para o motorista
            </label>

            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex.: Serviço de mobilização com saída pela manhã."
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
              onClick={criarConviteIndividual}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 transition"
            >
              Criar convite com serviço
            </button>

            <button
              type="button"
              onClick={carregarMotoristas}
              className="rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-bold px-5 py-3 transition"
            >
              Atualizar motoristas
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-4">
            Motoristas aprovados/livres
          </h2>

          {motoristasAprovadosLivres.length === 0 ? (
            <p className="text-slate-400">
              Nenhum motorista aprovado/livre encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {motoristasAprovadosLivres.map((motorista) => (
                <div
                  key={motorista.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-lg">{motorista.nome}</p>

                      <p className="text-sm text-slate-400">
                        CPF: {motorista.cpf} | Telefone:{" "}
                        {motorista.telefone || "não informado"}
                      </p>

                      <p className="text-sm text-slate-400">
                        Cidade: {motorista.cidade || "não informado"} -{" "}
                        {motorista.estado || "UF"}
                      </p>

                      <p className="text-sm text-emerald-300 mt-1">
                        aprovado • ativo • disponível • livre
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMotoristaId(motorista.id)}
                      className="rounded-xl border border-cyan-600 text-cyan-200 hover:bg-cyan-950 px-4 py-2 font-semibold transition"
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-4">
            Todos os motoristas recebidos da API
          </h2>

          <div className="space-y-3">
            {motoristas.map((motorista) => (
              <div
                key={motorista.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-bold">{motorista.nome}</p>

                <p className="text-sm text-slate-400">
                  status: {motorista.status} | ativo:{" "}
                  {String(motorista.ativo)} | disponível:{" "}
                  {String(motorista.disponivel)} | em serviço:{" "}
                  {String(motorista.em_servico)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
