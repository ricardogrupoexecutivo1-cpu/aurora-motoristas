"use client";

import { useRouter } from "next/navigation";
import { clearAuroraSession } from "../lib/aurora-session";

export default function AuroraLogoutButton() {
  const router = useRouter();

  function sair() {
    clearAuroraSession();
    router.push("/entrar");
  }

  return (
    <button
      onClick={sair}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100"
    >
      Sair
    </button>
  );
}