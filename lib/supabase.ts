import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          company_id: string | null;
          is_verified: boolean;
          is_blocked: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      am_clients: {
        Row: {
          id: string;
          company_id: string | null;
          user_id: string | null;
          nome: string;
          tipo_pessoa: string | null;
          documento: string | null;
          email: string | null;
          telefone: string | null;
          endereco: string | null;
          cidade: string | null;
          estado: string | null;
          cep: string | null;
          financeiro_email: string | null;
          responsavel_financeiro: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      am_motoristas: {
        Row: {
          id: string;
          company_id: string | null;
          user_id: string | null;
          nome: string;
          cpf: string | null;
          email: string | null;
          telefone: string | null;
          cidade: string | null;
          estado: string | null;
          base_operacional: string | null;
          status: string;
          ativo: boolean;
          bloqueado: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      am_rides: {
        Row: {
          id: string;
          company_id: string | null;
          client_id: string | null;
          motorista_id: string | null;
          vehicle_id: string | null;
          status: string;
          origem_endereco: string;
          origem_lat: number | null;
          origem_lng: number | null;
          destino_endereco: string;
          destino_lat: number | null;
          destino_lng: number | null;
          paradas: unknown;
          distancia_km: number;
          duracao_estimada_min: number;
          duracao_real_min: number | null;
          valor_base: number;
          valor_km: number;
          valor_tempo: number;
          valor_pedagio: number;
          valor_adicional: number;
          desconto: number;
          valor_total: number;
          taxa_plataforma_percentual: number;
          taxa_plataforma_valor: number;
          valor_motorista: number;
          forma_pagamento: string;
          pagamento_status: string;
          categoria: string;
          solicitado_em: string;
          aceito_em: string | null;
          iniciado_em: string | null;
          finalizado_em: string | null;
          cancelado_em: string | null;
          cancelado_por: string | null;
          motivo_cancelamento: string | null;
          codigo_verificacao: string | null;
          compartilhamento_rota_ativo: boolean;
          link_compartilhamento: string | null;
          emergencia_acionada: boolean;
          observacoes_cliente: string | null;
          observacoes_motorista: string | null;
          observacoes_admin: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      am_ratings: {
        Row: {
          id: string;
          ride_id: string;
          service_id: string | null;
          avaliador_tipo: string;
          avaliador_client_id: string | null;
          avaliador_motorista_id: string | null;
          avaliado_client_id: string | null;
          avaliado_motorista_id: string | null;
          nota: number;
          comentario: string | null;
          tags: unknown;
          resposta: string | null;
          respondido_em: string | null;
          visivel: boolean;
          moderado: boolean;
          moderado_por: string | null;
          moderado_em: string | null;
          motivo_moderacao: string | null;
          created_at: string;
        };
      };
      am_wallets: {
        Row: {
          id: string;
          user_id: string | null;
          motorista_id: string | null;
          client_id: string | null;
          saldo_disponivel: number;
          saldo_bloqueado: number;
          total_ganhos: number;
          total_saques: number;
          total_corridas: number;
          banco_codigo: string | null;
          banco_nome: string | null;
          agencia: string | null;
          conta: string | null;
          tipo_conta: string | null;
          cpf_titular: string | null;
          nome_titular: string | null;
          chave_pix: string | null;
          tipo_chave_pix: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      am_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          ride_id: string | null;
          service_id: string | null;
          tipo: string;
          categoria: string;
          valor: number;
          saldo_anterior: number;
          saldo_posterior: number;
          descricao: string;
          referencia: string | null;
          status: string;
          metadata: unknown;
          created_at: string;
        };
      };
      am_vehicles: {
        Row: {
          id: string;
          motorista_id: string;
          marca: string;
          modelo: string;
          ano: number;
          cor: string;
          placa: string;
          renavam: string | null;
          categoria: string;
          capacidade_passageiros: number;
          ar_condicionado: boolean;
          wifi: boolean;
          agua_disponivel: boolean;
          foto_url: string | null;
          documento_url: string | null;
          ativo: boolean;
          verificado: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      am_notifications: {
        Row: {
          id: string;
          user_id: string | null;
          motorista_id: string | null;
          client_id: string | null;
          tipo: string;
          titulo: string;
          mensagem: string;
          data: unknown;
          lida: boolean;
          lida_em: string | null;
          acao_url: string | null;
          created_at: string;
        };
      };
    };
  };
};
