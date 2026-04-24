"use client";

import Link from "next/link";

export default function TopBar() {
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/";
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <Link
            href="/"
            className="block truncate text-sm font-semibold text-slate-900 sm:text-base"
          >
            Aurora Motoristas
          </Link>

          <p className="truncate text-[11px] text-slate-500 sm:text-xs">
            Sistema em constante atualizaÃ§Ã£o
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] sm:text-sm"
          >
            Voltar
          </button>

          <Link
            href="/"
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] sm:text-sm"
          >
            InÃ­cio
          </Link>
        </nav>
      </div>
    </header>
  );
}
