export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Aurora Motoristas 🚗
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Plataforma profissional para gestão de motoristas, ofertas de serviço,
        operações, pagamentos e controle total com inteligência.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <a
          href="/ofertas"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ofertas de Serviço
        </a>

        <a
          href="/operacao"
          className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Operação
        </a>

        <a
          href="/financeiro"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Financeiro
        </a>
      </div>

      <div className="mt-12 text-xs text-gray-400">
        Sistema Aurora • Motoristas para empresas e locadoras
      </div>
    </main>
  );
}