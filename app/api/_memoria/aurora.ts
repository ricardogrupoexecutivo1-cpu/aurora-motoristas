export type Convite = {
  id: string;
  motorista_id: string;
  motorista_nome: string | null;
  cliente_nome: string;
  cliente_contato: string;
  local_apresentacao: string;
  data_hora_apresentacao: string;
  observacao: string;
  origem: string;
  destino: string;
  valor_servico: number;
  valor_motorista: number;
  status: "pendente" | "aceito" | "recusado";
  created_at: string;
  updated_at: string;
};

export type Servico = {
  id: string;
  convite_id: string;
  motorista_id: string;
  motorista_nome: string | null;
  cliente_nome: string;
  cliente_contato: string;
  local_apresentacao: string;
  data_hora_apresentacao: string;
  origem: string;
  destino: string;
  valor_servico: number;
  valor_motorista: number;
  adiantamentos: number;
  despesas: number;
  status: "em_andamento" | "finalizado" | "cancelado";
  financeiro_visivel_admin: true;
  created_at: string;
  updated_at: string;
};

export const memoriaAurora = globalThis as typeof globalThis & {
  auroraConvites?: Convite[];
  auroraServicos?: Servico[];
};

if (!memoriaAurora.auroraConvites) memoriaAurora.auroraConvites = [];
if (!memoriaAurora.auroraServicos) memoriaAurora.auroraServicos = [];

export const convites = memoriaAurora.auroraConvites;
export const servicos = memoriaAurora.auroraServicos;
