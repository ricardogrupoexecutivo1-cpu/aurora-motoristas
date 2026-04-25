import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-admin";

async function enviarTelegram(mensagem: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensagem,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Não quebra o sistema se o Telegram falhar
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { path, referrer, userAgent } = body;

    await supabaseAdmin.from("am_access_logs").insert({
      path: path || "/",
      referrer: referrer || "",
      user_agent: userAgent || "",
    });

    await enviarTelegram(
      `🚨 <b>Novo acesso Aurora Motoristas</b>\n\n` +
      `📍 Página: ${path || "/"}\n` +
      `🔗 Origem: ${referrer || "direto"}\n` +
      `📱 Dispositivo: ${(userAgent || "").slice(0, 120)}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
