export type AuroraUserRole = "admin" | "motorista" | "cliente";

export type AuroraSession = {
  id: string;
  nome: string;
  email: string;
  role: AuroraUserRole;
  driver_id?: string | null;
  client_id?: string | null;
};

const SESSION_KEY = "aurora_motoristas_session";

export function saveAuroraSession(session: AuroraSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAuroraSession(): AuroraSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuroraSession;
  } catch {
    return null;
  }
}

export function clearAuroraSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function isAdmin(session: AuroraSession | null) {
  return session?.role === "admin";
}

export function isMotorista(session: AuroraSession | null) {
  return session?.role === "motorista";
}

export function isCliente(session: AuroraSession | null) {
  return session?.role === "cliente";
}