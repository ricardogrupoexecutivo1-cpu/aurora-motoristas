"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, calculateRidePrice, generateCode } from "@/lib/utils";
import {
  Package,
  MapPin,
  Navigation,
  ArrowLeft,
  ArrowRight,
  ArrowDownUp,
  Send,
  MapPinned,
  Bike,
  Car,
  Truck,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  CheckCircle,
  Star,
  Shield,
  Phone,
  MessageCircle,
  X,
  AlertTriangle,
  Camera,
  FileText,
  Info,
  ChevronDown,
  User,
  BadgeCheck,
  Timer,
  Route,
  PackageCheck,
  Share2,
  Bell,
  Loader2,
  RefreshCw,
  Plus,
  Minus,
  Weight,
  Ruler,
  Box,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";

// Tipos de servico
const TIPOS_SERVICO = [
  {
    id: "buscar_entregar",
    nome: "Buscar e Entregar",
    desc: "Buscamos no ponto A e entregamos no B",
    icon: ArrowDownUp,
    color: "from-silicon-orange to-warning",
  },
  {
    id: "apenas_buscar",
    nome: "Apenas Buscar",
    desc: "Buscamos e levamos ate voce",
    icon: MapPinned,
    color: "from-success to-emerald-500",
  },
  {
    id: "apenas_entregar",
    nome: "Apenas Entregar",
    desc: "Coletamos com voce e entregamos",
    icon: Send,
    color: "from-primary to-accent",
  },
];

// Categorias de veiculo para entrega
const VEICULOS_ENTREGA = [
  {
    id: "moto",
    nome: "Moto",
    desc: "Ate 10kg - Pequenos volumes",
    icon: Bike,
    pesoMax: "10kg",
    dimensao: "40x30x30cm",
    multiplicador: 1.0,
    tempo: "Mais rapido",
  },
  {
    id: "carro",
    nome: "Carro",
    desc: "Ate 50kg - Volumes medios",
    icon: Car,
    pesoMax: "50kg",
    dimensao: "100x60x60cm",
    multiplicador: 1.4,
    tempo: "Economico",
  },
  {
    id: "van",
    nome: "Van",
    desc: "Ate 300kg - Volumes grandes",
    icon: Truck,
    pesoMax: "300kg",
    dimensao: "200x150x150cm",
    multiplicador: 2.2,
    tempo: "Carga media",
  },
  {
    id: "caminhao",
    nome: "Caminhao",
    desc: "Ate 3 toneladas - Mudancas",
    icon: Package,
    pesoMax: "3000kg",
    dimensao: "400x200x200cm",
    multiplicador: 3.5,
    tempo: "Carga pesada",
  },
];

// Formas de pagamento
const FORMAS_PAGAMENTO = [
  { id: "pix", nome: "PIX", icon: QrCode, desc: "Instantaneo", badge: "5% OFF" },
  { id: "cartao_credito", nome: "Cartao Credito", icon: CreditCard, desc: "Ate 12x" },
  { id: "cartao_debito", nome: "Cartao Debito", icon: CreditCard, desc: "A vista" },
  { id: "dinheiro", nome: "Dinheiro", icon: Banknote, desc: "Na entrega" },
  { id: "saldo", nome: "Saldo Aurora Motoristas", icon: Wallet, desc: "R$ 0,00" },
];

export default function EntregasPage() {
  // Estados principais
  const [etapa, setEtapa] = useState<"tipo" | "enderecos" | "detalhes" | "veiculo" | "pagamento" | "confirmacao" | "buscando" | "acompanhar">("tipo");
  const [tipoServico, setTipoServico] = useState<string>("");
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>("moto");
  const [formaPagamento, setFormaPagamento] = useState<string>("pix");
  
  // Enderecos
  const [enderecoOrigem, setEnderecoOrigem] = useState("");
  const [enderecoDestino, setEnderecoDestino] = useState("");
  const [complementoOrigem, setComplementoOrigem] = useState("");
  const [complementoDestino, setComplementoDestino] = useState("");
  
  // Detalhes do pacote
  const [descricaoPacote, setDescricaoPacote] = useState("");
  const [pesoEstimado, setPesoEstimado] = useState("1");
  const [quantidade, setQuantidade] = useState(1);
  const [valorDeclarado, setValorDeclarado] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [fragil, setFragil] = useState(false);
  const [urgente, setUrgente] = useState(false);
  
  // Contatos
  const [nomeRemetente, setNomeRemetente] = useState("");
  const [telefoneRemetente, setTelefoneRemetente] = useState("");
  const [nomeDestinatario, setNomeDestinatario] = useState("");
  const [telefoneDestinatario, setTelefoneDestinatario] = useState("");
  
  // Preco e distancia
  const [distancia, setDistancia] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [preco, setPreco] = useState({ valorTotal: 0, taxaPlataforma: 0, valorMotorista: 0, economiaVsConcorrencia: 0 });
  
  // Estado da entrega
  const [entregador, setEntregador] = useState<{
    nome: string;
    foto: string;
    avaliacao: number;
    corridas: number;
    veiculo: string;
    placa: string;
    cor: string;
    telefone: string;
  } | null>(null);
  const [codigoSeguranca, setCodigoSeguranca] = useState("");
  const [statusEntrega, setStatusEntrega] = useState("");
  
  // Calcula preco quando muda veiculo ou distancia
  useEffect(() => {
    if (enderecoOrigem && enderecoDestino) {
      // Simula calculo de distancia (em producao usar API de mapas)
      const dist = Math.random() * 20 + 2;
      const dur = Math.round(dist * 3);
      setDistancia(parseFloat(dist.toFixed(1)));
      setDuracao(dur);
      
      const veiculo = VEICULOS_ENTREGA.find(v => v.id === veiculoSelecionado);
      const categoria = `entrega_${veiculoSelecionado === "caminhao" ? "caminhao" : veiculoSelecionado}`;
      const precoBase = calculateRidePrice(dist, dur, categoria);
      
      // Ajustes de preco
      let valorFinal = precoBase.valorTotal;
      if (urgente) valorFinal *= 1.5; // +50% para urgente
      if (fragil) valorFinal *= 1.1; // +10% para fragil
      if (formaPagamento === "pix") valorFinal *= 0.95; // -5% PIX
      
      setPreco({
        valorTotal: Math.round(valorFinal * 100) / 100,
        taxaPlataforma: Math.round(valorFinal * 0.05 * 100) / 100,
        valorMotorista: Math.round(valorFinal * 0.95 * 100) / 100,
        economiaVsConcorrencia: Math.round(valorFinal * 0.23 * 100) / 100,
      });
    }
  }, [enderecoOrigem, enderecoDestino, veiculoSelecionado, urgente, fragil, formaPagamento]);
  
  // Simula busca por entregador
  const buscarEntregador = () => {
    setEtapa("buscando");
    setCodigoSeguranca(generateCode(4));
    
    setTimeout(() => {
      setEntregador({
        nome: "Carlos Silva",
        foto: "",
        avaliacao: 4.9,
        corridas: 2847,
        veiculo: veiculoSelecionado === "moto" ? "Honda CG 160" : veiculoSelecionado === "carro" ? "VW Gol" : "Fiat Fiorino",
        placa: "ABC-" + Math.floor(1000 + Math.random() * 9000),
        cor: veiculoSelecionado === "moto" ? "Vermelha" : "Prata",
        telefone: "(11) 99999-8888",
      });
      setStatusEntrega("aceito");
      setEtapa("acompanhar");
    }, 3000);
  };
  
  // Render Header
  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {etapa !== "tipo" && (
            <button
              onClick={() => {
                const etapas = ["tipo", "enderecos", "detalhes", "veiculo", "pagamento", "confirmacao"];
                const idx = etapas.indexOf(etapa);
                if (idx > 0) setEtapa(etapas[idx - 1] as typeof etapa);
              }}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-silicon-orange to-warning flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-silicon-orange to-warning bg-clip-text text-transparent">Aurora Motoristas</span>
              <p className="text-[9px] text-muted-foreground tracking-widest -mt-1">EXPRESS</p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-secondary">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-secondary">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
  
  // Render Tipo de Servico
  const renderTipoServico = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black mb-2">O que voce precisa?</h1>
        <p className="text-muted-foreground">Escolha o tipo de servico</p>
      </div>
      
      <div className="space-y-4">
        {TIPOS_SERVICO.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => {
              setTipoServico(tipo.id);
              setEtapa("enderecos");
            }}
            className="w-full p-6 rounded-2xl bg-card border border-border hover:border-silicon-orange/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tipo.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <tipo.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold mb-1">{tipo.nome}</h3>
                <p className="text-sm text-muted-foreground">{tipo.desc}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-silicon-orange group-hover:translate-x-2 transition-all" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Info Box */}
      <div className="p-4 rounded-xl bg-silicon-orange/10 border border-silicon-orange/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-silicon-orange flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Entregas para todo Brasil</p>
            <p className="text-xs text-muted-foreground">Moto, Carro, Van ou Caminhao. Voce escolhe o melhor para sua encomenda.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render Enderecos
  const renderEnderecos = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black mb-2">
          {tipoServico === "apenas_buscar" ? "Onde buscar?" : 
           tipoServico === "apenas_entregar" ? "De onde para onde?" : 
           "Origem e Destino"}
        </h1>
        <p className="text-muted-foreground">Informe os enderecos</p>
      </div>
      
      {/* Origem */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-3 h-3 rounded-full bg-success" />
          {tipoServico === "apenas_entregar" ? "Endereco de coleta (seu local)" : "Endereco de origem (buscar)"}
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
          <input
            type="text"
            value={enderecoOrigem}
            onChange={(e) => setEnderecoOrigem(e.target.value)}
            placeholder="Rua, numero, bairro..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary border border-border focus:border-success focus:ring-2 focus:ring-success/20 transition-all"
          />
        </div>
        <input
          type="text"
          value={complementoOrigem}
          onChange={(e) => setComplementoOrigem(e.target.value)}
          placeholder="Complemento, referencia..."
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-success transition-all text-sm"
        />
      </div>
      
      {/* Linha conectora */}
      <div className="flex justify-center">
        <div className="w-0.5 h-8 bg-gradient-to-b from-success to-silicon-orange" />
      </div>
      
      {/* Destino */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-3 h-3 rounded-full bg-silicon-orange" />
          {tipoServico === "apenas_buscar" ? "Seu endereco (entrega)" : "Endereco de destino (entregar)"}
        </label>
        <div className="relative">
          <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silicon-orange" />
          <input
            type="text"
            value={enderecoDestino}
            onChange={(e) => setEnderecoDestino(e.target.value)}
            placeholder="Rua, numero, bairro..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary border border-border focus:border-silicon-orange focus:ring-2 focus:ring-silicon-orange/20 transition-all"
          />
        </div>
        <input
          type="text"
          value={complementoDestino}
          onChange={(e) => setComplementoDestino(e.target.value)}
          placeholder="Complemento, referencia..."
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-silicon-orange transition-all text-sm"
        />
      </div>
      
      {/* Contatos */}
      <div className="pt-4 border-t border-border">
        <p className="font-semibold mb-4">Contatos</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Nome remetente</label>
            <input
              type="text"
              value={nomeRemetente}
              onChange={(e) => setNomeRemetente(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Telefone</label>
            <input
              type="tel"
              value={telefoneRemetente}
              onChange={(e) => setTelefoneRemetente(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Nome destinatario</label>
            <input
              type="text"
              value={nomeDestinatario}
              onChange={(e) => setNomeDestinatario(e.target.value)}
              placeholder="Quem recebe"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Telefone</label>
            <input
              type="tel"
              value={telefoneDestinatario}
              onChange={(e) => setTelefoneDestinatario(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Botao Continuar */}
      <button
        onClick={() => setEtapa("detalhes")}
        disabled={!enderecoOrigem || !enderecoDestino}
        className="w-full py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continuar
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
  
  // Render Detalhes do Pacote
  const renderDetalhes = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black mb-2">Detalhes do Pacote</h1>
        <p className="text-muted-foreground">O que voce vai enviar?</p>
      </div>
      
      {/* Descricao */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Descricao do conteudo *</label>
        <textarea
          value={descricaoPacote}
          onChange={(e) => setDescricaoPacote(e.target.value)}
          placeholder="Ex: Documentos, caixa com roupas, equipamento eletronico..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-silicon-orange transition-all resize-none"
        />
      </div>
      
      {/* Peso e Quantidade */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Weight className="w-4 h-4" />
            Peso estimado (kg)
          </label>
          <input
            type="number"
            value={pesoEstimado}
            onChange={(e) => setPesoEstimado(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-silicon-orange transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Box className="w-4 h-4" />
            Quantidade
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="p-3 rounded-xl bg-secondary hover:bg-secondary/80"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-bold text-xl">{quantidade}</span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="p-3 rounded-xl bg-secondary hover:bg-secondary/80"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Valor Declarado */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Valor declarado (valor declarado)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
          <input
            type="number"
            value={valorDeclarado}
            onChange={(e) => setValorDeclarado(e.target.value)}
            placeholder="0,00"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-silicon-orange transition-all"
          />
        </div>
      </div>
      
      {/* Opcoes Especiais */}
      <div className="space-y-3">
        <label className="text-sm font-semibold">Opcoes especiais</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFragil(!fragil)}
            className={`p-4 rounded-xl border-2 transition-all ${
              fragil ? "border-silicon-orange bg-silicon-orange/10" : "border-border bg-card"
            }`}
          >
            <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${fragil ? "text-silicon-orange" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold">Fragil</p>
            <p className="text-xs text-muted-foreground">+10%</p>
          </button>
          <button
            onClick={() => setUrgente(!urgente)}
            className={`p-4 rounded-xl border-2 transition-all ${
              urgente ? "border-destructive bg-destructive/10" : "border-border bg-card"
            }`}
          >
            <Zap className={`w-6 h-6 mx-auto mb-2 ${urgente ? "text-destructive" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold">Urgente</p>
            <p className="text-xs text-muted-foreground">+50%</p>
          </button>
        </div>
      </div>
      
      {/* Observacoes */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Observacoes (opcional)</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Instrucoes especiais para o entregador..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-silicon-orange transition-all resize-none"
        />
      </div>
      
      {/* Botao Continuar */}
      <button
        onClick={() => setEtapa("veiculo")}
        disabled={!descricaoPacote}
        className="w-full py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Escolher Veiculo
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
  
  // Render Selecao de Veiculo
  const renderVeiculo = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black mb-2">Escolha o Veiculo</h1>
        <p className="text-muted-foreground">Selecione o melhor para sua entrega</p>
      </div>
      
      {/* Info da rota */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-silicon-orange" />
            <span className="text-sm font-medium">Rota calculada</span>
          </div>
          <span className="text-xs text-muted-foreground">{distancia} km - ~{duracao} min</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="flex-1 truncate">{enderecoOrigem || "Origem"}</span>
        </div>
        <div className="w-0.5 h-3 bg-border ml-[3px] my-1" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-silicon-orange" />
          <span className="flex-1 truncate">{enderecoDestino || "Destino"}</span>
        </div>
      </div>
      
      {/* Lista de Veiculos */}
      <div className="space-y-3">
        {VEICULOS_ENTREGA.map((veiculo) => {
          const categoria = `entrega_${veiculo.id === "caminhao" ? "caminhao" : veiculo.id}`;
          const precoVeiculo = calculateRidePrice(distancia || 5, duracao || 15, categoria);
          let valorFinal = precoVeiculo.valorTotal;
          if (urgente) valorFinal *= 1.5;
          if (fragil) valorFinal *= 1.1;
          
          return (
            <button
              key={veiculo.id}
              onClick={() => setVeiculoSelecionado(veiculo.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                veiculoSelecionado === veiculo.id
                  ? "border-silicon-orange bg-silicon-orange/5"
                  : "border-border bg-card hover:border-silicon-orange/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  veiculoSelecionado === veiculo.id ? "bg-silicon-orange" : "bg-secondary"
                }`}>
                  <veiculo.icon className={`w-7 h-7 ${veiculoSelecionado === veiculo.id ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{veiculo.nome}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{veiculo.tempo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{veiculo.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">Max: {veiculo.pesoMax} | {veiculo.dimensao}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-silicon-orange">{formatCurrency(valorFinal)}</p>
                  {formaPagamento === "pix" && (
                    <p className="text-xs text-success">-5% PIX</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Botao Continuar */}
      <button
        onClick={() => setEtapa("pagamento")}
        className="w-full py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl flex items-center justify-center gap-2"
      >
        Forma de Pagamento
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
  
  // Render Pagamento
  const renderPagamento = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black mb-2">Pagamento</h1>
        <p className="text-muted-foreground">Como voce quer pagar?</p>
      </div>
      
      {/* Formas de Pagamento */}
      <div className="space-y-3">
        {FORMAS_PAGAMENTO.map((forma) => (
          <button
            key={forma.id}
            onClick={() => setFormaPagamento(forma.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              formaPagamento === forma.id
                ? "border-silicon-orange bg-silicon-orange/5"
                : "border-border bg-card hover:border-silicon-orange/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                formaPagamento === forma.id ? "bg-silicon-orange" : "bg-secondary"
              }`}>
                <forma.icon className={`w-6 h-6 ${formaPagamento === forma.id ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{forma.nome}</h3>
                  {forma.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">{forma.badge}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{forma.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                formaPagamento === forma.id ? "border-silicon-orange bg-silicon-orange" : "border-border"
              }`}>
                {formaPagamento === forma.id && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Resumo do Preco */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
        <h3 className="font-bold">Resumo do pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor base</span>
            <span>{formatCurrency(preco.valorTotal / (urgente ? 1.5 : 1) / (fragil ? 1.1 : 1))}</span>
          </div>
          {urgente && (
            <div className="flex justify-between text-destructive">
              <span>Taxa urgente (+50%)</span>
              <span>+{formatCurrency(preco.valorTotal * 0.33)}</span>
            </div>
          )}
          {fragil && (
            <div className="flex justify-between text-silicon-orange">
              <span>Taxa fragil (+10%)</span>
              <span>+{formatCurrency(preco.valorTotal * 0.09)}</span>
            </div>
          )}
          {formaPagamento === "pix" && (
            <div className="flex justify-between text-success">
              <span>Desconto PIX (-5%)</span>
              <span>-{formatCurrency(preco.valorTotal * 0.05)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-silicon-orange">{formatCurrency(preco.valorTotal)}</span>
          </div>
        </div>
        
        {/* Economia */}
        <div className="p-3 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">
              Economia de {formatCurrency(preco.economiaVsConcorrencia)} vs concorrencia
            </span>
          </div>
        </div>
      </div>
      
      {/* Botao Confirmar */}
      <button
        onClick={() => setEtapa("confirmacao")}
        className="w-full py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl flex items-center justify-center gap-2"
      >
        Revisar Pedido
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
  
  // Render Confirmacao
  const renderConfirmacao = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black mb-2">Confirmar Pedido</h1>
        <p className="text-muted-foreground">Revise os detalhes antes de confirmar</p>
      </div>
      
      {/* Resumo Completo */}
      <div className="space-y-4">
        {/* Tipo e Veiculo */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-silicon-orange flex items-center justify-center">
              {(() => {
                const Veiculo = VEICULOS_ENTREGA.find(v => v.id === veiculoSelecionado)?.icon || Package;
                return <Veiculo className="w-5 h-5 text-white" />;
              })()}
            </div>
            <div>
              <p className="font-bold">{VEICULOS_ENTREGA.find(v => v.id === veiculoSelecionado)?.nome}</p>
              <p className="text-xs text-muted-foreground">{TIPOS_SERVICO.find(t => t.id === tipoServico)?.nome}</p>
            </div>
          </div>
        </div>
        
        {/* Enderecos */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success" />
            <p className="text-sm font-medium truncate">{enderecoOrigem}</p>
          </div>
          <div className="w-0.5 h-4 bg-border ml-[3px] my-1" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-silicon-orange" />
            <p className="text-sm font-medium truncate">{enderecoDestino}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{distancia} km</span>
            <span className="text-muted-foreground">~{duracao} min</span>
          </div>
        </div>
        
        {/* Pacote */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="font-bold mb-2">Pacote</p>
          <p className="text-sm text-muted-foreground mb-2">{descricaoPacote}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{pesoEstimado}kg</span>
            <span>{quantidade} volume(s)</span>
            {fragil && <span className="text-silicon-orange">Fragil</span>}
            {urgente && <span className="text-destructive">Urgente</span>}
          </div>
        </div>
        
        {/* Pagamento */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const Pagamento = FORMAS_PAGAMENTO.find(f => f.id === formaPagamento)?.icon || CreditCard;
                return <Pagamento className="w-5 h-5 text-silicon-orange" />;
              })()}
              <span className="font-medium">{FORMAS_PAGAMENTO.find(f => f.id === formaPagamento)?.nome}</span>
            </div>
            <span className="text-xl font-black text-silicon-orange">{formatCurrency(preco.valorTotal)}</span>
          </div>
        </div>
      </div>
      
      {/* Termos */}
      <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground text-center">
        Ao confirmar, voce concorda com nossos Termos de Uso e Politica de Privacidade
      </div>
      
      {/* Botao Confirmar */}
      <button
        onClick={buscarEntregador}
        className="w-full py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
      >
        <PackageCheck className="w-5 h-5" />
        Confirmar e Buscar Entregador
      </button>
    </div>
  );
  
  // Render Buscando Entregador
  const renderBuscando = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-silicon-orange/20 flex items-center justify-center animate-pulse-glow">
          <Package className="w-16 h-16 text-silicon-orange" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-silicon-orange border-t-transparent animate-spin" />
      </div>
      
      <h2 className="text-2xl font-black mb-2">Buscando Entregador</h2>
      <p className="text-muted-foreground mb-6">Estamos encontrando o melhor parceiro para sua entrega...</p>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Isso pode levar alguns segundos</span>
      </div>
    </div>
  );
  
  // Render Acompanhar Entrega
  const renderAcompanhar = () => (
    <div className="animate-fade-in-up">
      {/* Status Bar */}
      <div className="p-4 bg-success text-white">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Entregador encontrado!</span>
        </div>
      </div>
      
      {/* Mapa Placeholder */}
      <div className="h-48 bg-secondary flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-silicon-orange" />
          <p className="text-sm text-muted-foreground">Mapa em tempo real</p>
        </div>
      </div>
      
      {/* Codigo de Seguranca */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-warning/10 border-2 border-warning mb-4">
          <p className="text-xs text-center text-muted-foreground mb-2">CODIGO DE SEGURANCA</p>
          <p className="text-4xl font-black text-center tracking-[0.5em] text-warning">{codigoSeguranca}</p>
          <p className="text-xs text-center text-muted-foreground mt-2">Informe este codigo ao entregador</p>
        </div>
      </div>
      
      {/* Info do Entregador */}
      {entregador && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-silicon-orange to-warning flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{entregador.nome}</h3>
                  <BadgeCheck className="w-5 h-5 text-success" />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span>{entregador.avaliacao}</span>
                  </div>
                  <span>{entregador.corridas} entregas</span>
                </div>
              </div>
            </div>
            
            {/* Placa em Destaque */}
            <div className="p-4 rounded-xl bg-warning text-black mb-4">
              <p className="text-xs font-medium text-center mb-1">PLACA DO VEICULO</p>
              <p className="text-3xl font-black text-center tracking-wider">{entregador.placa}</p>
              <p className="text-sm text-center mt-1">{entregador.veiculo} - {entregador.cor}</p>
            </div>
            
            {/* Acoes */}
            <div className="grid grid-cols-3 gap-3">
              <button className="p-3 rounded-xl bg-success/10 flex flex-col items-center gap-1">
                <Phone className="w-5 h-5 text-success" />
                <span className="text-xs">Ligar</span>
              </button>
              <button className="p-3 rounded-xl bg-primary/10 flex flex-col items-center gap-1">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-xs">Chat</span>
              </button>
              <button className="p-3 rounded-xl bg-silicon-orange/10 flex flex-col items-center gap-1">
                <Share2 className="w-5 h-5 text-silicon-orange" />
                <span className="text-xs">Compartilhar</span>
              </button>
            </div>
          </div>
          
          {/* Botao SOS */}
          <button className="w-full mt-4 py-4 bg-destructive/10 border border-destructive rounded-xl flex items-center justify-center gap-2 text-destructive font-bold">
            <AlertTriangle className="w-5 h-5" />
            Emergencia SOS
          </button>
        </div>
      )}
    </div>
  );
  
  return (
    <main className="min-h-screen bg-background">
      {renderHeader()}
      
      <div className="max-w-2xl mx-auto pb-24">
        {etapa === "tipo" && renderTipoServico()}
        {etapa === "enderecos" && renderEnderecos()}
        {etapa === "detalhes" && renderDetalhes()}
        {etapa === "veiculo" && renderVeiculo()}
        {etapa === "pagamento" && renderPagamento()}
        {etapa === "confirmacao" && renderConfirmacao()}
        {etapa === "buscando" && renderBuscando()}
        {etapa === "acompanhar" && renderAcompanhar()}
      </div>
    </main>
  );
}

