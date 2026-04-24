"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type CadastroTipo = "Cliente" | "Motorista" | "Fornecedor";
type PessoaTipo = "CPF" | "CNPJ";

type CadastroItem = {
  id: string;
  tipoCadastro: CadastroTipo;
  tipoDocumento: PessoaTipo;
  documento: string;
  nome: string;
  nomeFantasia: string;
  razaoSocial: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  endereco: string;
  observacao: string;
  fotoMotorista: string;
};

type AccessRole =
  | "Admin Master"
  | "Administrador"
  | "Financeiro"
  | "Operacional"
  | "Leitura";

type PermissionItem = {
  id: string;
  nome: string;
  email: string;
  role: AccessRole;
  financeiro: boolean;
  cadastros: boolean;
  diarias: boolean;
  relatorios: boolean;
  operacao: boolean;
  translados: boolean;
  observacao: string;
};

const PERMISSIONS_STORAGE_KEY = "aurora_motoristas_permissoes";
const SESSION_EMAIL_STORAGE_KEY = "aurora_motoristas_session_email";

const baseCadastros: CadastroItem[] = [
  {
    id: "CAD-0001",
    tipoCadastro: "Motorista",
    tipoDocumento: "CPF",
    documento: "123.456.789-00",
    nome: "Pedro Paulo",
    nomeFantasia: "",
    razaoSocial: "",
    email: "pedropaulo@aurora.com",
    telefone: "(31) 99999-1111",
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco: "Rua Exemplo, 100",
    observacao: "Motorista ativo em operação de translados.",
    fotoMotorista: "",
  },
  {
    id: "CAD-0002",
    tipoCadastro: "Cliente",
    tipoDocumento: "CNPJ",
    documento: "12.345.678/0001-90",
    nome: "Aurora Locadoras Premium",
    nomeFantasia: "Aurora Premium",
    razaoSocial: "Aurora Locadoras Premium LTDA",
    email: "contato@aurorapremium.com",
    telefone: "(31) 98888-2222",
    cidade: "Lagoa Santa",
    estado: "MG",
    endereco: "Av. Principal, 500",
    observacao: "Cliente com operação recorrente de aeroporto.",
    fotoMotorista: "",
  },
];

const mockReceitaData: Record<string, Partial<CadastroItem>> = {
  "12345678900": {
    nome: "PEDRO PAULO SILVA",
    email: "pedropaulo@motoristas.com",
    telefone: "(31) 99999-1111",
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco: "Rua do Motorista, 150",
  },
  "12345678000190": {
    nome: "AURORA LOCADORAS PREMIUM",
    nomeFantasia: "Aurora Premium",
    razaoSocial: "Aurora Locadoras Premium LTDA",
    email: "financeiro@aurorapremium.com",
    telefone: "(31) 98888-2222",
    cidade: "Lagoa Santa",
    estado: "MG",
    endereco: "Av. Operacional, 500",
  },
  "99888777000166": {
    nome: "FORNECEDORA MASTER AUTOPECAS",
    nomeFantasia: "Master Autopeças",
    razaoSocial: "Fornecedora Master Autopeças LTDA",
    email: "comercial@masterautopecas.com",
    telefone: "(31) 97777-4444",
    cidade: "Contagem",
    estado: "MG",
    endereco: "Rodovia Industrial, 800",
  },
};

function normalizeDocument(value: string) {
  return value.replace(/\D/g, "");
}

function safeReadPermissions(): PermissionItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as PermissionItem[];
  } catch {
    return [];
  }
}

function safeReadSessionEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SESSION_EMAIL_STORAGE_KEY) || "";
}

function safeWriteSessionEmail(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_EMAIL_STORAGE_KEY, email);
}

export default function CadastrosInteligentesPage() {
  const [cadastros, setCadastros] = useState<CadastroItem[]>(baseCadastros);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");

  const [sessionEmail, setSessionEmail] = useState("");
  const [permissionName, setPermissionName] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");

  const [form, setForm] = useState<CadastroItem>({
    id: "",
    tipoCadastro: "Cliente",
    tipoDocumento: "CNPJ",
    documento: "",
    nome: "",
    nomeFantasia: "",
    razaoSocial: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    endereco: "",
    observacao: "",
    fotoMotorista: "",
  });

  useEffect(() => {
    const savedEmail = safeReadSessionEmail();
    setSessionEmail(savedEmail);
    validateAccess(savedEmail);
  }, []);

  function validateAccess(emailToCheck: string) {
    const email = emailToCheck.trim().toLowerCase();
    const permissions = safeReadPermissions();

    if (!email) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName("");
      setAccessMessage("Informe o e-mail de sessão local para validar acesso aos cadastros.");
      return;
    }

    const found = permissions.find(
      (item) => item.email.trim().toLowerCase() === email
    );

    if (!found) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName("");
      setAccessMessage("Este e-mail não está na base de autorizados.");
      return;
    }

    if (!found.cadastros) {
      setAccessGranted(false);
      setAccessChecked(true);
      setPermissionName(found.nome);
      setAccessMessage("Este usuário existe, mas não possui liberação para o módulo de cadastros.");
      return;
    }

    setAccessGranted(true);
    setAccessChecked(true);
    setPermissionName(found.nome);
    setAccessMessage(`Acesso liberado para ${found.nome} (${found.role}).`);
  }

  function confirmarSessaoLocal() {
    safeWriteSessionEmail(sessionEmail);
    validateAccess(sessionEmail);
  }

  function updateForm<K extends keyof CadastroItem>(
    field: K,
    value: CadastroItem[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function changeTipoCadastro(value: CadastroTipo) {
    setForm((current) => ({
      ...current,
      tipoCadastro: value,
      tipoDocumento: value === "Motorista" ? "CPF" : current.tipoDocumento,
    }));
  }

  function changeTipoDocumento(value: PessoaTipo) {
    setForm((current) => ({
      ...current,
      tipoDocumento: value,
    }));
  }

  function buscarDocumento() {
    const normalized = normalizeDocument(form.documento);

    if (!normalized) {
      alert("Digite CPF ou CNPJ antes de buscar.");
      return;
    }

    const found = mockReceitaData[normalized];

    if (!found) {
      setFeedback(
        "Nenhum dado automático encontrado nesta simulação. Você pode preencher manualmente e editar tudo normalmente."
      );
      return;
    }

    setForm((current) => ({
      ...current,
      nome: found.nome ?? current.nome,
      nomeFantasia: found.nomeFantasia ?? current.nomeFantasia,
      razaoSocial: found.razaoSocial ?? current.razaoSocial,
      email: found.email ?? current.email,
      telefone: found.telefone ?? current.telefone,
      cidade: found.cidade ?? current.cidade,
      estado: found.estado ?? current.estado,
      endereco: found.endereco ?? current.endereco,
    }));

    setFeedback(
      "Dados automáticos carregados. Confira e edite tudo que estiver diferente do real."
    );
  }

  function onFotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((current) => ({
        ...current,
        fotoMotorista: result,
      }));
      setFeedback("Foto carregada com sucesso.");
    };
    reader.readAsDataURL(file);
  }

  function salvarCadastro() {
    if (!form.nome.trim() || !form.documento.trim()) {
      alert("Preencha pelo menos nome e CPF/CNPJ.");
      return;
    }

    const novoCadastro: CadastroItem = {
      ...form,
      id: `CAD-${String(cadastros.length + 1).padStart(4, "0")}`,
    };

    setCadastros((current) => [novoCadastro, ...current]);

    setForm({
      id: "",
      tipoCadastro: "Cliente",
      tipoDocumento: "CNPJ",
      documento: "",
      nome: "",
      nomeFantasia: "",
      razaoSocial: "",
      email: "",
      telefone: "",
      cidade: "",
      estado: "",
      endereco: "",
      observacao: "",
      fotoMotorista: "",
    });

    setFeedback("Cadastro salvo com sucesso.");
  }

  const filteredCadastros = useMemo(() => {
    return cadastros.filter((item) =>
      `${item.id} ${item.tipoCadastro} ${item.tipoDocumento} ${item.documento} ${item.nome} ${item.nomeFantasia} ${item.razaoSocial} ${item.email} ${item.telefone} ${item.cidade} ${item.estado} ${item.endereco}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [cadastros, search]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ CADASTROS</div>
              <h1 style={styles.heroTitle}>
                Cadastro inteligente com CPF/CNPJ, dados editáveis e foto do motorista
              </h1>
              <p style={styles.heroText}>
                Esta área agora também valida se o e-mail de sessão local possui
                liberação para acessar os cadastros inteligentes.
              </p>

              <div style={styles.heroActions}>
                <Link href="/seguranca" style={styles.secondaryButton}>
                  Voltar para segurança
                </Link>
                <Link href="/financeiro" style={styles.primaryButton}>
                  Ir para financeiro
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>CADASTRO PROTEGIDO</span>
              <h2 style={styles.sideTitle}>Acesso só para autorizados</h2>
              <p style={styles.sideText}>
                Esta camada já bloqueia o módulo para quem não tiver permissão
                específica de cadastros na central de segurança.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>CPF / CNPJ</div>
                <div style={styles.sidePill}>Dados editáveis</div>
                <div style={styles.sidePill}>Acesso controlado</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta tela já faz a trava real por
            permissão local e será conectada depois Ã  sessão completa do app.
          </div>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.accessCard}>
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionEyebrow}>VALIDAÇÃƒO DE ACESSO</span>
              <h2 style={styles.sectionTitle}>Sessão local dos cadastros</h2>
            </div>
          </div>

          <div style={styles.accessGrid}>
            <div style={styles.field}>
              <label style={styles.label}>E-mail da sessão local</label>
              <input
                value={sessionEmail}
                onChange={(e) => setSessionEmail(e.target.value)}
                style={styles.input}
                placeholder="Digite o e-mail liberado no módulo segurança"
              />
            </div>

            <div style={styles.actionRow}>
              <button type="button" onClick={confirmarSessaoLocal} style={styles.primaryAction}>
                Validar acesso
              </button>
            </div>
          </div>

          {accessChecked ? (
            <div
              style={
                accessGranted ? styles.accessSuccessBox : styles.accessErrorBox
              }
            >
              {accessMessage}
              {permissionName ? ` Usuário reconhecido: ${permissionName}.` : ""}
            </div>
          ) : null}
        </div>
      </section>

      {!accessGranted ? (
        <section style={styles.contentSection}>
          <div style={styles.blockedCard}>
            <span style={styles.sectionEyebrow}>ACESSO BLOQUEADO</span>
            <h2 style={styles.sidebarTitle}>Cadastros protegidos</h2>
            <p style={styles.blockedText}>
              Esta área é sensível e só pode ser vista por administrador ou por quem
              tiver liberação específica no módulo de segurança.
            </p>

            <div style={styles.navList}>
              <Link href="/seguranca" style={styles.navItem}>
                Abrir segurança
              </Link>
              <Link href="/operacao" style={styles.navItem}>
                Voltar para operação
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section style={styles.contentSection}>
          <div style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <div style={styles.formCard}>
                <div style={styles.sectionHeader}>
                  <div>
                    <span style={styles.sectionEyebrow}>NOVO CADASTRO</span>
                    <h2 style={styles.sectionTitle}>Cliente, motorista ou fornecedor</h2>
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Tipo de cadastro</label>
                    <select
                      value={form.tipoCadastro}
                      onChange={(e) => changeTipoCadastro(e.target.value as CadastroTipo)}
                      style={styles.select}
                    >
                      <option>Cliente</option>
                      <option>Motorista</option>
                      <option>Fornecedor</option>
                    </select>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Tipo de documento</label>
                    <select
                      value={form.tipoDocumento}
                      onChange={(e) => changeTipoDocumento(e.target.value as PessoaTipo)}
                      style={styles.select}
                    >
                      <option>CPF</option>
                      <option>CNPJ</option>
                    </select>
                  </div>

                  <div style={styles.fieldWide}>
                    <label style={styles.label}>CPF / CNPJ</label>
                    <div style={styles.inlineRow}>
                      <input
                        value={form.documento}
                        onChange={(e) => updateForm("documento", e.target.value)}
                        style={styles.input}
                        placeholder="Digite CPF ou CNPJ"
                      />
                      <button type="button" onClick={buscarDocumento} style={styles.inlineButton}>
                        Buscar dados
                      </button>
                    </div>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Nome principal</label>
                    <input
                      value={form.nome}
                      onChange={(e) => updateForm("nome", e.target.value)}
                      style={styles.input}
                      placeholder="Nome completo ou nome da empresa"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Nome fantasia</label>
                    <input
                      value={form.nomeFantasia}
                      onChange={(e) => updateForm("nomeFantasia", e.target.value)}
                      style={styles.input}
                      placeholder="Opcional"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Razão social</label>
                    <input
                      value={form.razaoSocial}
                      onChange={(e) => updateForm("razaoSocial", e.target.value)}
                      style={styles.input}
                      placeholder="Opcional"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>E-mail</label>
                    <input
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      style={styles.input}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Telefone</label>
                    <input
                      value={form.telefone}
                      onChange={(e) => updateForm("telefone", e.target.value)}
                      style={styles.input}
                      placeholder="(31) 99999-9999"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Cidade</label>
                    <input
                      value={form.cidade}
                      onChange={(e) => updateForm("cidade", e.target.value)}
                      style={styles.input}
                      placeholder="Cidade"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Estado</label>
                    <input
                      value={form.estado}
                      onChange={(e) => updateForm("estado", e.target.value)}
                      style={styles.input}
                      placeholder="UF"
                    />
                  </div>

                  <div style={styles.fieldWide}>
                    <label style={styles.label}>Endereço</label>
                    <input
                      value={form.endereco}
                      onChange={(e) => updateForm("endereco", e.target.value)}
                      style={styles.input}
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div style={styles.fieldWide}>
                    <label style={styles.label}>Observação</label>
                    <textarea
                      value={form.observacao}
                      onChange={(e) => updateForm("observacao", e.target.value)}
                      style={styles.textarea}
                      placeholder="Observações operacionais e administrativas"
                    />
                  </div>

                  <div style={styles.fieldWide}>
                    <label style={styles.label}>Foto do motorista</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFotoChange}
                      style={styles.fileInput}
                    />
                  </div>

                  {form.fotoMotorista ? (
                    <div style={styles.fieldWide}>
                      <div style={styles.photoCard}>
                        <img
                          src={form.fotoMotorista}
                          alt="Prévia da foto do motorista"
                          style={styles.photoPreview}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div style={styles.actionRow}>
                  <button type="button" onClick={salvarCadastro} style={styles.primaryAction}>
                    Salvar cadastro
                  </button>
                </div>

                {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : null}
              </div>

              <div style={styles.listCard}>
                <div style={styles.sectionHeader}>
                  <div>
                    <span style={styles.sectionEyebrow}>BASE CADASTRAL</span>
                    <h2 style={styles.sectionTitle}>Cadastros registrados</h2>
                  </div>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                    placeholder="Buscar por nome, documento, cidade ou tipo"
                  />
                </div>

                <div style={styles.list}>
                  {filteredCadastros.length === 0 ? (
                    <div style={styles.emptyState}>Nenhum cadastro encontrado.</div>
                  ) : (
                    filteredCadastros.map((item) => (
                      <article key={item.id} style={styles.itemCard}>
                        <div style={styles.itemTop}>
                          <div>
                            <div style={styles.metaRow}>
                              <span style={styles.badgePrimary}>{item.tipoCadastro}</span>
                              <span style={styles.badgeSecondary}>{item.tipoDocumento}</span>
                            </div>

                            <h3 style={styles.itemTitle}>{item.nome}</h3>
                            <p style={styles.itemSubline}>
                              {item.documento} â€¢ {item.id}
                            </p>
                          </div>
                        </div>

                        <div style={styles.itemGrid}>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Nome fantasia</span>
                            <strong style={styles.dataValue}>
                              {item.nomeFantasia || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Razão social</span>
                            <strong style={styles.dataValue}>
                              {item.razaoSocial || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>E-mail</span>
                            <strong style={styles.dataValue}>
                              {item.email || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Telefone</span>
                            <strong style={styles.dataValue}>
                              {item.telefone || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Cidade</span>
                            <strong style={styles.dataValue}>
                              {item.cidade || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Estado</span>
                            <strong style={styles.dataValue}>
                              {item.estado || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItemWide}>
                            <span style={styles.dataLabel}>Endereço</span>
                            <strong style={styles.dataValue}>
                              {item.endereco || "Não informado"}
                            </strong>
                          </div>

                          <div style={styles.dataItemWide}>
                            <span style={styles.dataLabel}>Observação</span>
                            <strong style={styles.dataValue}>
                              {item.observacao || "Sem observação."}
                            </strong>
                          </div>

                          {item.fotoMotorista ? (
                            <div style={styles.dataItemWide}>
                              <span style={styles.dataLabel}>Foto do motorista</span>
                              <img
                                src={item.fotoMotorista}
                                alt="Foto do motorista"
                                style={styles.photoPreviewSaved}
                              />
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside style={styles.rightColumn}>
              <div style={styles.previewCard}>
                <span style={styles.sectionEyebrow}>REGRAS DO BLOCO</span>
                <h2 style={styles.sidebarTitle}>O que isso resolve</h2>

                <div style={styles.ruleList}>
                  <div style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>Busca por documento</strong>
                    <span style={styles.ruleItemText}>
                      Ajuda a preencher mais rápido e reduz erro manual.
                    </span>
                  </div>

                  <div style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>Tudo editável</strong>
                    <span style={styles.ruleItemText}>
                      Você corrige qualquer dado se a base consultada vier desatualizada.
                    </span>
                  </div>

                  <div style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>Motorista com foto</strong>
                    <span style={styles.ruleItemText}>
                      A foto já fica preparada como parte importante da confiança operacional.
                    </span>
                  </div>

                  <div style={styles.ruleItem}>
                    <strong style={styles.ruleItemTitle}>Acesso controlado</strong>
                    <span style={styles.ruleItemText}>
                      Só entra quem tiver liberação de cadastro na central de segurança.
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.darkCard}>
                <div style={styles.robotTag}>ROBÃ” AURORA</div>
                <h2 style={styles.sidebarTitleDark}>Apoio ao cadastro</h2>
                <p style={styles.sidebarTextDark}>
                  O RobÃ´ Aurora poderá sugerir conferência de documento, alertar
                  ausência de foto de motorista, apontar cadastro incompleto e ajudar
                  na padronização operacional.
                </p>

                <div style={styles.robotList}>
                  <div style={styles.robotItem}>Conferir documento</div>
                  <div style={styles.robotItem}>Ler foto pendente</div>
                  <div style={styles.robotItem}>Apontar cadastro fraco</div>
                  <div style={styles.robotItem}>Padronizar base</div>
                </div>
              </div>

              <div style={styles.navCard}>
                <span style={styles.sectionEyebrow}>NAVEGAÇÃƒO</span>
                <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

                <div style={styles.navList}>
                  <Link href="/seguranca" style={styles.navItem}>
                    Abrir segurança
                  </Link>
                  <Link href="/financeiro" style={styles.navItem}>
                    Abrir financeiro
                  </Link>
                  <Link href="/diarias" style={styles.navItem}>
                    Abrir diárias
                  </Link>
                  <Link href="/relatorios" style={styles.navItem}>
                    Abrir relatórios
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f6fbff 0%, #edf8ff 34%, #ffffff 72%, #f8fcff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "32px 20px 18px",
  },

  glowOne: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "rgba(0, 194, 255, 0.18)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1240,
    margin: "0 auto",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    borderRadius: 30,
    padding: "28px 22px 24px",
    boxShadow: "0 24px 60px rgba(14, 165, 233, 0.10)",
    backdropFilter: "blur(12px)",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)",
    gap: 18,
    alignItems: "start",
  },

  heroLeft: {
    minWidth: 0,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
    padding: "0 16px",
    borderRadius: 999,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0c4a6e",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.9rem, 3.7vw, 3.5rem)",
    lineHeight: 1.03,
    fontWeight: 950,
    letterSpacing: "-0.05em",
    maxWidth: 860,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 860,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 26,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.20)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#0f172a",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(125, 211, 252, 0.34)",
  },

  heroRightCard: {
    borderRadius: 26,
    padding: 22,
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    border: "1px solid rgba(125, 211, 252, 0.30)",
    boxShadow: "0 18px 44px rgba(8, 47, 73, 0.08)",
  },

  sideKicker: {
    display: "inline-block",
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 10,
  },

  sideTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  sideText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },

  sidePills: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  sidePill: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.84)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.55,
  },

  noticeBox: {
    marginTop: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(6, 182, 212, 0.08)",
    border: "1px solid rgba(6, 182, 212, 0.16)",
    color: "#164e63",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 0",
  },

  accessCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  accessGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 14,
  },

  accessSuccessBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  accessErrorBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    color: "#991b1b",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  blockedCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #fff7f7 100%)",
    borderRadius: 24,
    border: "1px solid rgba(239, 68, 68, 0.18)",
    padding: 24,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  blockedText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.8,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
    gap: 18,
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  formCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  listCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  sectionEyebrow: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  fieldWide: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    gridColumn: "1 / -1",
  },

  inlineRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 180px",
    gap: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: 900,
    color: "#0f172a",
  },

  input: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    width: "100%",
  },

  select: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  textarea: {
    minHeight: 120,
    borderRadius: 16,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 14,
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  fileInput: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 10,
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
  },

  inlineButton: {
    border: "none",
    minHeight: 48,
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  },

  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  primaryAction: {
    border: "none",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.18)",
  },

  feedbackBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  itemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  metaRow: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },

  badgePrimary: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0e7490",
    border: "1px solid rgba(6, 182, 212, 0.18)",
  },

  badgeSecondary: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  },

  itemTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  itemSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 600,
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
  },

  dataItemWide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    gridColumn: "1 / -1",
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  dataValue: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 800,
  },

  searchInput: {
    minHeight: 46,
    minWidth: 280,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  emptyState: {
    padding: 18,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px dashed rgba(125, 211, 252, 0.34)",
    color: "#475569",
    fontSize: 15,
    fontWeight: 700,
  },

  previewCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  ruleItem: {
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  ruleItemTitle: {
    display: "block",
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleItemText: {
    display: "block",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.65,
    color: "#475569",
  },

  darkCard: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  robotTag: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sidebarTitleDark: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#ffffff",
  },

  sidebarTextDark: {
    marginTop: 12,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 15,
  },

  robotList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  robotItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },

  navCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  navItem: {
    display: "block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 800,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  photoCard: {
    padding: 14,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    display: "flex",
    justifyContent: "center",
  },

  photoPreview: {
    width: 180,
    height: 180,
    objectFit: "cover",
    borderRadius: 18,
    border: "1px solid rgba(125, 211, 252, 0.22)",
  },

  photoPreviewSaved: {
    width: 160,
    height: 160,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid rgba(125, 211, 252, 0.22)",
  },
};

