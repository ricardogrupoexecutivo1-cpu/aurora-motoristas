"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SaveDestination = "aguardando" | "supabase" | "local";

type ServicePayload = {
  os_sistema: string;
  os_cliente: string | null;
  oc_cliente: string | null;
  empresa: string;
  contratante: string;
  cliente: string;
  cliente_final: string;
  contato_cliente_final: string;
  telefone_cliente_final: string;
  motorista: string;
  servico: string;
  tipo_servico: string;
  modo_cobranca: string;
  origem: string;
  destino: string;
  endereco_retirada: string;
  endereco_entrega: string;
  endereco_informado_por: string;
  placa_veiculo: string;
  data_servico: string;
  km: number;
  km_total: number;
  diaria: number;
  pedagio: number;
  estacionamento: number;
  alimentacao: number;
  reembolso: number;
  despesas: number;
  despesas_motorista: number;
  valor_total: number;
  valor_cobranca: number;
  valor_por_km: number;
  valor_motorista: number;
  adiantamento_motorista: number;
  fechamento_motorista: number;
  margem_bruta: number;
  margem_operacao: number;
  etapa: string;
  origem_base: string;
  observacao: string;
  observacoes: string;
  checklist_obrigatorio: boolean;
  checklist_instrucoes: string;
  status: string;
  pago: boolean;
  pago_em: string | null;
  visivel_motorista: boolean;
};

const LOCAL_STORAGE_KEY = "aurora_motoristas_servicos_rascunho";
const DEFAULT_OBSERVACOES =
  "Serviço lançado pelo novo fluxo operacional.";
const DEFAULT_CHECKLIST =
  "Motorista deve realizar checklist e enviar conforme combinado antes da liberação/finalização do serviço.";
const DEFAULT_INFORMADO_POR = "Contratante / cliente";

function normalizeNumberInput(value: string) {
  if (!value) return 0;
  const sanitized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseKmInput(value: string) {
  const sanitized = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDateForInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createOS() {
  return `OS-${Date.now()}`;
}

function getTipoServicoDescricao(tipo: string) {
  switch (tipo) {
    case "busca_veiculo":
      return "Retirada de veículo para locadora, loja ou base operacional.";
    case "entrega_veiculo":
      return "Entrega de veículo ao cliente, empresa ou ponto combinado.";
    case "transporte_executivo":
      return "Serviço executivo urbano, corporativo ou intermunicipal.";
    case "transfer":
      return "Transfer de aeroporto, hotel, evento ou deslocamento especial.";
    default:
      return "Escolha o tipo principal para acelerar o cadastro da operação.";
  }
}

function getModoCobrancaDescricao(modo: string) {
  switch (modo) {
    case "fechado_total":
      return "Cobrança fechada da operação inteira, independentemente do KM final.";
    case "por_km":
      return "Cálculo baseado em distância e valor unitário por KM.";
    default:
      return "Defina como a operação será cobrada ao contratante.";
  }
}

function getTipoServicoNome(tipo: string) {
  switch (tipo) {
    case "busca_veiculo":
      return "Busca de veículo";
    case "entrega_veiculo":
      return "Entrega de veículo";
    case "transporte_executivo":
      return "Transporte executivo";
    case "transfer":
      return "Transfer";
    default:
      return "Serviço";
  }
}

function buildAutoServiceName({
  servico,
  origem,
  destino,
  tipoServico,
  cliente,
  clienteFinal,
}: {
  servico: string;
  origem: string;
  destino: string;
  tipoServico: string;
  cliente: string;
  clienteFinal: string;
}) {
  const servicoTrim = servico.trim();
  if (servicoTrim) return servicoTrim;

  const origemTrim = origem.trim();
  const destinoTrim = destino.trim();
  const clienteBase = clienteFinal.trim() || cliente.trim();
  const tipoNome = getTipoServicoNome(tipoServico);

  if (origemTrim && destinoTrim) {
    return `${origemTrim} x ${destinoTrim}`;
  }

  if (origemTrim) {
    return `${tipoNome} - ${origemTrim}`;
  }

  if (destinoTrim) {
    return `${tipoNome} - ${destinoTrim}`;
  }

  if (clienteBase) {
    return `${tipoNome} - ${clienteBase}`;
  }

  return tipoNome;
}

function hasUsefulDraftData(
  draft: Partial<Record<string, unknown>> | null | undefined
) {
  if (!draft) return false;

  const stringFields = [
    "empresa",
    "contratante",
    "cliente",
    "clienteFinal",
    "contatoClienteFinal",
    "telefoneClienteFinal",
    "motorista",
    "servico",
    "origem",
    "destino",
    "placaVeiculo",
    "enderecoRetirada",
    "enderecoEntrega",
    "osCliente",
    "ocCliente",
  ];

  const hasFilledString = stringFields.some((field) => {
    const value = draft[field];
    return typeof value === "string" && value.trim().length > 0;
  });

  const nonDefaultObservacoes =
    typeof draft.observacoes === "string" &&
    draft.observacoes.trim().length > 0 &&
    draft.observacoes.trim() !== DEFAULT_OBSERVACOES;

  const nonDefaultChecklist =
    typeof draft.checklistInstrucoes === "string" &&
    draft.checklistInstrucoes.trim().length > 0 &&
    draft.checklistInstrucoes.trim() !== DEFAULT_CHECKLIST;

  const nonDefaultInformadoPor =
    typeof draft.enderecoInformadoPor === "string" &&
    draft.enderecoInformadoPor.trim().length > 0 &&
    draft.enderecoInformadoPor.trim() !== DEFAULT_INFORMADO_POR;

  const numericLikeFields = [
    "kmInput",
    "valorCobrancaInput",
    "valorPorKmInput",
    "valorMotoristaInput",
    "adiantamentoMotoristaInput",
    "pedagioInput",
    "estacionamentoInput",
    "alimentacaoInput",
    "reembolsoInput",
  ];

  const hasNonZeroNumeric = numericLikeFields.some((field) => {
    const value = draft[field];
    return typeof value === "string" && normalizeNumberInput(value) > 0;
  });

  return (
    hasFilledString ||
    nonDefaultObservacoes ||
    nonDefaultChecklist ||
    nonDefaultInformadoPor ||
    hasNonZeroNumeric
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < 768);
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

export default function NovoServicoPage() {
  const [saveDestination, setSaveDestination] =
    useState<SaveDestination>("aguardando");
  const [statusText, setStatusText] = useState("Aguardando envio");
  const [saving, setSaving] = useState(false);

  const [osSistema, setOsSistema] = useState(createOS());
  const [osCliente, setOsCliente] = useState("");
  const [ocCliente, setOcCliente] = useState("");
  const [dataServico, setDataServico] = useState(formatDateForInput());
  const [status, setStatus] = useState("pendente");

  const [empresa, setEmpresa] = useState("");
  const [contratante, setContratante] = useState("");
  const [cliente, setCliente] = useState("");
  const [clienteFinal, setClienteFinal] = useState("");
  const [contatoClienteFinal, setContatoClienteFinal] = useState("");
  const [telefoneClienteFinal, setTelefoneClienteFinal] = useState("");
  const [motorista, setMotorista] = useState("");

  const [tipoServico, setTipoServico] = useState("busca_veiculo");
  const [modoCobranca, setModoCobranca] = useState("fechado_total");
  const [servico, setServico] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [placaVeiculo, setPlacaVeiculo] = useState("");
  const [enderecoRetirada, setEnderecoRetirada] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [enderecoInformadoPor, setEnderecoInformadoPor] = useState(
    DEFAULT_INFORMADO_POR
  );

  const [kmInput, setKmInput] = useState("0");
  const [valorCobrancaInput, setValorCobrancaInput] = useState("0,00");
  const [valorPorKmInput, setValorPorKmInput] = useState("0,00");
  const [valorMotoristaInput, setValorMotoristaInput] = useState("0,00");
  const [adiantamentoMotoristaInput, setAdiantamentoMotoristaInput] =
    useState("0,00");
  const [pedagioInput, setPedagioInput] = useState("0,00");
  const [estacionamentoInput, setEstacionamentoInput] = useState("0,00");
  const [alimentacaoInput, setAlimentacaoInput] = useState("0,00");
  const [reembolsoInput, setReembolsoInput] = useState("0,00");

  const [observacoes, setObservacoes] = useState(DEFAULT_OBSERVACOES);
  const [checklistObrigatorio, setChecklistObrigatorio] = useState(true);
  const [checklistInstrucoes, setChecklistInstrucoes] = useState(
    DEFAULT_CHECKLIST
  );

  const isMobile = useIsMobile();

  const km = useMemo(() => parseKmInput(kmInput), [kmInput]);
  const valorCobrancaManual = useMemo(
    () => normalizeNumberInput(valorCobrancaInput),
    [valorCobrancaInput]
  );
  const valorPorKm = useMemo(
    () => normalizeNumberInput(valorPorKmInput),
    [valorPorKmInput]
  );
  const valorMotorista = useMemo(
    () => normalizeNumberInput(valorMotoristaInput),
    [valorMotoristaInput]
  );
  const adiantamentoMotorista = useMemo(
    () => normalizeNumberInput(adiantamentoMotoristaInput),
    [adiantamentoMotoristaInput]
  );
  const pedagio = useMemo(
    () => normalizeNumberInput(pedagioInput),
    [pedagioInput]
  );
  const estacionamento = useMemo(
    () => normalizeNumberInput(estacionamentoInput),
    [estacionamentoInput]
  );
  const alimentacao = useMemo(
    () => normalizeNumberInput(alimentacaoInput),
    [alimentacaoInput]
  );
  const reembolso = useMemo(
    () => normalizeNumberInput(reembolsoInput),
    [reembolsoInput]
  );

  const despesas = useMemo(
    () => pedagio + estacionamento + alimentacao + reembolso,
    [pedagio, estacionamento, alimentacao, reembolso]
  );

  const valorCobrancaCalculado = useMemo(() => {
    if (modoCobranca === "por_km") {
      return km * valorPorKm;
    }
    return valorCobrancaManual;
  }, [km, modoCobranca, valorCobrancaManual, valorPorKm]);

  const fechamentoMotorista = useMemo(() => {
    const resultado = valorMotorista + despesas - adiantamentoMotorista;
    return resultado < 0 ? 0 : resultado;
  }, [valorMotorista, despesas, adiantamentoMotorista]);

  const margemOperacao = useMemo(() => {
    return (
      valorCobrancaCalculado - valorMotorista + adiantamentoMotorista - despesas
    );
  }, [valorCobrancaCalculado, valorMotorista, adiantamentoMotorista, despesas]);

  const nomeServicoAutomatico = useMemo(() => {
    return buildAutoServiceName({
      servico,
      origem,
      destino,
      tipoServico,
      cliente,
      clienteFinal,
    });
  }, [servico, origem, destino, tipoServico, cliente, clienteFinal]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!cached) {
        setStatusText("Tela pronta para novo cadastro.");
        setSaveDestination("aguardando");
        return;
      }

      const parsed = JSON.parse(cached) as Partial<Record<string, unknown>>;
      const hasUsefulData = hasUsefulDraftData(parsed);

      if (typeof parsed.osSistema === "string" && parsed.osSistema) {
        setOsSistema(parsed.osSistema);
      }
      if (typeof parsed.osCliente === "string") setOsCliente(parsed.osCliente);
      if (typeof parsed.ocCliente === "string") setOcCliente(parsed.ocCliente);
      if (typeof parsed.dataServico === "string")
        setDataServico(parsed.dataServico);
      if (typeof parsed.status === "string") setStatus(parsed.status);

      if (typeof parsed.empresa === "string") setEmpresa(parsed.empresa);
      if (typeof parsed.contratante === "string")
        setContratante(parsed.contratante);
      if (typeof parsed.cliente === "string") setCliente(parsed.cliente);
      if (typeof parsed.clienteFinal === "string")
        setClienteFinal(parsed.clienteFinal);
      if (typeof parsed.contatoClienteFinal === "string") {
        setContatoClienteFinal(parsed.contatoClienteFinal);
      }
      if (typeof parsed.telefoneClienteFinal === "string") {
        setTelefoneClienteFinal(parsed.telefoneClienteFinal);
      }
      if (typeof parsed.motorista === "string") setMotorista(parsed.motorista);

      if (typeof parsed.tipoServico === "string")
        setTipoServico(parsed.tipoServico);
      if (typeof parsed.modoCobranca === "string")
        setModoCobranca(parsed.modoCobranca);
      if (typeof parsed.servico === "string") setServico(parsed.servico);
      if (typeof parsed.origem === "string") setOrigem(parsed.origem);
      if (typeof parsed.destino === "string") setDestino(parsed.destino);
      if (typeof parsed.placaVeiculo === "string")
        setPlacaVeiculo(parsed.placaVeiculo);
      if (typeof parsed.enderecoRetirada === "string") {
        setEnderecoRetirada(parsed.enderecoRetirada);
      }
      if (typeof parsed.enderecoEntrega === "string") {
        setEnderecoEntrega(parsed.enderecoEntrega);
      }
      if (typeof parsed.enderecoInformadoPor === "string") {
        setEnderecoInformadoPor(parsed.enderecoInformadoPor);
      }

      if (typeof parsed.kmInput === "string") setKmInput(parsed.kmInput);
      if (typeof parsed.valorCobrancaInput === "string") {
        setValorCobrancaInput(parsed.valorCobrancaInput);
      }
      if (typeof parsed.valorPorKmInput === "string") {
        setValorPorKmInput(parsed.valorPorKmInput);
      }
      if (typeof parsed.valorMotoristaInput === "string") {
        setValorMotoristaInput(parsed.valorMotoristaInput);
      }
      if (typeof parsed.adiantamentoMotoristaInput === "string") {
        setAdiantamentoMotoristaInput(parsed.adiantamentoMotoristaInput);
      }
      if (typeof parsed.pedagioInput === "string")
        setPedagioInput(parsed.pedagioInput);
      if (typeof parsed.estacionamentoInput === "string") {
        setEstacionamentoInput(parsed.estacionamentoInput);
      }
      if (typeof parsed.alimentacaoInput === "string") {
        setAlimentacaoInput(parsed.alimentacaoInput);
      }
      if (typeof parsed.reembolsoInput === "string") {
        setReembolsoInput(parsed.reembolsoInput);
      }

      if (typeof parsed.observacoes === "string")
        setObservacoes(parsed.observacoes);
      if (typeof parsed.checklistInstrucoes === "string") {
        setChecklistInstrucoes(parsed.checklistInstrucoes);
      }
      if (typeof parsed.checklistObrigatorio === "boolean") {
        setChecklistObrigatorio(parsed.checklistObrigatorio);
      }

      if (hasUsefulData) {
        setStatusText("Rascunho local recuperado com sucesso.");
        setSaveDestination("local");
      } else {
        setStatusText("Tela pronta para novo cadastro.");
        setSaveDestination("aguardando");
      }
    } catch {
      setStatusText("Tela pronta para novo cadastro.");
      setSaveDestination("aguardando");
    }
  }, []);

  useEffect(() => {
    const draft = {
      osSistema,
      osCliente,
      ocCliente,
      dataServico,
      status,
      empresa,
      contratante,
      cliente,
      clienteFinal,
      contatoClienteFinal,
      telefoneClienteFinal,
      motorista,
      tipoServico,
      modoCobranca,
      servico,
      origem,
      destino,
      placaVeiculo,
      enderecoRetirada,
      enderecoEntrega,
      enderecoInformadoPor,
      kmInput,
      valorCobrancaInput,
      valorPorKmInput,
      valorMotoristaInput,
      adiantamentoMotoristaInput,
      pedagioInput,
      estacionamentoInput,
      alimentacaoInput,
      reembolsoInput,
      observacoes,
      checklistObrigatorio,
      checklistInstrucoes,
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // mantém silencioso
    }
  }, [
    osSistema,
    osCliente,
    ocCliente,
    dataServico,
    status,
    empresa,
    contratante,
    cliente,
    clienteFinal,
    contatoClienteFinal,
    telefoneClienteFinal,
    motorista,
    tipoServico,
    modoCobranca,
    servico,
    origem,
    destino,
    placaVeiculo,
    enderecoRetirada,
    enderecoEntrega,
    enderecoInformadoPor,
    kmInput,
    valorCobrancaInput,
    valorPorKmInput,
    valorMotoristaInput,
    adiantamentoMotoristaInput,
    pedagioInput,
    estacionamentoInput,
    alimentacaoInput,
    reembolsoInput,
    observacoes,
    checklistObrigatorio,
    checklistInstrucoes,
  ]);

  function limparFormulario() {
    setOsSistema(createOS());
    setOsCliente("");
    setOcCliente("");
    setDataServico(formatDateForInput());
    setStatus("pendente");

    setEmpresa("");
    setContratante("");
    setCliente("");
    setClienteFinal("");
    setContatoClienteFinal("");
    setTelefoneClienteFinal("");
    setMotorista("");

    setTipoServico("busca_veiculo");
    setModoCobranca("fechado_total");
    setServico("");
    setOrigem("");
    setDestino("");
    setPlacaVeiculo("");
    setEnderecoRetirada("");
    setEnderecoEntrega("");
    setEnderecoInformadoPor(DEFAULT_INFORMADO_POR);

    setKmInput("0");
    setValorCobrancaInput("0,00");
    setValorPorKmInput("0,00");
    setValorMotoristaInput("0,00");
    setAdiantamentoMotoristaInput("0,00");
    setPedagioInput("0,00");
    setEstacionamentoInput("0,00");
    setAlimentacaoInput("0,00");
    setReembolsoInput("0,00");

    setObservacoes(DEFAULT_OBSERVACOES);
    setChecklistObrigatorio(true);
    setChecklistInstrucoes(DEFAULT_CHECKLIST);

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // sem impacto
    }

    setSaveDestination("aguardando");
    setStatusText("Formulário limpo para novo cadastro.");
  }

  async function salvar() {
    console.log("SALVAR CLICADO");

    const empresaFinal = empresa.trim();
    const contratanteFinal = (contratante.trim() || empresaFinal).trim();
    const clienteFinalValor = (clienteFinal.trim() || cliente.trim()).trim();
    const clienteBase = cliente.trim() || clienteFinalValor;
    const servicoFinal = buildAutoServiceName({
      servico,
      origem,
      destino,
      tipoServico,
      cliente,
      clienteFinal,
    });
    const motoristaFinal = motorista.trim();

    if (!empresaFinal) {
      setStatusText("Informe a empresa ou contratante principal.");
      alert("Informe a empresa ou contratante principal.");
      return;
    }

    if (!clienteBase) {
      setStatusText("Informe pelo menos o cliente principal.");
      alert("Informe pelo menos o cliente principal.");
      return;
    }

    if (!motoristaFinal) {
      setStatusText("Informe o motorista.");
      alert("Informe o motorista.");
      return;
    }

    const pago = status === "pago";
    const visivelMotorista = !pago;

    const payload: ServicePayload = {
      os_sistema: osSistema,
      os_cliente: osCliente.trim() || null,
      oc_cliente: ocCliente.trim() || null,
      empresa: empresaFinal,
      contratante: contratanteFinal || empresaFinal,
      cliente: clienteBase,
      cliente_final: clienteFinalValor || clienteBase,
      contato_cliente_final: contatoClienteFinal.trim(),
      telefone_cliente_final: telefoneClienteFinal.trim(),
      motorista: motoristaFinal,
      servico: servicoFinal,
      tipo_servico: tipoServico,
      modo_cobranca: modoCobranca,
      origem: origem.trim(),
      destino: destino.trim(),
      endereco_retirada: enderecoRetirada.trim(),
      endereco_entrega: enderecoEntrega.trim(),
      endereco_informado_por: enderecoInformadoPor.trim(),
      placa_veiculo: placaVeiculo.trim().toUpperCase(),
      data_servico: dataServico,
      km,
      km_total: km,
      diaria: valorCobrancaCalculado,
      pedagio,
      estacionamento,
      alimentacao,
      reembolso,
      despesas,
      despesas_motorista: despesas,
      valor_total: valorCobrancaCalculado,
      valor_cobranca: valorCobrancaCalculado,
      valor_por_km: valorPorKm,
      valor_motorista: valorMotorista,
      adiantamento_motorista: adiantamentoMotorista,
      fechamento_motorista: fechamentoMotorista,
      margem_bruta: margemOperacao,
      margem_operacao: margemOperacao,
      etapa: "Operacional",
      origem_base: "Novo serviço",
      observacao: observacoes.trim() || DEFAULT_OBSERVACOES,
      observacoes: observacoes.trim() || DEFAULT_OBSERVACOES,
      checklist_obrigatorio: checklistObrigatorio,
      checklist_instrucoes: checklistInstrucoes.trim(),
      status,
      pago,
      pago_em: pago ? new Date().toISOString() : null,
      visivel_motorista: visivelMotorista,
    };

    console.log("PAYLOAD DO SERVIÇO", payload);

    try {
      setSaving(true);
      setStatusText("Enviando serviço para o Supabase...");
      setSaveDestination("aguardando");

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      console.log("RESPOSTA DO POST", data);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Falha ao salvar no Supabase.");
      }

      try {
        const historical = localStorage.getItem("aurora_motoristas_servicos");
        const parsed = historical ? JSON.parse(historical) : [];
        const next = Array.isArray(parsed) ? parsed : [];
        next.unshift({
          id: data?.service?.id || payload.os_sistema,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        localStorage.setItem("aurora_motoristas_servicos", JSON.stringify(next));
      } catch {
        // complementar
      }

      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // sem impacto
      }

      setSaveDestination("supabase");
      setStatusText("Serviço salvo com sucesso no Supabase.");
      alert(
        `Serviço salvo com sucesso no Supabase.\n\nNome gerado: ${payload.servico}`
      );
      limparFormulario();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar o serviço.";

      console.error("ERRO AO SALVAR", error);

      try {
        const historical = localStorage.getItem("aurora_motoristas_servicos");
        const parsed = historical ? JSON.parse(historical) : [];
        const next = Array.isArray(parsed) ? parsed : [];
        next.unshift({
          id: payload.os_sistema,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          local_fallback: true,
        });
        localStorage.setItem("aurora_motoristas_servicos", JSON.stringify(next));
        setSaveDestination("local");
        setStatusText(`${message} Registro preservado em fallback local.`);
        alert(
          `${message}\n\nRegistro preservado em fallback local.\n\nNome gerado: ${payload.servico}`
        );
      } catch {
        setSaveDestination("aguardando");
        setStatusText(message);
        alert(message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: isMobile ? "16px 12px 36px" : "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/servicos" style={topSecondaryLink}>
              Voltar para serviços
            </Link>

            <Link href="/" style={topSecondaryLink}>
              Início
            </Link>
          </div>

          <div style={statusBadgeStyle}>
            {saving ? "Salvando..." : statusText}
          </div>
        </div>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: isMobile ? 18 : 22,
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e7eef6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={chipBlue}>Aurora Motoristas</span>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 28 : 32,
                lineHeight: 1.1,
                wordBreak: "break-word",
              }}
            >
              Novo serviço
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Cadastro operacional com salvamento prioritário no Supabase e
              fallback temporário em localStorage. Esta tela mantém a blindagem
              da operação e não altera a regra do motorista: após pagamento, o
              serviço sai da visão ativa e fica preservado no histórico interno.
            </p>

            <div
              style={{
                marginTop: 4,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={chipNeutral}>
                Destino do salvamento:{" "}
                {saveDestination === "supabase"
                  ? "Supabase"
                  : saveDestination === "local"
                  ? "Fallback local"
                  : "Aguardando envio"}
              </span>

              <span style={chipWarning}>
                Sistema em constante atualização e podem ocorrer instabilidades
                momentâneas.
              </span>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          <SummaryCard label="Status inicial" value={status} />
          <SummaryCard
            label="Tipo selecionado"
            value={
              tipoServico === "busca_veiculo"
                ? "Busca de veículo"
                : tipoServico === "entrega_veiculo"
                ? "Entrega de veículo"
                : tipoServico === "transporte_executivo"
                ? "Transporte executivo"
                : "Transfer"
            }
          />
          <SummaryCard
            label="Modo de cobrança"
            value={modoCobranca === "por_km" ? "Por KM" : "Fechado total"}
          />
          <SummaryCard label="Nome previsto" value={nomeServicoAutomatico} />
          <SummaryCard
            label="Margem da operação"
            value={formatCurrency(margemOperacao)}
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: isMobile ? 16 : 20,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Dados principais
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              <Field
                label="OS"
                value={osSistema}
                onChange={setOsSistema}
                placeholder="Ex.: OS-2026-000145"
              />
              <Field
                label="Data do serviço"
                value={dataServico}
                onChange={setDataServico}
                type="date"
              />
              <Field
                label="OS do cliente"
                value={osCliente}
                onChange={setOsCliente}
                placeholder="Opcional"
              />
              <Field
                label="OC do cliente"
                value={ocCliente}
                onChange={setOcCliente}
                placeholder="Opcional"
              />
              <SelectField
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "pendente", label: "pendente" },
                  {
                    value: "aguardando_pagamento",
                    label: "aguardando_pagamento",
                  },
                  { value: "pago", label: "pago" },
                ]}
              />
              <SelectField
                label="Tipo de serviço"
                value={tipoServico}
                onChange={setTipoServico}
                options={[
                  { value: "busca_veiculo", label: "Busca de veículo" },
                  { value: "entrega_veiculo", label: "Entrega de veículo" },
                  {
                    value: "transporte_executivo",
                    label: "Transporte executivo",
                  },
                  { value: "transfer", label: "Transfer" },
                ]}
              />
            </div>

            <InfoBox
              title="Tipo de serviço"
              text={getTipoServicoDescricao(tipoServico)}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              <Field
                label="Empresa"
                value={empresa}
                onChange={setEmpresa}
                placeholder="Ex.: Aurora Locadoras Premium"
              />
              <Field
                label="Contratante"
                value={contratante}
                onChange={setContratante}
                placeholder="Ex.: RAJA ALUGUEL DE VEICULOS"
              />
              <Field
                label="Cliente"
                value={cliente}
                onChange={setCliente}
                placeholder="Ex.: Alexandre"
              />
              <Field
                label="Cliente final"
                value={clienteFinal}
                onChange={setClienteFinal}
                placeholder="Ex.: Alexandre"
              />
              <Field
                label="Contato do cliente"
                value={contatoClienteFinal}
                onChange={setContatoClienteFinal}
                placeholder="Ex.: Sabrina"
              />
              <Field
                label="Telefone do cliente"
                value={telefoneClienteFinal}
                onChange={setTelefoneClienteFinal}
                placeholder="Ex.: 31999999999"
              />
              <Field
                label="Motorista"
                value={motorista}
                onChange={setMotorista}
                placeholder="Ex.: Paulo Santos"
              />
              <Field
                label="Nome do serviço"
                value={servico}
                onChange={setServico}
                placeholder="Se deixar em branco, o sistema gera automaticamente"
              />
              <Field
                label="Origem"
                value={origem}
                onChange={setOrigem}
                placeholder="Ex.: Pátio BH"
              />
              <Field
                label="Destino"
                value={destino}
                onChange={setDestino}
                placeholder="Ex.: Sinop"
              />
              <Field
                label="Placa"
                value={placaVeiculo}
                onChange={setPlacaVeiculo}
                placeholder="Ex.: TXT-1E25"
              />
              <Field
                label="Informado por"
                value={enderecoInformadoPor}
                onChange={setEnderecoInformadoPor}
                placeholder="Ex.: Contratante / cliente"
              />
            </div>

            <InfoBox
              title="Nome automático"
              text={`Se o campo "Nome do serviço" ficar vazio, o sistema usará: ${nomeServicoAutomatico}`}
            />

            <Field
              label="Endereço de retirada"
              value={enderecoRetirada}
              onChange={setEnderecoRetirada}
              placeholder="Ex.: Estrada Tarcísio Schettino Ribeiro, 760"
            />

            <Field
              label="Endereço de entrega"
              value={enderecoEntrega}
              onChange={setEnderecoEntrega}
              placeholder="Ex.: Rua do Sumidouro, 555"
            />

            <TextAreaField
              label="Observações"
              value={observacoes}
              onChange={setObservacoes}
              placeholder="Observações operacionais..."
            />
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: isMobile ? 16 : 20,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Valores e fechamento
            </h2>

            <SelectField
              label="Modo de cobrança ao contratante"
              value={modoCobranca}
              onChange={setModoCobranca}
              options={[
                { value: "fechado_total", label: "Fechado total" },
                { value: "por_km", label: "Por KM" },
              ]}
            />

            <InfoBox
              title="Modo de cobrança"
              text={getModoCobrancaDescricao(modoCobranca)}
            />

            <Field
              label="KM total"
              value={kmInput}
              onChange={setKmInput}
              placeholder="Ex.: 150"
            />

            {modoCobranca === "por_km" ? (
              <Field
                label="Valor por KM"
                value={valorPorKmInput}
                onChange={setValorPorKmInput}
                placeholder="0,00"
              />
            ) : (
              <Field
                label="Valor da cobrança"
                value={valorCobrancaInput}
                onChange={setValorCobrancaInput}
                placeholder="0,00"
              />
            )}

            <Field
              label="Valor do motorista"
              value={valorMotoristaInput}
              onChange={setValorMotoristaInput}
              placeholder="0,00"
            />

            <Field
              label="Adiantamento do motorista"
              value={adiantamentoMotoristaInput}
              onChange={setAdiantamentoMotoristaInput}
              placeholder="0,00"
            />

            <Field
              label="Pedágio"
              value={pedagioInput}
              onChange={setPedagioInput}
              placeholder="0,00"
            />

            <Field
              label="Estacionamento"
              value={estacionamentoInput}
              onChange={setEstacionamentoInput}
              placeholder="0,00"
            />

            <Field
              label="Alimentação"
              value={alimentacaoInput}
              onChange={setAlimentacaoInput}
              placeholder="0,00"
            />

            <Field
              label="Reembolso / outras despesas"
              value={reembolsoInput}
              onChange={setReembolsoInput}
              placeholder="0,00"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <ResultCard
                label="Cobrança final"
                value={formatCurrency(valorCobrancaCalculado)}
              />
              <ResultCard
                label="Despesas totais"
                value={formatCurrency(despesas)}
              />
              <ResultCard
                label="Fechamento motorista"
                value={formatCurrency(fechamentoMotorista)}
              />
              <ResultCard
                label="Margem da operação"
                value={formatCurrency(margemOperacao)}
              />
            </div>

            <div
              style={{
                borderRadius: 18,
                background: "#f8fbff",
                border: "1px solid #e5edf5",
                padding: 16,
                color: "#435b6e",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#123047" }}>Regra aplicada:</strong>{" "}
              fechamento do motorista = valor do motorista + despesas -
              adiantamento. Margem da operação = cobrança - valor do motorista +
              adiantamento - despesas.
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: 14,
                borderRadius: 18,
                background: "#f8fbff",
                border: "1px solid #e5edf5",
              }}
            >
              <input
                type="checkbox"
                checked={checklistObrigatorio}
                onChange={(e) => setChecklistObrigatorio(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span
                style={{
                  color: "#435b6e",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Checklist obrigatório nesta operação
              </span>
            </label>

            <TextAreaField
              label="Instruções do checklist"
              value={checklistInstrucoes}
              onChange={setChecklistInstrucoes}
              placeholder="Orientações para o motorista..."
            />
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: isMobile ? 16 : 20,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#4b6478",
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 780,
            }}
          >
            Blindagem mantida: esta tela cadastra o serviço, mas não expõe visão
            financeira ao motorista. Quando o status for <strong>pago</strong>,
            o sistema já envia <strong>visível para motorista = não</strong> e
            preserva o item apenas no histórico interno protegido.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={limparFormulario}
              disabled={saving}
              style={secondaryButton}
            >
              Limpar
            </button>

            <button
              type="button"
              onClick={() => {
                console.log("BOTÃO SALVAR PRESSIONADO");
                salvar();
              }}
              disabled={saving}
              style={{
                ...primaryButton,
                opacity: saving ? 0.8 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Salvando..." : "Salvar serviço"}
            </button>
          </div>
        </section>

        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Sistema em constante atualização • podem ocorrer instabilidades
          momentâneas
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 18,
        border: "1px solid #e7eef6",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: "#5b7488",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#123047",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#fcfdff",
        border: "1px solid #e7eef6",
        borderRadius: 16,
        padding: 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: "#6b7f90",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#123047",
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoBox({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#f8fbff",
        border: "1px solid #e5edf5",
        padding: 14,
        color: "#435b6e",
        fontSize: 14,
        lineHeight: 1.7,
      }}
    >
      <strong style={{ color: "#123047" }}>{title}:</strong> {text}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          color: "#5b7488",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fieldStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          color: "#5b7488",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <select value={value} onChange={(e) => onChange(e.target.value)} style={fieldStyle}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          color: "#5b7488",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          ...fieldStyle,
          resize: "vertical",
          fontFamily: "Arial, sans-serif",
          minHeight: 110,
        }}
      />
    </label>
  );
}

const fieldStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #d8e3ee",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  background: "#f8fbff",
  color: "#123047",
  boxSizing: "border-box",
  width: "100%",
};

const topSecondaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const statusBadgeStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#5b7488",
  border: "1px solid #e7eef6",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const chipBlue: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#e0f2fe",
  color: "#075985",
  borderRadius: 999,
  padding: "6px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const chipNeutral: React.CSSProperties = {
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const chipWarning: React.CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid #dbe5ef",
  background: "#ffffff",
  color: "#123047",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
};