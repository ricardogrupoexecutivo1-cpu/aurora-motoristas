"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type UserRole =
  | "admin_master"
  | "admin"
  | "operacional"
  | "financeiro"
  | "motorista"
  | "visualizacao";

type CreatedUser = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  empresa: string;
  status: "ativo" | "inativo";
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function roleLabel(role: UserRole) {
  switch (role) {
    case "admin_master":
      return "Admin Master";
    case "admin":
      return "Admin";
    case "operacional":
      return "Operacional";
    case "financeiro":
      return "Financeiro";
    case "motorista":
      return "Motorista";
    case "visualizacao":
      return "Visualização";
    default:
      return role;
  }
}

export default function AdminUsuariosPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaInicial, setSenhaInicial] = useState("");
  const [role, setRole] = useState<UserRole>("operacional");
  const [empresa, setEmpresa] = useState("");
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo");

  const [usuariosCriados, setUsuariosCriados] = useState<CreatedUser[]>([]);
  const [busca, setBusca] = useState("");
  const [statusText, setStatusText] = useState(
    "Painel pronto para criar acessos reais no Auth."
  );
  const [saving, setSaving] = useState(false);

  const usuariosFiltrados = useMemo(() => {
    const termo = normalize(busca);

    if (!termo) return usuariosCriados;

    return usuariosCriados.filter((user) => {
      const haystack = normalize(
        [user.nome, user.email, user.empresa, user.role, user.status].join(" ")
      );

      return haystack.includes(termo);
    });
  }, [usuariosCriados, busca]);

  function limparFormulario() {
    setNome("");
    setEmail("");
    setSenhaInicial("");
    setRole("operacional");
    setEmpresa("");
    setStatus("ativo");
    setStatusText("Formulário limpo para novo acesso.");
  }

  async function salvarUsuario() {
    const nomeFinal = nome.trim();
    const emailFinal = email.trim().toLowerCase();
    const senhaFinal = senhaInicial.trim();
    const empresaFinal = empresa.trim();

    if (!nomeFinal) {
      alert("Informe o nome do usuário.");
      setStatusText("Informe o nome do usuário.");
      return;
    }

    if (!emailFinal) {
      alert("Informe o e-mail do usuário.");
      setStatusText("Informe o e-mail do usuário.");
      return;
    }

    if (!senhaFinal) {
      alert("Informe a senha inicial.");
      setStatusText("Informe a senha inicial.");
      return;
    }

    if (!empresaFinal) {
      alert("Informe a empresa do usuário.");
      setStatusText("Informe a empresa do usuário.");
      return;
    }

    try {
      setSaving(true);
      setStatusText("Criando usuário real no Auth...");

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeFinal,
          email: emailFinal,
          senha_inicial: senhaFinal,
          role,
          empresa: empresaFinal,
          status,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Falha ao criar usuário.");
      }

      const novoUsuario: CreatedUser = {
        id: data?.user?.id || `${Date.now()}`,
        nome: nomeFinal,
        email: emailFinal,
        role,
        empresa: empresaFinal,
        status,
      };

      setUsuariosCriados((prev) => [novoUsuario, ...prev]);

      if (data?.profile_created) {
        setStatusText("Usuário criado no Auth e profile atualizado com sucesso.");
        alert(
          `Usuário criado com sucesso.\n\nNome: ${nomeFinal}\nE-mail: ${emailFinal}\nPerfil: ${roleLabel(
            role
          )}\nEmpresa: ${empresaFinal}`
        );
      } else {
        setStatusText(
          "Usuário criado no Auth. O profile pode precisar de ajuste fino."
        );
        alert(
          `Usuário criado no Auth.\n\nNome: ${nomeFinal}\nE-mail: ${emailFinal}\n\nAviso profile: ${
            data?.profile_warning || "Profile não confirmou criação automática."
          }`
        );
      }

      limparFormulario();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar usuário.";

      setStatusText(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 48px",
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
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/" style={topSecondary}>
              Início
            </Link>

            <Link href="/servicos" style={topSecondary}>
              Operação
            </Link>

            <Link href="/motoristas" style={topSecondary}>
              Motoristas
            </Link>
          </div>

          <div style={topChip}>{saving ? "Salvando..." : statusText}</div>
        </div>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={blueChip}>Painel ADM de Usuários</span>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.05,
                color: "#0f172a",
              }}
            >
              Cadastro controlado de acessos para o app
            </h1>

            <p
              style={{
                margin: 0,
                color: "#496276",
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 760,
              }}
            >
              Esta área permite ao administrador criar o acesso do funcionário
              com login e senha prontos, evitando travas no cadastro público e
              melhorando o controle operacional do sistema.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={miniChip}>Admin controla o acesso</span>
              <span style={miniChip}>Usuário criado no Auth</span>
              <span style={miniChip}>Perfil pronto para operação</span>
            </div>
          </div>

          <div
            style={{
              background: "#f8fbff",
              border: "1px solid #dbeafe",
              borderRadius: 22,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Caminho empresarial correto
            </div>

            <div
              style={{
                color: "#4b6478",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Em vez de cada funcionário tentar se cadastrar sozinho, o admin
              cria o acesso real e já entrega login e senha iniciais.
            </div>

            <div
              style={{
                borderRadius: 16,
                background: "#ffffff",
                border: "1px solid #e5edf5",
                padding: 14,
                color: "#4b6478",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Se o Auth criar e o profile não encaixar 100% no schema atual, o
              sistema avisa sem perder o usuário criado.
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 20,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.1,
                color: "#0f172a",
              }}
            >
              Criar novo acesso real
            </h2>

            <Field
              label="Nome do usuário"
              value={nome}
              onChange={setNome}
              placeholder="Ex.: Paulo Santos"
            />

            <Field
              label="E-mail de acesso"
              value={email}
              onChange={setEmail}
              placeholder="Ex.: paulo@empresa.com"
            />

            <Field
              label="Senha inicial"
              value={senhaInicial}
              onChange={setSenhaInicial}
              placeholder="Ex.: Paulo@123"
              type="text"
            />

            <SelectField
              label="Perfil"
              value={role}
              onChange={(value) => setRole(value as UserRole)}
              options={[
                { value: "admin_master", label: "Admin Master" },
                { value: "admin", label: "Admin" },
                { value: "operacional", label: "Operacional" },
                { value: "financeiro", label: "Financeiro" },
                { value: "motorista", label: "Motorista" },
                { value: "visualizacao", label: "Visualização" },
              ]}
            />

            <Field
              label="Empresa"
              value={empresa}
              onChange={setEmpresa}
              placeholder="Ex.: Aurora Motoristas"
            />

            <SelectField
              label="Status inicial"
              value={status}
              onChange={(value) => setStatus(value as "ativo" | "inativo")}
              options={[
                { value: "ativo", label: "Ativo" },
                { value: "inativo", label: "Inativo" },
              ]}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={limparFormulario}
                style={secondaryButton}
                disabled={saving}
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={salvarUsuario}
                style={primaryButton}
                disabled={saving}
              >
                {saving ? "Criando..." : "Criar acesso real"}
              </button>
            </div>

            <div
              style={{
                borderRadius: 16,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                padding: 14,
                color: "#7c2d12",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Esta etapa já tenta criar no Supabase Auth e no profile real do
              sistema.
            </div>
          </section>

          <section
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 20,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
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
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  lineHeight: 1.1,
                  color: "#0f172a",
                }}
              >
                Acessos criados nesta sessão
              </h2>

              <div style={counterBadge}>{usuariosCriados.length} total</div>
            </div>

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail, empresa ou perfil..."
              style={searchInput}
            />

            {usuariosFiltrados.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  border: "1px dashed #cbd5e1",
                  padding: 24,
                  textAlign: "center",
                  color: "#64748b",
                  background: "#f8fafc",
                }}
              >
                Nenhum acesso criado nesta sessão ainda.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {usuariosFiltrados.map((user) => (
                  <article
                    key={user.id}
                    style={{
                      background: "#fcfdff",
                      border: "1px solid #e7eef6",
                      borderRadius: 20,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <strong
                          style={{
                            fontSize: 18,
                            lineHeight: 1.2,
                            color: "#0f172a",
                          }}
                        >
                          {user.nome}
                        </strong>

                        <span
                          style={{
                            color: "#5b7488",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {user.email}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <span style={smallTag}>{roleLabel(user.role)}</span>
                        <span
                          style={{
                            ...smallTag,
                            background:
                              user.status === "ativo" ? "#dcfce7" : "#fee2e2",
                            color:
                              user.status === "ativo" ? "#166534" : "#991b1b",
                          }}
                        >
                          {user.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 10,
                      }}
                    >
                      <Info label="Empresa" value={user.empresa} />
                      <Info label="Perfil" value={roleLabel(user.role)} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Sistema em constante atualização • cadastro ADM controlado para acesso
          empresarial mais seguro.
        </footer>
      </div>
    </main>
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
        style={inputStyle}
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

      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e7eef6",
        borderRadius: 14,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6b7f90",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#123047",
          fontWeight: 800,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const topSecondary: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const topChip: React.CSSProperties = {
  background: "#ffffff",
  color: "#5b7488",
  border: "1px solid #e7eef6",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const blueChip: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#e0f2fe",
  color: "#075985",
  borderRadius: 999,
  padding: "7px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const miniChip: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const smallTag: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#f1f5f9",
  color: "#334155",
  borderRadius: 999,
  padding: "6px 10px",
  fontWeight: 800,
  fontSize: 12,
};

const inputStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #d8e3ee",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  background: "#f8fbff",
  color: "#123047",
};

const searchInput: React.CSSProperties = {
  ...inputStyle,
  width: "100%",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
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

const counterBadge: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 800,
  fontSize: 13,
};