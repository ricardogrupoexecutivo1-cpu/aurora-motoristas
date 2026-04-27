"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  ArrowLeft,
  ArrowRight,
  User,
  Car,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Smartphone,
  FileText,
  Camera,
  Upload,
  Star,
  Zap,
  Wallet,
  MapPin,
  Clock,
  CreditCard,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

type UserType = "passageiro" | "motorista" | "empresa";
type Step = "tipo" | "dados" | "documentos" | "verificacao" | "sucesso";

export default function CadastroPage() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState<Step>("tipo");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    // Motorista
    cnh: "",
    categoriaCnh: "",
    validadeCnh: "",
    // Veículo
    placaVeiculo: "",
    modeloVeiculo: "",
    anoVeiculo: "",
    corVeiculo: "",
    // Empresa
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
  });

  const [documents, setDocuments] = useState({
    selfie: null as File | null,
    cnhFrente: null as File | null,
    cnhVerso: null as File | null,
    crlv: null as File | null,
    comprovanteResidencia: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setStep("sucesso");
  };

  const renderStepIndicator = () => {
    const steps = userType === "passageiro" 
      ? ["Tipo", "Dados", "Verificação", "Sucesso"]
      : ["Tipo", "Dados", "Documentos", "Verificação", "Sucesso"];
    
    const currentIndex = steps.indexOf(
      step === "tipo" ? "Tipo" : 
      step === "dados" ? "Dados" : 
      step === "documentos" ? "Documentos" :
      step === "verificacao" ? "Verificação" : "Sucesso"
    );

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= currentIndex
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < currentIndex ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 lg:w-16 h-1 mx-1 rounded-full transition-all ${
                  i < currentIndex ? "bg-primary" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              {step !== "tipo" && step !== "sucesso" ? (
                <button
                  onClick={() => {
                    if (step === "dados") setStep("tipo");
                    else if (step === "documentos") setStep("dados");
                    else if (step === "verificacao") {
                      if (userType === "passageiro") setStep("dados");
                      else setStep("documentos");
                    }
                  }}
                  className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-black">Aurora Motoristas</span>
            </Link>

            <Link
              href="/login"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
        {step !== "sucesso" && renderStepIndicator()}

        {/* Tipo de Usuário */}
        {step === "tipo" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                Criar sua conta Aurora Motoristas
              </h1>
              <p className="text-muted-foreground">
                Escolha como você quer usar a plataforma
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "passageiro",
                  icon: User,
                  title: "Quero solicitar corridas",
                  desc: "Viaje com segurança, praticidade e os melhores preços",
                  features: ["GPS em tempo real", "Pagamento flexível", "Avaliação de motoristas"],
                  color: "primary",
                },
                {
                  id: "motorista",
                  icon: Car,
                  title: "Quero ser motorista parceiro",
                  desc: "Ganhe dinheiro dirigindo com a menor taxa do mercado",
                  features: ["Taxa de apenas 5%", "Receba em 24h via PIX", "Sem metas obrigatórias"],
                  color: "success",
                  highlight: true,
                },
                {
                  id: "empresa",
                  icon: Building2,
                  title: "Quero conta empresarial",
                  desc: "Gerencie a mobilidade da sua equipe em um só lugar",
                  features: ["Dashboard completo", "Faturamento mensal", "Múltiplos usuários"],
                  color: "warning",
                },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setUserType(type.id as UserType);
                    setStep("dados");
                  }}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all hover:shadow-xl ${
                    type.highlight
                      ? `border-${type.color} bg-${type.color}/5`
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-${type.color}/10 flex items-center justify-center flex-shrink-0`}>
                      <type.icon className={`w-7 h-7 text-${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{type.title}</h3>
                        {type.highlight && (
                          <span className="px-2 py-0.5 bg-success text-white text-xs font-bold rounded-full">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{type.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((f) => (
                          <span key={f} className="px-2 py-1 bg-secondary text-xs rounded-lg">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dados Pessoais */}
        {step === "dados" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                {userType === "passageiro" && "Dados pessoais"}
                {userType === "motorista" && "Dados do motorista"}
                {userType === "empresa" && "Dados da empresa"}
              </h1>
              <p className="text-muted-foreground">
                Preencha seus dados para criar sua conta
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
              {/* Campos comuns */}
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
                    className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
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
                    className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

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
                    className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {userType !== "empresa" && (
                <div>
                  <label className="block text-sm font-medium mb-2">CPF</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Campos específicos de empresa */}
              {userType === "empresa" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">CNPJ</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Razão Social</label>
                    <input
                      type="text"
                      name="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={handleInputChange}
                      placeholder="Razão social da empresa"
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Fantasia</label>
                    <input
                      type="text"
                      name="nomeFantasia"
                      value={formData.nomeFantasia}
                      onChange={handleInputChange}
                      placeholder="Nome fantasia"
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Campos específicos de motorista */}
              {userType === "motorista" && (
                <>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Dados da CNH
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Número da CNH</label>
                      <input
                        type="text"
                        name="cnh"
                        value={formData.cnh}
                        onChange={handleInputChange}
                        placeholder="00000000000"
                        className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <select
                        name="categoriaCnh"
                        value={formData.categoriaCnh}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Selecione</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
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
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Dados do Veículo
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Placa</label>
                      <input
                        type="text"
                        name="placaVeiculo"
                        value={formData.placaVeiculo}
                        onChange={handleInputChange}
                        placeholder="ABC-1234"
                        className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ano</label>
                      <input
                        type="text"
                        name="anoVeiculo"
                        value={formData.anoVeiculo}
                        onChange={handleInputChange}
                        placeholder="2020"
                        maxLength={4}
                        className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Modelo do veículo</label>
                    <input
                      type="text"
                      name="modeloVeiculo"
                      value={formData.modeloVeiculo}
                      onChange={handleInputChange}
                      placeholder="Ex: Toyota Corolla"
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cor do veículo</label>
                    <select
                      name="corVeiculo"
                      value={formData.corVeiculo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Selecione a cor</option>
                      <option value="Branco">Branco</option>
                      <option value="Preto">Preto</option>
                      <option value="Prata">Prata</option>
                      <option value="Cinza">Cinza</option>
                      <option value="Vermelho">Vermelho</option>
                      <option value="Azul">Azul</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </>
              )}

              {/* Senha */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Criar senha
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-12 pr-12 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
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
                    className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (userType === "passageiro") setStep("verificacao");
                  else setStep("documentos");
                }}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {/* Documentos (Motorista/Empresa) */}
        {step === "documentos" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                Envio de documentos
              </h1>
              <p className="text-muted-foreground">
                Envie os documentos para verificação. É rápido e Ambiente seguro.
              </p>
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary">Seus dados estão Ambiente seguros</p>
                <p className="text-sm text-muted-foreground">
                  Todos os documentos são criptografados e armazenados de forma segura.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Selfie */}
              <div className="p-4 bg-card rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Selfie com documento</p>
                      <p className="text-xs text-muted-foreground">Foto segurando sua CNH</p>
                    </div>
                  </div>
                  {documents.selfie && <CheckCircle className="w-6 h-6 text-success" />}
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => setDocuments((prev) => ({ ...prev, selfie: e.target.files?.[0] || null }))}
                  />
                  <div className="w-full py-3 bg-secondary rounded-xl text-center font-medium cursor-pointer hover:bg-secondary/80 transition-colors">
                    {documents.selfie ? "Trocar foto" : "Tirar foto"}
                  </div>
                </label>
              </div>

              {/* CNH Frente */}
              <div className="p-4 bg-card rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">CNH - Frente</p>
                      <p className="text-xs text-muted-foreground">Foto da frente da CNH</p>
                    </div>
                  </div>
                  {documents.cnhFrente && <CheckCircle className="w-6 h-6 text-success" />}
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setDocuments((prev) => ({ ...prev, cnhFrente: e.target.files?.[0] || null }))}
                  />
                  <div className="w-full py-3 bg-secondary rounded-xl text-center font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {documents.cnhFrente ? documents.cnhFrente.name : "Enviar arquivo"}
                  </div>
                </label>
              </div>

              {/* CNH Verso */}
              <div className="p-4 bg-card rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">CNH - Verso</p>
                      <p className="text-xs text-muted-foreground">Foto do verso da CNH</p>
                    </div>
                  </div>
                  {documents.cnhVerso && <CheckCircle className="w-6 h-6 text-success" />}
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setDocuments((prev) => ({ ...prev, cnhVerso: e.target.files?.[0] || null }))}
                  />
                  <div className="w-full py-3 bg-secondary rounded-xl text-center font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {documents.cnhVerso ? documents.cnhVerso.name : "Enviar arquivo"}
                  </div>
                </label>
              </div>

              {/* CRLV */}
              {userType === "motorista" && (
                <div className="p-4 bg-card rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">CRLV do veículo</p>
                        <p className="text-xs text-muted-foreground">Documento do veículo</p>
                      </div>
                    </div>
                    {documents.crlv && <CheckCircle className="w-6 h-6 text-success" />}
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setDocuments((prev) => ({ ...prev, crlv: e.target.files?.[0] || null }))}
                    />
                    <div className="w-full py-3 bg-secondary rounded-xl text-center font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {documents.crlv ? documents.crlv.name : "Enviar arquivo"}
                    </div>
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep("verificacao")}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Verificação */}
        {step === "verificacao" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                Revisar e confirmar
              </h1>
              <p className="text-muted-foreground">
                Verifique seus dados antes de finalizar
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Dados pessoais
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium">{formData.nome || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">E-mail:</span>
                    <span className="font-medium">{formData.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="font-medium">{formData.telefone || "-"}</span>
                  </div>
                </div>
              </div>

              {userType === "motorista" && (
                <>
                  <div className="p-4 bg-card rounded-2xl border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      CNH
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Número:</span>
                        <span className="font-medium">{formData.cnh || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoria:</span>
                        <span className="font-medium">{formData.categoriaCnh || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-2xl border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Veículo
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modelo:</span>
                        <span className="font-medium">{formData.modeloVeiculo || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="font-medium">{formData.placaVeiculo || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cor:</span>
                        <span className="font-medium">{formData.corVeiculo || "-"}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <label className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-border"
                />
                <span className="text-sm">
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>{" "}
                  do Aurora Motoristas.
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!acceptTerms || loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Criar minha conta
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
              Conta criada com sucesso!
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {userType === "passageiro" && "Sua conta foi criada. Agora você pode solicitar corridas e aproveitar todos os benefícios do Aurora Motoristas."}
              {userType === "motorista" && "Recebemos seus dados! Nossa equipe irá verificar seus documentos em até 48 horas. Você receberá um e-mail com a confirmação."}
              {userType === "empresa" && "Sua conta empresarial foi criada. Nossa equipe comercial entrará em contato em breve."}
            </p>

            {userType === "motorista" && (
              <div className="bg-warning/10 rounded-2xl p-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-warning flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-warning">Verificação em andamento</p>
                    <p className="text-sm text-muted-foreground">
                      Seus documentos estão sendo analisados. Prazo: 24-48 horas úteis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {userType === "passageiro" && (
                <Link
                  href="/solicitar"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl"
                >
                  <MapPin className="w-5 h-5" />
                  Solicitar primeira corrida
                </Link>
              )}
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-bold rounded-xl"
              >
                Acessar minha conta
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


