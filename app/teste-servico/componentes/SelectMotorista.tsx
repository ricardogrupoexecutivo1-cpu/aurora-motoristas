"use client";

import { useEffect, useState } from "react";

type Driver = {
  id: string;
  nome: string;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
};

type SelectMotoristaProps = {
  value: string;
  onChange: (driverId: string) => void;
};

export default function SelectMotorista({
  value,
  onChange,
}: SelectMotoristaProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarMotoristas() {
      try {
        setLoading(true);
        setErro("");

        const res = await fetch("/api/motoristas/aprovados");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Erro ao carregar motoristas.");
        }

        setDrivers(json.drivers || []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar motoristas."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarMotoristas();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white">
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        Motorista aprovado
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
      >
        <option value="">
          {loading ? "Carregando motoristas..." : "Selecione um motorista"}
        </option>

        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.nome}
            {driver.cidade ? ` • ${driver.cidade}` : ""}
            {driver.estado ? `/${driver.estado}` : ""}
          </option>
        ))}
      </select>

      {erro && (
        <p className="mt-3 rounded-xl border border-red-800 bg-red-950 p-3 text-sm text-red-200">
          {erro}
        </p>
      )}

      {!loading && !erro && drivers.length === 0 && (
        <p className="mt-3 text-sm text-yellow-300">
          Nenhum motorista aprovado encontrado.
        </p>
      )}

      {value && (
        <p className="mt-3 text-xs text-cyan-300">
          driver_id selecionado: {value}
        </p>
      )}
    </div>
  );
}