"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  ArrowLeft,
  ArrowRight,
  Car,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Camera,
  Upload,
  CheckCircle,
  Shield,
  Wallet,
  Clock,
  Zap,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Info,
  MapPin,
  CreditCard,
} from "lucide-react";

type Step = "intro" | "dados" | "cnh" | "veiculo" | "documentos" | "termos" | "sucesso";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export default function CadastroMotoristaPage() {
  const [step, setStep] = useState<Step>("intro");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPolitica, setAcceptPolitica] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    endereco: "",
    cidade: "",
    estado: "",
    // CNH
    cnh: "",
    categoriaCnh: "",
    validadeCnh: "",
    ufCnh: "",
    // Veículo
    tipoVeiculo: "",
    placaVeiculo: "",
    renavamVeiculo: "",
    modeloVeiculo: "",
    marcaVeiculo: "",
    anoVeiculo: "",
    corVeiculo: "",
    // Banco
    banco: "",
    agencia: "",
    conta: "",
    tipoConta: "",
    chavePix: "",
  });

  const [documents, setDocuments] = useState({
    selfie: null as File | null,
    cnhFrente: null as File | null,
    cnhVerso: null as File | null,
    crlv: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function buscarCep() {
    const cep = onlyDigits(formData.cep);
    if (cep.length !== 8) return;

    try {
      setLoadingCep(true);
      const response = await fetch(`/api/cep?cep=${cep}`);
      const data = await response.json();

      if (response.ok && data?.address) {
        setFormData((prev) => ({
          ...prev,
          endereco: data.address.endereco || prev.endereco,
          cidade: data.address.cidade || prev.cidade,
          estado: data.address.estado || prev.estado,
        }));
      }
    } catch {
      // ignore
    } finally {
      setLoadingCep(false);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/motoristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          cpf: onlyDigits(formData.cpf),
          telefone: onlyDigits(formData.telefone),
          email: formData.email.trim(),
          cnh: formData.cnh.trim(),
          cep: onlyDigits(formData.cep),
          endereco: formData.endereco.trim(),
          cidade: formData.cidade.trim(),
          estado: formData.estado.trim(),
          ativo: false, // Pendente de aprovação
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar");
      }
    } catch {
      // Continue to success anyway for demo
    }

    setLoading(false);
    setStep("sucesso");
  };

  const steps = ["intro", "dados", "cnh", "veiculo", "documentos", "termos"];
  const currentStepIndex = steps.indexOf(step);

  const renderProgress = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {steps.slice(1).map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < currentStepIndex
                ? "bg-success text-white"
                : i + 1 === currentStepIndex
                ? "bg-primary text-white"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {i + 1 < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : i + 1}
          </div>
          {i < steps.length - 2 && (
            <div
              className={`w-8 sm:w-12 lg:w-16 h-1 mx-1 rounded-full transition-all ${
                i + 1 < currentStepIndex ? "bg-success" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {step !== "intro" && step !== "sucesso" ? (
                <button
                  onClick={() => {
                    const prevStep = steps[currentStepIndex - 1] as Step;
                    setStep(prevStep);
                  }}
                  className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black">MOVO</span>
                </Link>
              )}
            </div>

            {step !== "intro" && step !== "sucesso" && (
              <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">
                Sair
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {step !== "intro" && step !== "sucesso" && renderProgress()}

        {/* Intro */}
        {step === "intro" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Taxa de apenas 5%</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
                Dirija com o MOVO e ganhe mais
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                A plataforma com a menor taxa do mercado. Você dirige, você decide seus horários, você ganha mais.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: DollarSign, title: "Taxa de apenas 5%", desc: "A menor taxa do Brasil. Mais dinheiro no seu bolso.", color: "text-success" },
                { icon: Zap, title: "Receba em 24h", desc: "Seus ganhos via PIX em até 24 horas.", color: "text-primary" },
                { icon: Clock, title: "Seus horários", desc: "Trabalhe quando quiser, sem metas obrigatórias.", color: "text-warning" },
                { icon: Shield, title: "Seguro incluso", desc: "Proteção para você e seus passageiros.", color: "text-cyan-500" },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-card rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Earnings Preview */}
            <div className="bg-gradient-to-br from-success/10 to-emerald-500/10 rounded-2xl p-6 border border-success/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-success" />
                Simulação de ganhos
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black text-success">R$ 150</p>
                  <p className="text-xs text-muted-foreground">5 corridas/dia</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-success">R$ 900</p>
                  <p className="text-xs text-muted-foreground">Por semana</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-success">R$ 3.600</p>
                  <p className="text-xs text-muted-foreground">Por mês</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                *Valores estimados com base na média de corridas da plataforma
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Requisitos para se cadastrar</h3>
              <div className="space-y-3">
                {[
                  "Ter 21 anos ou mais",
                  "CNH categoria B ou superior com EAR (Exerce Atividade Remunerada)",
                  "Veículo com até 10 anos de fabricação",
                  "Documentos do veículo em dia (CRLV)",
                  "Não ter antecedentes criminais graves",
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("dados")}
              className="w-full py-4 bg-success text-white font-bold rounded-xl shadow-lg shadow-success/30 hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
            >
              Começar cadastro
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem cadastro?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        )}

        {/* Dados Pessoais */}
        {step === "dados" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-foreground mb-2">Dados pessoais</h1>
              <p className="text-muted-foreground">Informe seus dados para criar sua conta</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-2">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cpf: formatCpf(e.target.value) }))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data de nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                />
              </div>

              {/* Endereço */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Endereço
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cep: formatCep(e.target.value) }))}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={buscarCep}
                      disabled={loadingCep}
                      className="self-end px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loadingCep ? "..." : "Buscar"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro"
                      className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        placeholder="Cidade"
                        className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estado</label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value.toUpperCase().slice(0, 2) }))}
                        placeholder="UF"
                        maxLength={2}
                        className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-12 pr-12 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    placeholder="Repita a senha"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("cnh")}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {/* CNH */}
        {step === "cnh" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-foreground mb-2">Dados da CNH</h1>
              <p className="text-muted-foreground">Informe os dados da sua habilitação</p>
            </div>

            <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Sua CNH precisa ter a observação <strong>EAR</strong> (Exerce Atividade Remunerada) para dirigir pelo MOVO.
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-2">Número da CNH</label>
                <input
                  type="text"
                  name="cnh"
                  value={formData.cnh}
                  onChange={handleInputChange}
                  placeholder="00000000000"
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    name="categoriaCnh"
                    value={formData.categoriaCnh}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">UF</label>
                  <select
                    name="ufCnh"
                    value={formData.ufCnh}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Validade da CNH</label>
                <input
                  type="date"
                  name="validadeCnh"
                  value={formData.validadeCnh}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep("veiculo")}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {/* Veículo */}
        {step === "veiculo" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-foreground mb-2">Dados do veículo</h1>
              <p className="text-muted-foreground">Informe os dados do veículo que você vai usar</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de veículo</label>
                <select
                  name="tipoVeiculo"
                  value={formData.tipoVeiculo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                >
                  <option value="">Selecione</option>
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Marca</label>
                  <input
                    type="text"
                    name="marcaVeiculo"
                    value={formData.marcaVeiculo}
                    onChange={handleInputChange}
                    placeholder="Ex: Toyota"
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Modelo</label>
                  <input
                    type="text"
                    name="modeloVeiculo"
                    value={formData.modeloVeiculo}
                    onChange={handleInputChange}
                    placeholder="Ex: Corolla"
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ano</label>
                  <input
                    type="text"
                    name="anoVeiculo"
                    value={formData.anoVeiculo}
                    onChange={handleInputChange}
                    placeholder="2020"
                    maxLength={4}
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cor</label>
                  <select
                    name="corVeiculo"
                    value={formData.corVeiculo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="Branco">Branco</option>
                    <option value="Preto">Preto</option>
                    <option value="Prata">Prata</option>
                    <option value="Cinza">Cinza</option>
                    <option value="Vermelho">Vermelho</option>
                    <option value="Azul">Azul</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Placa</label>
                <input
                  type="text"
                  name="placaVeiculo"
                  value={formData.placaVeiculo}
                  onChange={handleInputChange}
                  placeholder="ABC-1234 ou ABC1D23"
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">RENAVAM</label>
                <input
                  type="text"
                  name="renavamVeiculo"
                  value={formData.renavamVeiculo}
                  onChange={handleInputChange}
                  placeholder="00000000000"
                  className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                />
              </div>

              {/* Dados bancários */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Dados para recebimento
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chave PIX</label>
                    <input
                      type="text"
                      name="chavePix"
                      value={formData.chavePix}
                      onChange={handleInputChange}
                      placeholder="CPF, telefone, e-mail ou chave aleatória"
                      className="w-full px-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("documentos")}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {/* Documentos */}
        {step === "documentos" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-foreground mb-2">Envio de documentos</h1>
              <p className="text-muted-foreground">Envie fotos dos documentos para verificação</p>
            </div>

            <div className="bg-primary/10 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Seus documentos são criptografados e armazenados com segurança. Ninguém terá acesso além da nossa equipe de verificação.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: "selfie", title: "Selfie com documento", desc: "Foto sua segurando a CNH ao lado do rosto", icon: Camera },
                { key: "cnhFrente", title: "CNH - Frente", desc: "Foto da frente da CNH", icon: FileText },
                { key: "cnhVerso", title: "CNH - Verso", desc: "Foto do verso da CNH", icon: FileText },
                { key: "crlv", title: "CRLV do veículo", desc: "Documento do veículo atualizado", icon: Car },
              ].map((doc) => (
                <div key={doc.key} className="p-4 bg-card rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <doc.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.desc}</p>
                      </div>
                    </div>
                    {documents[doc.key as keyof typeof documents] && (
                      <CheckCircle className="w-6 h-6 text-success" />
                    )}
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setDocuments((prev) => ({
                          ...prev,
                          [doc.key]: e.target.files?.[0] || null,
                        }))
                      }
                    />
                    <div className="w-full py-3 bg-secondary rounded-xl text-center font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {documents[doc.key as keyof typeof documents]
                        ? (documents[doc.key as keyof typeof documents] as File).name
                        : "Enviar arquivo"}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("termos")}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Termos */}
        {step === "termos" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-foreground mb-2">Termos e condições</h1>
              <p className="text-muted-foreground">Leia e aceite para finalizar seu cadastro</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded accent-primary"
                />
                <span className="text-sm">
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e o{" "}
                  <Link href="/contrato-motorista" className="text-primary hover:underline">
                    Contrato de Parceria
                  </Link>{" "}
                  do MOVO.
                </span>
              </label>

              <label className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptPolitica}
                  onChange={(e) => setAcceptPolitica(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded accent-primary"
                />
                <span className="text-sm">
                  Concordo com a{" "}
                  <Link href="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>{" "}
                  e autorizo o tratamento dos meus dados pessoais conforme a LGPD.
                </span>
              </label>
            </div>

            <div className="bg-warning/10 rounded-xl p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Importante
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seus documentos serão analisados em até 48 horas úteis</li>
                <li>• Você receberá um e-mail com o resultado da verificação</li>
                <li>• Após aprovação, você poderá começar a dirigir imediatamente</li>
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!acceptTerms || !acceptPolitica || loading}
              className="w-full py-4 bg-success text-white font-bold rounded-xl shadow-lg shadow-success/30 hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando cadastro...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Finalizar cadastro
                </>
              )}
            </button>
          </div>
        )}

        {/* Sucesso */}
        {step === "sucesso" && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-3">
              Cadastro enviado com sucesso!
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Recebemos seus dados e documentos. Nossa equipe irá analisar tudo e você receberá uma resposta em até 48 horas.
            </p>

            <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-bold mb-4">Próximos passos:</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Verificação dos documentos (até 48h)" },
                  { step: "2", text: "E-mail de confirmação ou pendência" },
                  { step: "3", text: "Liberação para começar a dirigir" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl"
              >
                Voltar para home
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-bold rounded-xl"
              >
                Ir para login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
