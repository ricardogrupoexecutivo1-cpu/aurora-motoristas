"use client";

import Link from "next/link";

export default function AdminServicosPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#eef2ff,#f8fafc,#fdf4ff,#ecfeff)",
      padding: "40px"
    }}>

      <div style={{maxWidth:1200, margin:"0 auto"}}>

        <h1 style={{
          fontSize:48,
          fontWeight:900,
          background:"linear-gradient(135deg,#7c3aed,#06b6d4)",
          WebkitBackgroundClip:"text",
          color:"transparent"
        }}>
          Admin • Serviços
        </h1>

        <p style={{marginTop:10,color:"#475569"}}>
          Painel administrativo com visual premium Aurora
        </p>

        <div style={{
          marginTop:30,
          padding:20,
          borderRadius:20,
          background:"rgba(255,255,255,0.7)",
          backdropFilter:"blur(15px)",
          border:"1px solid rgba(0,0,0,0.05)"
        }}>

          <h2 style={{fontSize:20,fontWeight:700}}>
            Sistema ativo com novo padrão visual
          </h2>

          <p style={{marginTop:10}}>
            Aurora Glass Light Premium aplicado com sucesso.
          </p>

          <Link href="/translados" style={{
            display:"inline-block",
            marginTop:20,
            padding:"12px 20px",
            borderRadius:12,
            background:"linear-gradient(135deg,#7c3aed,#06b6d4)",
            color:"#fff",
            textDecoration:"none",
            fontWeight:700
          }}>
            Abrir translados
          </Link>

        </div>

      </div>

    </main>
  );
}
