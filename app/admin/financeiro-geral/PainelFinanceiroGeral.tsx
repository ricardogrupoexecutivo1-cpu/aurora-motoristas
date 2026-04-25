"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  service_code?: string | null;
  title?: string | null;
  status?: string | null;
  client_name?: string | null;
  driver_name?: string | null;
  origin?: string | null;
  destination?: string | null;
  client_amount?: number | null;
  driver_amount?: number | null;
  expenses_amount?: number | null;
  platform_commission_percent?: number | null;
  created_at?: string | null;
};

type Resumo = {
  total_servicos: number;
  total_cliente: number;
  total_motorista: number;
  total_despesas: number;
  total_comissao: number;
  lucro_estimado: number;
};

function dinheiro(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

export default function PainelFinanceiroGeral() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        setErro("");

        const res = await fetch("/api/admin/financeiro-geral");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Erro ao carregar painel.");
        }

        setResumo(json.resumo);
        setServices(json.services || []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar painel."
        );
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
            Aurora Motoristas • Área interna administrativa
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Painel Financeiro Geral
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Visão consolidada de serviços, faturamento, custos, comissão e lucro
            estimado da operação.
          </p>
        </div>

        {loading && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            Carregando painel financeiro...
          </div>
        )}

        {erro && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 shadow-xl">
            {erro}
          </div>
        )}

        {resumo && (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card titulo="Serviços" valor={String(resumo.total_servicos)} />
              <Card titulo="Total cliente" valor={dinheiro(resumo.total_cliente)} />
              <Card titulo="Motoristas" valor={dinheiro(resumo.total_motorista)} />
              <Card titulo="Despesas" valor={dinheiro(resumo.total_despesas)} />
              <Card titulo="Comissão" valor={dinheiro(resumo.total_comissao)} />
              <Card
                titulo="Lucro estimado"
                valor={dinheiro(resumo.lucro_estimado)}
                destaque
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-xl font-black">Serviços</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Lista dos serviços cadastrados no Supabase.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="p-4">Código</th>
                      <th className="p-4">Rota</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Motorista</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Valor cliente</th>
                      <th className="p-4">Valor motorista</th>
                      <th className="p-4">Despesas</th>
                      <th className="p-4">Lucro estimado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => {
                      const cliente = Number(service.client_amount || 0);
                      const motorista = Number(service.driver_amount || 0);
                      const despesas = Number(service.expenses_amount || 0);
                      const percentual = Number(
                        service.platform_commission_percent || 5
                      );
                      const comissao = cliente * (percentual / 100);
                      const lucro = cliente - motorista - despesas - comissao;

                      return (
                        <tr
                          key={service.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="p-4 font-semibold">
                            {service.service_code || "Sem código"}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">
                              {service.origin || "Origem"} →{" "}
                              {service.destination || "Destino"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {service.title || "Sem título"}
                            </div>
                          </td>
                          <td className="p-4">
                            {service.client_name || "Não informado"}
                          </td>
                          <td className="p-4">
                            {service.driver_name || "Não informado"}
                          </td>
                          <td className="p-4">
                            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                              {service.status || "sem status"}
                            </span>
                          </td>
                          <td className="p-4 font-bold">{dinheiro(cliente)}</td>
                          <td className="p-4">{dinheiro(motorista)}</td>
                          <td className="p-4">{dinheiro(despesas)}</td>
                          <td className="p-4 font-black text-emerald-700">
                            {dinheiro(lucro)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Card({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-xl ${
        destaque
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {titulo}
      </p>
      <h3
        className={`mt-2 text-2xl font-black ${
          destaque ? "text-emerald-700" : "text-slate-950"
        }`}
      >
        {valor}
      </h3>
    </div>
  );
}