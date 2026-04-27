"use client";

import { useEffect, useState } from "react";

export default function PainelFinanceiro({ serviceId }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const res = await fetch(
      `/api/servicos/financeiro/resumo?service_id=${serviceId}`
    );
    const json = await res.json();

    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    if (serviceId) carregar();
  }, [serviceId]);

  if (!serviceId) return null;

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-3xl shadow">
        Carregando financeiro...
      </div>
    );
  }

  const r = data?.resumo || {};

  return (
    <div className="mt-6 bg-white border p-6 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        📊 Resumo Financeiro
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Card title="Valor cliente" value={r.valor_cliente} />
        <Card title="Recebido cliente" value={r.total_recebimento_cliente} />

        <Card title="Motorista base" value={r.valor_motorista_base} />
        <Card title="Adiantamentos" value={r.total_adiantamentos} />

        <Card title="Despesas" value={r.despesas_totais} />
        <Card title="Comissão" value={r.comissao_plataforma} />

        <Card title="Saldo cliente" value={r.saldo_receber_cliente} />
        <Card
          title="Lucro operacional"
          value={r.lucro_operacional}
          destaque
        />

      </div>
    </div>
  );
}

function Card({ title, value, destaque }: any) {
  return (
    <div
      className={`p-4 rounded-2xl border ${
        destaque ? "bg-green-100 border-green-400" : "bg-slate-50"
      }`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      <h3 className="text-lg font-bold text-slate-900">
        R$ {Number(value || 0).toFixed(2)}
      </h3>
    </div>
  );
}