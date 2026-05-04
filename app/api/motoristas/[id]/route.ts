import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
} from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: Record<string, unknown> } =
    await req.json();

  const systemPrompt = `Você é a MIA, assistente virtual da Aurora Motoristas.

REGRAS PRINCIPAIS:
- Sempre responda em português brasileiro.
- Não prometa seguro. Seguro, quando existir, é responsabilidade do cliente/contratante.
- Não exponha informações internas de motorista para cliente.
- Cliente vê somente a própria solicitação, nunca dados de outros clientes.
- Motorista vê somente os próprios serviços ativos/pendentes.
- Depois de pago/finalizado, o serviço sai da visão do motorista e fica no histórico/admin.
- Somente admin master vê tudo.
- A operação pode ser por diária, por valor por KM ou por valor fechado do serviço.
- A cobrança pode ter KM com reembolso ou sem reembolso.
- O pagamento ao motorista pode ser por valor do serviço.
- Adiantamento + despesas = valor a receber/descontar do motorista, conforme operação.
- A taxa comercial pública da Aurora pode ser 5% quando aplicada ao fluxo parceiro.

CONTEXTO DO USUÁRIO:
${context ? JSON.stringify(context, null, 2) : "Não disponível"}

Ajude com clareza, sem expor dados sensíveis e direcionando para a área correta do sistema.`;

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
    tools: {
      calcularCorrida: tool({
        description: "Calcula valor estimado por KM para corrida ou deslocamento.",
        inputSchema: z.object({
          distanciaKm: z.number().describe("Distância em quilômetros"),
          valorKm: z.number().optional().describe("Valor por KM em reais"),
          valorBase: z.number().optional().describe("Valor base em reais"),
        }),
        execute: async ({ distanciaKm, valorKm = 2.5, valorBase = 0 }) => {
          const valorEstimado = valorBase + distanciaKm * valorKm;

          return {
            distanciaKm,
            valorBase: valorBase.toFixed(2),
            valorKm: valorKm.toFixed(2),
            valorEstimado: valorEstimado.toFixed(2),
            observacao:
              "Estimativa operacional. Valores finais dependem da regra cadastrada: diária, KM ou valor fechado do serviço.",
          };
        },
      }),

      calcularServicoMotorista: tool({
        description:
          "Calcula resumo operacional do serviço do motorista com valor do serviço, adiantamento e despesas.",
        inputSchema: z.object({
          valorServico: z.number().describe("Valor bruto do serviço"),
          adiantamento: z.number().optional().describe("Valor adiantado ao motorista"),
          despesas: z.number().optional().describe("Despesas lançadas no serviço"),
          taxaPercentual: z.number().optional().describe("Taxa percentual da Aurora quando aplicável"),
        }),
        execute: async ({
          valorServico,
          adiantamento = 0,
          despesas = 0,
          taxaPercentual = 5,
        }) => {
          const taxaAurora = valorServico * (taxaPercentual / 100);
          const valorLiquidoServico = valorServico - taxaAurora;
          const valorAReceberDoMotorista = adiantamento + despesas;
          const saldoMotorista = valorLiquidoServico - valorAReceberDoMotorista;

          return {
            valorServico: valorServico.toFixed(2),
            taxaPercentual: `${taxaPercentual}%`,
            taxaAurora: taxaAurora.toFixed(2),
            valorLiquidoServico: valorLiquidoServico.toFixed(2),
            adiantamento: adiantamento.toFixed(2),
            despesas: despesas.toFixed(2),
            valorAReceberDoMotorista: valorAReceberDoMotorista.toFixed(2),
            saldoMotorista: saldoMotorista.toFixed(2),
            regra:
              "Adiantamento + despesas compõem valor a receber/descontar do motorista conforme a operação.",
            visibilidade:
              "Cliente não vê esta parte. Motorista vê apenas o que for dele. Admin master vê tudo.",
          };
        },
      }),

      simularDiaria: tool({
        description: "Simula cobrança ou pagamento por diária.",
        inputSchema: z.object({
          quantidadeDiarias: z.number().describe("Quantidade de diárias"),
          valorDiaria: z.number().describe("Valor de cada diária"),
          despesas: z.number().optional().describe("Despesas adicionais"),
        }),
        execute: async ({ quantidadeDiarias, valorDiaria, despesas = 0 }) => {
          const totalDiarias = quantidadeDiarias * valorDiaria;
          const totalComDespesas = totalDiarias + despesas;

          return {
            quantidadeDiarias,
            valorDiaria: valorDiaria.toFixed(2),
            totalDiarias: totalDiarias.toFixed(2),
            despesas: despesas.toFixed(2),
            totalComDespesas: totalComDespesas.toFixed(2),
          };
        },
      }),

      simularKm: tool({
        description: "Simula operação por KM com ou sem reembolso.",
        inputSchema: z.object({
          km: z.number().describe("Quantidade de quilômetros"),
          valorKm: z.number().describe("Valor por KM"),
          reembolso: z.number().optional().describe("Valor de reembolso quando existir"),
          incluirReembolso: z.boolean().optional().describe("Se o reembolso entra no total"),
        }),
        execute: async ({ km, valorKm, reembolso = 0, incluirReembolso = false }) => {
          const subtotalKm = km * valorKm;
          const total = incluirReembolso ? subtotalKm + reembolso : subtotalKm;

          return {
            km,
            valorKm: valorKm.toFixed(2),
            subtotalKm: subtotalKm.toFixed(2),
            reembolso: reembolso.toFixed(2),
            incluirReembolso,
            total: total.toFixed(2),
          };
        },
      }),

      explicarVisibilidade: tool({
        description: "Explica regras de visibilidade por perfil.",
        inputSchema: z.object({
          perfil: z.enum(["cliente", "motorista", "empresa", "admin"]).describe("Perfil do usuário"),
        }),
        execute: async ({ perfil }) => {
          const regras = {
            cliente:
              "Cliente vê somente os próprios serviços, status, informações de atendimento e dados necessários da própria operação. Nunca vê dados internos do motorista, valores internos, outros clientes ou visão administrativa.",
            motorista:
              "Motorista vê somente serviços atribuídos a ele. Após pagamento/finalização, o serviço sai da visão operacional do motorista e fica em histórico/admin.",
            empresa:
              "Empresa vê somente a própria operação, solicitações, serviços e relatórios autorizados. Não vê dados de outras empresas.",
            admin:
              "Admin master vê tudo: clientes, empresas, motoristas, serviços, financeiro, histórico, adiantamentos, despesas e auditoria.",
          };

          return {
            perfil,
            regra: regras[perfil],
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  });
}

