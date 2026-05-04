"use client";

import { useState } from "react";
import SelectMotorista from "./SelectMotorista";
import FinanceiroServico from "./FinanceiroServico";
import PainelFinanceiro from "./PainelFinanceiro";

export default function CriarServico() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [valor, setValor] = useState("");
  const [valorMotorista, setValorMotorista] = useState("");
  const [driverId, setDriverId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!driverId) {
      setErro("Selecione um motorista aprovado.");
      return;
    }

    if (!origem || !destino || !valor || !valorMotorista) {
      setErro("Preencha origem, destino, valor do cliente e valor do motorista.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/servicos/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem,
          destino,
          valor: Number(String(valor).replace(",", ".")),
          valor_motorista: Number(String(valorMotorista).replace(",", ".")),
          driver_id: driverId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Erro ao criar serviço.");
      }

      setServiceId(json.service?.id || "");
      setRefreshKey((v) => v + 1);
      setSucesso("Serviço criado com sucesso. Financeiro liberado.");
      setOrigem("");
      setDestino("");
      setValor("");
      setValorMotorista("");
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro inesperado ao criar serviço."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="rounded-2xl bg-cyan-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
            Aurora Motoristas • Área interna administrativa
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Criar Serviço
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Tela restrita ao admin. Aqui aparecem valor do cliente, valor do motorista,
            comissão e lucro operacional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Origem"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

          <input
            placeholder="Destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

          <input
            placeholder="Valor cliente. Ex.: 3000,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

          <input
            placeholder="Valor motorista. Ex.: 1800,00"
            value={valorMotorista}
            onChange={(e) => setValorMotorista(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

          <SelectMotorista value={driverId} onChange={setDriverId} />

          {erro && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 p-4 font-black text-white shadow-lg transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Criando serviço..." : "Criar Serviço"}
          </button>
        </form>
      </section>

      <div className="mx-auto max-w-3xl">
        {serviceId ? (
          <>
            <PainelFinanceiro
              serviceId={serviceId}
              key={`painel-${serviceId}-${refreshKey}`}
            />

            <FinanceiroServico
              serviceId={serviceId}
              driverId={driverId}
              onSaved={() => setRefreshKey((v) => v + 1)}
            />
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-xl">
            Crie um serviço para liberar painel e lançamentos financeiros.
          </div>
        )}
      </div>
    </main>
  );
}