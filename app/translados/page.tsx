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

const initialTransfers: TransferItem[] = [
  {
    id: "TRA-BR-0001",
    empresa: "Operação Nacional Aurora",
    locadora: "Rede Brasil Frotas",
    origem: "São Paulo - SP",
    destino: "Rio de Janeiro - RJ",
    ufOrigem: "SP",
    ufDestino: "RJ",
    cliente: "Transferência entre bases",
    motorista: "Carlos Henrique",
    motoristaReserva: "João Pedro",
    horarioPrevisto: "10/04/2026 08:30",
    horarioAtualizado: "10/04/2026 09:00",
    valorTransfer: 1800,
    valorMotorista: 900,
    despesas: 220,
    status: "Em deslocamento",
    observacao: "Operação interestadual",
  },
  {
    id: "TRA-BR-0002",
    empresa: "Grupo Logístico",
    locadora: "Frotas Brasil",
    origem: "Belo Horizonte - MG",
    destino: "Brasília - DF",
    ufOrigem: "MG",
    ufDestino: "DF",
    cliente: "Mobilização de equipe",
    motorista: "Maria Fernanda",
    motoristaReserva: "Carlos Henrique",
    horarioPrevisto: "10/04/2026 11:00",
    horarioAtualizado: "10/04/2026 11:00",
    valorTransfer: 2100,
    valorMotorista: 1000,
    despesas: 180,
    status: "Agendado",
    observacao: "Operação programada",
  },
];

const statusOptions: Status[] = [
  "Agendado",
  "Em deslocamento",
  "Aguardando passageiro",
  "Concluído",
  "Atrasado",
  "Cancelado",
];

const emptyForm: Omit<TransferItem, "id"> = {
  empresa: "",
  locadora: "",
  origem: "",
  destino: "",
  ufOrigem: "",
  ufDestino: "",
  cliente: "",
  motorista: "",
  motoristaReserva: "",
  horarioPrevisto: "",
  horarioAtualizado: "",
  valorTransfer: 0,
  valorMotorista: 0,
  despesas: 0,
  status: "Agendado",
  observacao: "",
};

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function statusClass(status: Status) {
  if (status === "Concluído") return "bg-success/15 text-success border-success/30";
  if (status === "Em deslocamento") return "bg-warning/15 text-warning border-warning/30";
  if (status === "Aguardando passageiro") return "bg-primary/15 text-primary border-primary/30";
  if (status === "Atrasado") return "bg-destructive/15 text-destructive border-destructive/30";
  if (status === "Cancelado") return "bg-secondary text-muted-foreground border-border";
  return "bg-primary/15 text-primary border-primary/30";
}

export default function TransladosPage() {
  const [data, setData] = useState<TransferItem[]>([]);
  const [form, setForm] = useState<Omit<TransferItem, "id">>(emptyForm);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"Todos" | Status>("Todos");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(initialTransfers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransfers));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const filtrados = useMemo(() => {
    return data.filter((item) => {
      const texto = `${item.id} ${item.empresa} ${item.locadora} ${item.origem} ${item.destino} ${item.cliente} ${item.motorista} ${item.ufOrigem} ${item.ufDestino}`.toLowerCase();

      const passaBusca = texto.includes(busca.toLowerCase());
      const passaStatus =
        statusFiltro === "Todos" || item.status === statusFiltro;

      return passaBusca && passaStatus;
    });
  }, [data, busca, statusFiltro]);

  const resumo = useMemo(() => {
    const receita = filtrados.reduce((acc, item) => acc + item.valorTransfer, 0);
    const custo = filtrados.reduce(
      (acc, item) => acc + item.valorMotorista + item.despesas,
      0
    );
    const lucro = receita - custo;
    const margem = receita > 0 ? (lucro / receita) * 100 : 0;

    return {
      receita,
      custo,
      lucro,
      margem,
      total: filtrados.length,
      andamento: filtrados.filter((i) => i.status === "Em deslocamento").length,
      concluidos: filtrados.filter((i) => i.status === "Concluído").length,
      atrasados: filtrados.filter((i) => i.status === "Atrasado").length,
    };
  }, [filtrados]);

  function addTransfer() {
    if (!form.origem || !form.destino || !form.motorista) {
      alert("Preencha origem, destino e motorista.");
      return;
    }

    const next: TransferItem = {
      ...form,
      id: `TRA-BR-${String(data.length + 1).padStart(4, "0")}`,
      ufOrigem: form.ufOrigem.toUpperCase(),
      ufDestino: form.ufDestino.toUpperCase(),
      valorTransfer: Number(form.valorTransfer),
      valorMotorista: Number(form.valorMotorista),
      despesas: Number(form.despesas),
    };

    setData([next, ...data]);
    setForm(emptyForm);
  }

  function resetDemo() {
    setData(initialTransfers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransfers));
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
                Aurora Motoristas • Operação Nacional
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text mb-4">
                🚛 FROTAS BRASIL
              </h1>

              <p className="text-muted-foreground max-w-3xl leading-relaxed">
                Painel nacional para mobilização, desmobilização, translados,
                transferências de veículos, passageiros, bases e operações
                interestaduais em todo o Brasil.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/operacoes-brasil"
                className="px-5 py-3 rounded-xl gradient-premium text-white font-bold shadow-xl btn-premium"
              >
                Operações Brasil
              </Link>

              <Link
                href="/solicitar"
                className="px-5 py-3 rounded-xl bg-secondary border border-border font-semibold hover:bg-secondary/80 transition-colors"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
          <ResumoCard title="Operações" value={resumo.total} />
          <ResumoCard title="Receita" value={money(resumo.receita)} />
          <ResumoCard title="Custo" value={money(resumo.custo)} />
          <ResumoCard title="Lucro" value={money(resumo.lucro)} highlight="success" />
          <ResumoCard title="Margem" value={`${resumo.margem.toFixed(1)}%`} />
          <ResumoCard title="Em rota" value={resumo.andamento} />
          <ResumoCard title="Concluídos" value={resumo.concluidos} />
          <ResumoCard title="Atrasados" value={resumo.atrasados} highlight="danger" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-lg">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2 className="text-xl font-black">Nova operação nacional</h2>
              <p className="text-sm text-muted-foreground">
                Cadastre uma operação de frota, translado, mobilização ou transferência.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <input className="input" placeholder="Empresa" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
            <input className="input" placeholder="Locadora" value={form.locadora} onChange={(e) => setForm({ ...form, locadora: e.target.value })} />
            <input className="input" placeholder="Origem" value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} />
            <input className="input" placeholder="UF origem" value={form.ufOrigem} onChange={(e) => setForm({ ...form, ufOrigem: e.target.value })} />
            <input className="input" placeholder="Destino" value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} />
            <input className="input" placeholder="UF destino" value={form.ufDestino} onChange={(e) => setForm({ ...form, ufDestino: e.target.value })} />
            <input className="input" placeholder="Cliente / operação" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            <input className="input" placeholder="Motorista" value={form.motorista} onChange={(e) => setForm({ ...form, motorista: e.target.value })} />
            <input className="input" placeholder="Motorista reserva" value={form.motoristaReserva} onChange={(e) => setForm({ ...form, motoristaReserva: e.target.value })} />
            <input className="input" placeholder="Horário previsto" value={form.horarioPrevisto} onChange={(e) => setForm({ ...form, horarioPrevisto: e.target.value })} />
            <input className="input" placeholder="Horário atualizado" value={form.horarioAtualizado} onChange={(e) => setForm({ ...form, horarioAtualizado: e.target.value })} />

            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input className="input" type="number" placeholder="Valor do transfer" value={form.valorTransfer || ""} onChange={(e) => setForm({ ...form, valorTransfer: Number(e.target.value) })} />
            <input className="input" type="number" placeholder="Valor motorista" value={form.valorMotorista || ""} onChange={(e) => setForm({ ...form, valorMotorista: Number(e.target.value) })} />
            <input className="input" type="number" placeholder="Despesas" value={form.despesas || ""} onChange={(e) => setForm({ ...form, despesas: Number(e.target.value) })} />
          </div>

          <textarea
            className="input mt-3 min-h-24"
            placeholder="Observações da operação"
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          />

          <div className="flex gap-3 flex-wrap mt-4">
            <button
              type="button"
              onClick={addTransfer}
              className="px-6 py-3 rounded-xl gradient-premium text-white font-bold shadow-xl btn-premium"
            >
              Cadastrar operação
            </button>

            <button
              type="button"
              onClick={resetDemo}
              className="px-6 py-3 rounded-xl bg-secondary border border-border font-bold hover:bg-secondary/80 transition-colors"
            >
              Restaurar demo
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_240px] gap-3 mb-6">
          <input
            className="input"
            placeholder="Pesquisar por cidade, UF, motorista, cliente, locadora..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            className="input"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as "Todos" | Status)}
          >
            <option>Todos</option>
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          {filtrados.map((item) => {
            const custo = item.valorMotorista + item.despesas;
            const lucro = item.valorTransfer - custo;

            return (
              <article key={item.id} className="bg-card border border-border rounded-2xl p-5 shadow-lg hover:border-primary/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-primary tracking-[0.18em] uppercase mb-2">
                      {item.id}
                    </p>

                    <h3 className="text-xl font-black mb-1">
                      {item.origem} → {item.destino}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {item.ufOrigem} → {item.ufDestino} • {item.cliente}
                    </p>
                  </div>

                  <span className={`w-fit px-3 py-1.5 rounded-full border text-xs font-black ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 text-sm">
                  <Info label="Empresa" value={item.empresa || "Não informada"} />
                  <Info label="Locadora" value={item.locadora || "Não informada"} />
                  <Info label="Motorista" value={item.motorista} />
                  <Info label="Reserva" value={item.motoristaReserva || "Sem reserva"} />
                  <Info label="Previsto" value={item.horarioPrevisto || "Não informado"} />
                  <Info label="Atualizado" value={item.horarioAtualizado || "Não informado"} />
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
                  <ResumoCard title="Receita" value={money(item.valorTransfer)} compact />
                  <ResumoCard title="Custo" value={money(custo)} compact />
                  <ResumoCard
                    title="Lucro"
                    value={money(lucro)}
                    highlight={lucro >= 0 ? "success" : "danger"}
                    compact
                  />
                </div>

                <p className="mt-4 text-sm text-muted-foreground bg-background border border-border rounded-xl p-4">
                  {item.observacao || "Sem observação registrada."}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ResumoCard({
  title,
  value,
  highlight,
  compact,
}: {
  title: string;
  value: string | number;
  highlight?: "success" | "danger";
  compact?: boolean;
}) {
  const color =
    highlight === "success"
      ? "text-success"
      : highlight === "danger"
        ? "text-destructive"
        : "text-foreground";

  return (
    <div className={`bg-card border border-border rounded-2xl ${compact ? "p-4" : "p-5"} shadow-lg`}>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
        {title}
      </p>
      <h2 className={`font-black ${compact ? "text-lg" : "text-xl"} ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border rounded-xl p-3">
      <p className="text-xs text-muted-foreground uppercase font-bold">
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
