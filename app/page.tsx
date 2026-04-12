export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl md:text-5xl font-bold mb-4">
        Aurora Motoristas 🚗
      </h1>

      <p className="text-gray-600 max-w-xl mb-8 text-sm md:text-base">
        Plataforma profissional para gestão de motoristas, ofertas de serviço,
        operações, pagamentos e controle total com inteligência.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <a href="/ofertas" className="bg-blue-600 text-white py-3 rounded-lg">
          Ofertas de Serviço
        </a>

        <a href="/operacao" className="bg-gray-200 py-3 rounded-lg">
          Operação
        </a>

        <a href="/financeiro" className="bg-green-600 text-white py-3 rounded-lg">
          Financeiro
        </a>

        <hr />

        <a href="/cadastros/motoristas" className="bg-black text-white py-3 rounded-lg">
          Cadastrar Motorista
        </a>

        <a href="/cadastros/clientes" className="bg-black text-white py-3 rounded-lg">
          Cadastrar Cliente
        </a>
      </div>

      <div className="mt-8 text-xs text-gray-400">
        Sistema Aurora • Motoristas para empresas e locadoras
      </div>
    </main>
  );
}