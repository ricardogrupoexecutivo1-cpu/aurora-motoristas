"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuroraUserRole, getAuroraSession } from "../lib/aurora-session";
import { canAccess, getAccessRedirect } from "../lib/aurora-access";

type AuroraProtectedProps = {
  allowedRoles: AuroraUserRole[];
  children: ReactNode;
};

export default function AuroraProtected({
  allowedRoles,
  children,
}: AuroraProtectedProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getAuroraSession();

    if (!canAccess(session, allowedRoles)) {
      router.replace(getAccessRedirect(session));
      return;
    }

    setAllowed(true);
    setChecked(true);
  }, [allowedRoles, router]);

  if (!checked) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <section className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-600">
            Verificando acesso Aurora...
          </p>
        </section>
      </main>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}