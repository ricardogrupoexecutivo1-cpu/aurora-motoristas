"use client";

export default function AuroraPrintButton() {
  function imprimir() {
    window.print();
  }

  return (
    <button
      onClick={imprimir}
      className="rounded-xl border border-green-300 bg-green-600 px-4 py-2 text-sm font-black text-white hover:bg-green-700"
    >
      Imprimir
    </button>
  );
}