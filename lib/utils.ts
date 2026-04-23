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
} {
  const pricing: Record<
    string,
    { base: number; perKm: number; perMin: number; min: number }
  > = {
    padrao: { base: 5.0, perKm: 2.0, perMin: 0.3, min: 10.0 },
    conforto: { base: 7.0, perKm: 2.5, perMin: 0.4, min: 15.0 },
    executivo: { base: 12.0, perKm: 3.5, perMin: 0.6, min: 25.0 },
    van: { base: 15.0, perKm: 4.0, perMin: 0.5, min: 30.0 },
    moto: { base: 3.0, perKm: 1.5, perMin: 0.2, min: 7.0 },
  };

  const price = pricing[category] || pricing.padrao;
  const valorBase = price.base;
  const valorKm = distanceKm * price.perKm;
  const valorTempo = durationMin * price.perMin;
  let valorTotal = valorBase + valorKm + valorTempo;

  if (valorTotal < price.min) {
    valorTotal = price.min;
  }

  const taxaPlataforma = valorTotal * 0.05; // 5%
  const valorMotorista = valorTotal - taxaPlataforma;

  return {
    valorBase,
    valorKm,
    valorTempo,
    valorTotal: Math.round(valorTotal * 100) / 100,
    taxaPlataforma: Math.round(taxaPlataforma * 100) / 100,
    valorMotorista: Math.round(valorMotorista * 100) / 100,
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
