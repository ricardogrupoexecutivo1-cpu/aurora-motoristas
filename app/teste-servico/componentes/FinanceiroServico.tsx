"use client";

import { useState } from "react";

type Props = {
  serviceId: string;
  driverId?: string | null;
  onSaved?: () => void;
};

export default function FinanceiroServico({ serviceId, driverId, onSaved }: Props) {
  const [entryType, setEntryType] = useState("adiantamento_motorista");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function salvarLancamento(e: React.FormEvent) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!description || !amount) {
      setErro("Informe descrição e valor.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/servicos/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          driver_id: driverId || null,
          entry_type: entryType,
          description,
          amount,
          payment_method: paymentMethod,
          receipt_url: receiptUrl,
          notes,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Erro ao salvar lançamento.");
      }

      setSucesso("Lançamento financeiro salvo com sucesso.");
      setDescription("");
      setAmount("");
      setPaymentMethod("");
      setReceiptUrl("");
      setNotes("");

      onSaved?.();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="rounded-2xl bg-emerald-50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
          Financeiro do serviço
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-950">
          Lançar adiantamento ou despesa
        </h2>
      </div>

      <form onSubmit={salvarLancamento} className="mt-6 space-y-4">
        <select
          value={entryType}
          onChange={(e) => setEntryType(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        >
          <option value="adiantamento_motorista">Adiantamento motorista</option>
          <option value="despesa_motorista">Despesa motorista</option>
          <option value="pagamento_motorista">Pagamento motorista</option>
          <option value="recebimento_cliente">Recebimento cliente</option>
          <option value="ajuste_manual">Ajuste manual</option>
        </select>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        />

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor. Ex.: 150,00"
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        />

        <input
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          placeholder="Forma de pagamento"
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        />

        <input
          value={receiptUrl}
          onChange={(e) => setReceiptUrl(e.target.value)}
          placeholder="Link do comprovante"
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações"
          className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-950"
        />

        {erro && (
          <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-700">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">
            {sucesso}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-500 p-4 font-black text-white"
        >
          {loading ? "Salvando..." : "Salvar lançamento financeiro"}
        </button>
      </form>
    </section>
  );
}