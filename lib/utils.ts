export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  return cpf;
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  return cnpj;
}

export function generateCode(length: number = 4): string {
  return Math.random()
    .toString(10)
    .slice(2, 2 + length);
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calcula o preco da corrida MOVO
 * MOVO cobra apenas 5% de taxa (vs 25% da Uber e 20% da 99)
 * Isso permite precos ate 20% mais baratos para o passageiro
 * mantendo o mesmo ganho para o motorista!
 */
export function calculateRidePrice(
  distanceKm: number,
  durationMin: number,
  category: string = "padrao"
): {
  valorBase: number;
  valorKm: number;
  valorTempo: number;
  valorTotal: number;
  taxaPlataforma: number;
  valorMotorista: number;
  economiaVsUber: number;
  economia99: number;
} {
  // Precos base MOVO (otimizados para ser mais barato que concorrencia)
  const pricing: Record<
    string,
    { base: number; perKm: number; perMin: number; min: number }
  > = {
    moto: { base: 2.50, perKm: 1.20, perMin: 0.15, min: 6.0 },
    padrao: { base: 4.50, perKm: 1.80, perMin: 0.25, min: 9.0 },
    conforto: { base: 6.50, perKm: 2.30, perMin: 0.35, min: 14.0 },
    executivo: { base: 11.0, perKm: 3.20, perMin: 0.55, min: 23.0 },
    van: { base: 14.0, perKm: 3.70, perMin: 0.45, min: 28.0 },
  };

  const price = pricing[category] || pricing.padrao;
  const valorBase = price.base;
  const valorKm = distanceKm * price.perKm;
  const valorTempo = durationMin * price.perMin;
  let valorTotal = valorBase + valorKm + valorTempo;

  if (valorTotal < price.min) {
    valorTotal = price.min;
  }

  // Taxa MOVO: apenas 5% (muito menor que concorrencia)
  const taxaPlataforma = valorTotal * 0.05;
  const valorMotorista = valorTotal - taxaPlataforma;

  // Calcular quanto seria na Uber (25% taxa) e 99 (20% taxa)
  // Para o motorista ganhar o mesmo, o passageiro pagaria mais
  const valorUberEquivalente = valorMotorista / 0.75; // Uber fica com 25%
  const valor99Equivalente = valorMotorista / 0.80; // 99 fica com 20%
  
  const economiaVsUber = valorUberEquivalente - valorTotal;
  const economia99 = valor99Equivalente - valorTotal;

  return {
    valorBase: Math.round(valorBase * 100) / 100,
    valorKm: Math.round(valorKm * 100) / 100,
    valorTempo: Math.round(valorTempo * 100) / 100,
    valorTotal: Math.round(valorTotal * 100) / 100,
    taxaPlataforma: Math.round(taxaPlataforma * 100) / 100,
    valorMotorista: Math.round(valorMotorista * 100) / 100,
    economiaVsUber: Math.round(economiaVsUber * 100) / 100,
    economia99: Math.round(economia99 * 100) / 100,
  };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Rides
    solicitada: "#f59e0b",
    aceita: "#3b82f6",
    motorista_a_caminho: "#8b5cf6",
    em_andamento: "#10b981",
    finalizada: "#22c55e",
    cancelada: "#ef4444",
    // Services
    pendente: "#f59e0b",
    aceito: "#3b82f6",
    aguardando_pagamento: "#8b5cf6",
    pago: "#22c55e",
    arquivado: "#6b7280",
    // Payment
    processando: "#3b82f6",
    recebido: "#22c55e",
    estornado: "#ef4444",
    // Default
    ativo: "#22c55e",
    inativo: "#6b7280",
    bloqueado: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Rides
    solicitada: "Solicitada",
    aceita: "Aceita",
    motorista_a_caminho: "Motorista a caminho",
    em_andamento: "Em andamento",
    finalizada: "Finalizada",
    cancelada: "Cancelada",
    // Services
    pendente: "Pendente",
    aceito: "Aceito",
    aguardando_pagamento: "Aguardando pagamento",
    pago: "Pago",
    arquivado: "Arquivado",
    // Payment
    processando: "Processando",
    recebido: "Recebido",
    estornado: "Estornado",
    // Default
    ativo: "Ativo",
    inativo: "Inativo",
    bloqueado: "Bloqueado",
  };
  return labels[status] || status;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 9);
}
