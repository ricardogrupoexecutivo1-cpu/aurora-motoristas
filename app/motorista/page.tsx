"use client";

import { useState } from "react";

type Convite = {
  id: string;
  motorista_id: string;
  motorista_nome: string | null;
  observacao: string;
  status: "pendente" | "aceito" | "recusado";
  created_at: string;
  updated_at?: string;
};

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  status: string;
  ativo: boolean;
  disponivel: boolean;
  em_servico: boolean;
};

type Servico = {
  id: string;
  convite_id: string;
  motorista_id: string;
  motorista_nome: string | null;
  origem: string;
  destino: string;
  valor_servico: number;
  valor_motorista: number;
  adiantamentos: number;
  despesas: number;
  status: "em_andamento" | "finalizado" | "cancelado";
  created_at: string;
};

export default function PainelMotorista() {
  const [cpf, setCpf] = useState("");
  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [convites, setConvites] = useState<Convite[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarMotorista() {
    setMsg("");
    setCarregando(true);
    setMotorista(null);
    setConvites([]);
    setServicos([]);

    try {
      const cpfLimpo = cpf.replace(/\D/g, "");

      const res = await fetch("/api/motoristas?scope=admin", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao buscar motorista.");
        return;
      }

      const encontrado = Array.isArray(data.motoristas)
        ? data.motoristas.find((m: Motorista) => m.cpf === cpfLimpo)
        : null;

      if (!encontrado) {
        setMsg("Motorista não encontrado.");
        return;
      }

      setMotorista(encontrado);
      await buscarConvites(encontrado.id);
      await buscarServicos(encontrado.id);
    } catch (error) {
      console.error("ERRO AO BUSCAR MOTORISTA:", error);
      setMsg("Erro inesperado ao buscar motorista.");
    } finally {
      setCarregando(false);
    }
  }

  async function buscarConvites(motoristaId: string) {
    try {
      const res = await fetch(`/api/convites?motorista_id=${motoristaId}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao carregar convites.");
        return;
      }

      setConvites(Array.isArray(data.convites) ? data.convites : []);
    } catch (error) {
      console.error("ERRO AO BUSCAR CONVITES:", error);
      setMsg("Erro inesperado ao carregar convites.");
    }
  }

  async function buscarServicos(motoristaId: string) {
    try {
      const res = await fetch(`/api/servicos?motorista_id=${motoristaId}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao carregar serviços.");
        return;
      }

      setServicos(Array.isArray(data.servicos) ? data.servicos : []);
    } catch (error) {
      console.error("ERRO AO BUSCAR SERVIÇOS:", error);
      setMsg("Erro inesperado ao carregar serviços.");
    }
  }

  async function responderConvite(
    conviteId: string,
    status: "aceito" | "recusado"
  ) {
    setMsg("");

    try {
      const res = await fetch("/api/convites", {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          convite_id: conviteId,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMsg(data?.message || "Erro ao responder convite.");
        return;
      }

      setMsg(data.message || "Convite atualizado com sucesso.");

      if (motorista?.id) {
        await buscarConvites(motorista.id);
        await buscarServicos(motorista.id);
      }
    } catch (error) {
      console.error("ERRO AO RESPONDER CONVITE:", error);
      setMsg("Erro inesperado ao responder convite.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <section className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-cyan-300 font-semibold">
            Aurora Motoristas
          </p>

          <h1 className="text-3xl font-bold mt-2">Painel do Motorista</h1>

          <p className="text-slate-300 mt-2">
            Entre com seu CPF para visualizar convites e operações vinculadas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Digite seu CPF
            </label>

            <input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Ex.: 03758191696"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={buscarMotorista}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl font-bold transition"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          {msg && (
            <div className="rounded-xl border border-cyan-700 bg-cyan-950/40 p-4 text-cyan-100">
              {msg}
            </div>
          )}
        </div>

        {motorista && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">{motorista.nome}</h2>

            <p className="text-sm text-slate-400 mt-1">
              CPF: {motorista.cpf}
            </p>

            <p className="text-sm text-emerald-300 mt-2">
              status: {motorista.status} | ativo: {String(motorista.ativo)} |
              disponível: {String(motorista.disponivel)} | em serviço:{" "}
              {String(motorista.em_servico)}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-4">Serviço atual</h2>

          {servicos.length === 0 ? (
            <p className="text-slate-400">
              Nenhum serviço vinculado no momento.
            </p>
          ) : (
            <div className="space-y-4">
              {servicos.map((servico) => (
                <div
                  key={servico.id}
                  className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-5"
                >
                  <p className="font-bold text-lg text-emerald-300">
                    Serviço em andamento
                  </p>

                  <p className="text-slate-300 mt-2">
                    Origem: {servico.origem}
                  </p>

                  <p className="text-slate-300">
                    Destino: {servico.destino}
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    Criado em:{" "}
                    {new Date(servico.created_at).toLocaleString("pt-BR")}
                  </p>

                  <p className="text-yellow-300 font-bold mt-2">
                    Status: {servico.status}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    Dados financeiros visíveis apenas para o admin.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-4">Convites disponíveis</h2>

          {convites.length === 0 ? (
            <p className="text-slate-400">Nenhum convite no momento.</p>
          ) : (
            <div className="space-y-4">
              {convites.map((convite) => (
                <div
                  key={convite.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3"
                >
                  <div>
                    <p className="font-bold text-lg">Convite recebido</p>

                    <p className="text-slate-300 mt-1">
                      {convite.observacao || "Sem observação."}
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      Criado em:{" "}
                      {new Date(convite.created_at).toLocaleString("pt-BR")}
                    </p>

                    <p
                      className={
                        convite.status === "aceito"
                          ? "text-emerald-300 font-bold mt-2"
                          : convite.status === "recusado"
                          ? "text-red-300 font-bold mt-2"
                          : "text-yellow-300 font-bold mt-2"
                      }
                    >
                      Status: {convite.status}
                    </p>
                  </div>

                  {convite.status === "pendente" && (
                    <div className="flex flex-col md:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => responderConvite(convite.id, "aceito")}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 font-bold transition"
                      >
                        Aceitar convite
                      </button>

                      <button
                        type="button"
                        onClick={() => responderConvite(convite.id, "recusado")}
                        className="rounded-xl bg-red-500 hover:bg-red-400 text-white px-5 py-3 font-bold transition"
                      >
                        Recusar convite
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
