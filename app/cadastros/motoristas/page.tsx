"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectMotoristas() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/motoristas/novo");
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Redirecionando...</h1>
      <p>Você será levado para o cadastro profissional de motoristas.</p>
    </div>
  );
}