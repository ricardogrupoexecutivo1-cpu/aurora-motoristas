"use client";

import { useRouter, usePathname } from "next/navigation";

export default function AuroraNav() {
  const router = useRouter();
  const pathname = usePathname();

  const esconder =
    pathname === "/" ||
    pathname === "/entrar" ||
    pathname === "/login";

  if (esconder) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 9999,
        display: "flex",
        gap: 8,
      }}
    >
      <button
        onClick={() => router.back()}
        style={{
          border: 0,
          background: "#0f172a",
          color: "white",
          borderRadius: 999,
          padding: "10px 14px",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Voltar
      </button>

      <button
        onClick={() => router.push("/central")}
        style={{
          border: 0,
          background: "#2563eb",
          color: "white",
          borderRadius: 999,
          padding: "10px 14px",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Central
      </button>
    </div>
  );
}