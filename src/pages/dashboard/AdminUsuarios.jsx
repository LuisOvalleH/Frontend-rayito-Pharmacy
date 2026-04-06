// AdminUsuarios.jsx
import { useRef, useState } from "react";

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
];

const MOCK_USERS = [
  {
    id: 1,
    nombre: "Carlos Méndez",
    email: "carlos@farquetsa.com",
    rol: "admin",
    activo: true,
  },
  {
    id: 2,
    nombre: "Lucía Hernández",
    email: "lucia@farquetsa.com",
    rol: "editor",
    activo: true,
  },
  {
    id: 3,
    nombre: "Roberto Ajú",
    email: "roberto@farquetsa.com",
    rol: "editor",
    activo: false,
  },
];

const EMPTY_FORM = {
  nombre: "",
  email: "",
  password: "",
  rol: "editor",
  activo: true,
};

export default function AdminUsuarios() {
  const nextId = useRef(MOCK_USERS.length + 1);
  const [users, setUsers] = useState(MOCK_USERS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────
  const resetForm = ({ clearFeedback = true } = {}) => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowPassword(false);
    if (clearFeedback) setSuccess("");
  };

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (form.nombre.trim().length < 2)
      return "El nombre debe tener al menos 2 caracteres.";
    if (!form.email.trim()) return "El correo electrónico es obligatorio.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim()))
      return "El correo electrónico no es válido.";
    const duplicate = users.find(
      (u) =>
        u.email.toLowerCase() === form.email.trim().toLowerCase() &&
        u.id !== editingId,
    );
    if (duplicate) return "Ya existe un usuario con ese correo.";
    if (!editingId && !form.password)
      return "La contraseña es obligatoria para nuevos usuarios.";
    if (form.password && form.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    await new Promise((r) => setTimeout(r, 300)); // simula latencia

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? {
                ...u,
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                rol: form.rol,
                activo: form.activo,
              }
            : u,
        ),
      );
      setSuccess("Usuario actualizado.");
    } else {
      const newUser = {
        id: nextId.current++,
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
        activo: form.activo,
      };
      setUsers((prev) => [...prev, newUser]);
      setSuccess("Usuario creado.");
    }

    setSaving(false);
    resetForm({ clearFeedback: false });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      nombre: user.nombre || "",
      email: user.email || "",
      password: "",
      rol: user.rol || "editor",
      activo: user.activo ?? true,
    });
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const handleDelete = (id) => {
    const ok = window.confirm("Se eliminará este usuario. ¿Deseas continuar?");
    if (!ok) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) resetForm();
    setSuccess("Usuario eliminado.");
    setError("");
  };

  // ── Iniciales para avatar ─────────────────────────────────────────
  const getInitials = (nombre = "") => {
    const parts = nombre.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nombre.charAt(0).toUpperCase();
  };

  const getRolLabel = (rol) => ROLES.find((r) => r.value === rol)?.label || rol;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* ── Formulario ─────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#0b2b4b" }}>Usuarios</h1>
            <p style={{ color: "#5c6b7b", margin: "8px 0 0" }}>
              Crea, edita y elimina los usuarios con acceso al panel.
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} style={cancelBtnStyle}>
              Cancelar edición
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 14, marginTop: 18 }}
        >
          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <input
              value={form.nombre}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nombre: e.target.value }))
              }
              placeholder="Nombre completo *"
              required
              style={inputStyle}
            />
            <input
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Correo electrónico *"
              type="email"
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder={
                  editingId ? "Nueva contraseña (opcional)" : "Contraseña *"
                }
                type={showPassword ? "text" : "password"}
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                  paddingRight: 44,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={eyeBtnStyle}
                title={showPassword ? "Ocultar" : "Mostrar"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <select
              value={form.rol}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rol: e.target.value }))
              }
              style={inputStyle}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <label style={toggleRowStyle}>
            <div
              onClick={() =>
                setForm((prev) => ({ ...prev, activo: !prev.activo }))
              }
              style={{
                ...toggleTrackStyle,
                background: form.activo ? "#0b2b4b" : "#c9d8ee",
              }}
            >
              <div
                style={{
                  ...toggleThumbStyle,
                  transform: form.activo
                    ? "translateX(20px)"
                    : "translateX(2px)",
                }}
              />
            </div>
            <span style={{ color: "#20344f", fontWeight: 700, fontSize: 14 }}>
              Usuario {form.activo ? "activo" : "inactivo"}
            </span>
          </label>

          {error && (
            <div style={{ color: "#b42318", fontWeight: 700 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "#166534", fontWeight: 700 }}>{success}</div>
          )}

          <button type="submit" disabled={saving} style={submitBtnStyle}>
            {saving
              ? "Guardando..."
              : editingId
                ? "Actualizar usuario"
                : "Crear usuario"}
          </button>
        </form>
      </section>

      {/* ── Listado ────────────────────────────────────────────────── */}
      <section style={{ ...sectionStyle, boxShadow: "none" }}>
        <h2 style={{ margin: 0, color: "#0b2b4b" }}>Listado actual</h2>
        <p style={{ color: "#5c6b7b", marginTop: 8 }}>
          {`${users.length} usuario(s) registrado(s)`}
        </p>

        {users.length === 0 ? (
          <div style={emptyBoxStyle}>No hay usuarios creados todavía.</div>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {users.map((user) => (
              <article key={user.id} style={rowStyle}>
                <div style={avatarStyle}>{getInitials(user.nombre)}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "#0b2b4b" }}>
                    {user.nombre}
                  </div>
                  <div style={{ color: "#5c6b7b", fontSize: 14, marginTop: 2 }}>
                    {user.email}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={rolBadgeStyle}>{getRolLabel(user.rol)}</span>
                    <span
                      style={{
                        ...statusBadgeStyle,
                        background: user.activo ? "#dcfce7" : "#fee2e2",
                        color: user.activo ? "#166534" : "#b42318",
                      }}
                    >
                      {user.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    style={secondaryBtnStyle}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    style={{ ...secondaryBtnStyle, color: "#b42318" }}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────
const sectionStyle = {
  background: "#fff",
  border: "1px solid #e5edf7",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 8px 18px rgba(2, 32, 71, 0.06)",
};

const inputStyle = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #e5edf7",
  font: "inherit",
};

const submitBtnStyle = {
  height: 44,
  borderRadius: 12,
  border: "1px solid #dbe7f7",
  background: "#0b2b4b",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const cancelBtnStyle = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #dbe7f7",
  background: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  color: "#0b2b4b",
};

const secondaryBtnStyle = {
  height: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #dbe7f7",
  background: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  color: "#0b2b4b",
};

const emptyBoxStyle = {
  marginTop: 14,
  borderRadius: 14,
  border: "1px dashed #c9d8ee",
  padding: 16,
  color: "#5c6b7b",
};

const rowStyle = {
  border: "1px solid #e5edf7",
  borderRadius: 16,
  padding: "12px 14px",
  display: "flex",
  gap: 14,
  alignItems: "center",
  flexWrap: "wrap",
};

const avatarStyle = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "#eef4fc",
  color: "#0b2b4b",
  fontWeight: 900,
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  letterSpacing: 1,
};

const rolBadgeStyle = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 8,
  background: "#eef4fc",
  color: "#0b2b4b",
  fontWeight: 700,
  fontSize: 12,
  border: "1px solid #dbe7f7",
};

const statusBadgeStyle = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 12,
};

const eyeBtnStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  padding: 2,
};

const toggleRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
  userSelect: "none",
  width: "fit-content",
};

const toggleTrackStyle = {
  width: 44,
  height: 24,
  borderRadius: 12,
  cursor: "pointer",
  position: "relative",
  transition: "background 0.2s",
  flexShrink: 0,
};

const toggleThumbStyle = {
  position: "absolute",
  top: 2,
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#fff",
  transition: "transform 0.2s",
  boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
};
