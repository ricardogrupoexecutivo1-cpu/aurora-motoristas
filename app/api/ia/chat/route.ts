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
  const { messages, context }: { messages: UIMessage[]; context?: Record<string, unknown> } = await req.json();

  const systemPrompt = `Você é a MIA (MOVO Inteligência Artificial), a assistente virtual inteligente do MOVO - o app de mobilidade com a menor taxa do Brasil (apenas 5%).

PERSONALIDADE:
- Simpática, profissional e eficiente
- Usa linguagem clara e acessível
- Sempre responde em português brasileiro
- É proativa em oferecer ajuda

CAPACIDADES:
- Ajudar passageiros a solicitar corridas
- Auxiliar motoristas com dúvidas sobre ganhos e taxa
- Responder dúvidas sobre pagamentos e métodos aceitos
- Calcular estimativas de corridas
- Explicar como funciona a taxa de 5% do MOVO
- Ajudar com problemas técnicos
- Responder sobre segurança e verificação de motoristas

INFORMAÇÕES DO MOVO:
- Taxa de apenas 5% para motoristas (a menor do Brasil)
- Pagamentos via PIX, cartão de crédito/débito e dinheiro
- Motoristas recebem em até 24h via PIX
- Todos os motoristas são verificados com antecedentes
- Disponível em todo o Brasil
- Corridas executivas, econômicas e compartilhadas

CONTEXTO DO USUÁRIO:
${context ? JSON.stringify(context, null, 2) : "Não disponível"}

Sempre seja útil e direcione o usuário para as soluções corretas dentro do app MOVO.`;

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
    tools: {
      calcularCorrida: tool({
        description: "Calcula o valor estimado de uma corrida",
        inputSchema: z.object({
          distanciaKm: z.number().describe("Distância em quilômetros"),
          categoria: z.enum(["economico", "comfort", "executivo", "luxo"]).describe("Categoria do veículo"),
        }),
        execute: async ({ distanciaKm, categoria }) => {
          const precos = {
            economico: { base: 5, km: 1.5 },
            comfort: { base: 7, km: 2.0 },
            executivo: { base: 10, km: 2.8 },
            luxo: { base: 15, km: 4.0 },
          };
          
          const preco = precos[categoria];
          const valor = preco.base + (distanciaKm * preco.km);
          
          return {
            categoria,
            distanciaKm,
            valorBase: preco.base,
            valorPorKm: preco.km,
            valorEstimado: valor.toFixed(2),
            tempoEstimado: Math.ceil(distanciaKm * 2.5) + " min",
          };
        },
      }),
      calcularGanhoMotorista: tool({
        description: "Calcula quanto um motorista ganha em uma corrida após a taxa de 5%",
        inputSchema: z.object({
          valorCorrida: z.number().describe("Valor total da corrida em reais"),
        }),
        execute: async ({ valorCorrida }) => {
          const taxaMovo = valorCorrida * 0.05;
          const ganhoMotorista = valorCorrida - taxaMovo;
          
          return {
            valorCorrida: valorCorrida.toFixed(2),
            taxaMovo: taxaMovo.toFixed(2),
            percentualTaxa: "5%",
            ganhoMotorista: ganhoMotorista.toFixed(2),
            percentualGanho: "95%",
          };
        },
      }),
      simularGanhosMensais: tool({
        description: "Simula ganhos mensais de um motorista",
        inputSchema: z.object({
          corridasPorDia: z.number().describe("Número médio de corridas por dia"),
          valorMedioCorrida: z.number().describe("Valor médio por corrida"),
          diasPorSemana: z.number().describe("Dias trabalhados por semana"),
        }),
        execute: async ({ corridasPorDia, valorMedioCorrida, diasPorSemana }) => {
          const corridasSemana = corridasPorDia * diasPorSemana;
          const corridasMes = corridasSemana * 4;
          const faturamentoSemana = corridasSemana * valorMedioCorrida;
          const faturamentoMes = corridasMes * valorMedioCorrida;
          const ganhoLiquidoMes = faturamentoMes * 0.95; // 95% após taxa de 5%
          
          return {
            corridasSemana,
            corridasMes,
            faturamentoBrutoSemana: faturamentoSemana.toFixed(2),
            faturamentoBrutoMes: faturamentoMes.toFixed(2),
            taxaTotalMes: (faturamentoMes * 0.05).toFixed(2),
            ganhoLiquidoMes: ganhoLiquidoMes.toFixed(2),
          };
        },
      }),
      buscarCategoria: tool({
        description: "Busca informações sobre categorias de veículos",
        inputSchema: z.object({
          categoria: z.enum(["economico", "comfort", "executivo", "luxo"]).describe("Categoria do veículo"),
        }),
        execute: async ({ categoria }) => {
          const categorias = {
            economico: {
              nome: "MOVO X",
              descricao: "Carros populares, opção mais acessível",
              capacidade: "4 passageiros",
              exemplos: "Onix, HB20, Gol, Ka",
              precoBase: "R$ 5,00",
              precoKm: "R$ 1,50/km",
            },
            comfort: {
              nome: "MOVO Comfort",
              descricao: "Carros mais espaçosos e confortáveis",
              capacidade: "4 passageiros",
              exemplos: "Corolla, Civic, Cruze, Sentra",
              precoBase: "R$ 7,00",
              precoKm: "R$ 2,00/km",
            },
            executivo: {
              nome: "MOVO Black",
              descricao: "Carros executivos de alto padrão",
              capacidade: "4 passageiros",
              exemplos: "BMW Série 3, Mercedes Classe C, Audi A4",
              precoBase: "R$ 10,00",
              precoKm: "R$ 2,80/km",
            },
            luxo: {
              nome: "MOVO Lux",
              descricao: "Carros de luxo para ocasiões especiais",
              capacidade: "4 passageiros",
              exemplos: "BMW Série 7, Mercedes Classe S, Audi A8",
              precoBase: "R$ 15,00",
              precoKm: "R$ 4,00/km",
            },
          };
          
          return categorias[categoria];
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  });
}
