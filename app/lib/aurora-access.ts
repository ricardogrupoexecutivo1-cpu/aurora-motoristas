import { AuroraSession, AuroraUserRole } from "./aurora-session";

export function canAccess(
  session: AuroraSession | null,
  allowedRoles: AuroraUserRole[]
) {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}

export function getAccessRedirect(session: AuroraSession | null) {
  if (!session) return "/entrar";

  if (session.role === "admin") return "/admin/servicos-supabase";
  if (session.role === "motorista") return "/motoristas/painel";
  if (session.role === "cliente") return "/clientes/painel";

  return "/entrar";
}