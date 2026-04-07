import { useEffect, useState } from "react";
import { getSiteConfig, updateSiteConfig } from "../../api/products";

export default function AdminSiteConfig() {
  const [config, setConfig] = useState(null);
  const [form, setForm] = useState({
    productos_por_pagina: 12,
    max_imagenes_home: 6,
    max_destacados_home: 8,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getSiteConfig();
        setConfig(data);
        setForm({
          productos_por_pagina: data.productos_por_pagina ?? 12,
          max_imagenes_home: data.max_imagenes_home ?? 6,
          max_destacados_home: data.max_destacados_home ?? 8,
        });
      } catch {
        setError("No se pudo cargar la configuración.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const pp = Number(form.productos_por_pagina);
    const mi = Number(form.max_imagenes_home);
    const md = Number(form.max_destacados_home);

    if (pp < 4 || pp > 48) { setError("Productos por página debe estar entre 4 y 48."); return; }
    if (mi < 1 || mi > 20) { setError("Máx. imágenes en Home debe estar entre 1 y 20."); return; }
    if (md < 1 || md > 20) { setError("Máx. destacados en Home debe estar entre 1 y 20."); return; }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateSiteConfig({
        productos_por_pagina: pp,
        max_imagenes_home: mi,
        max_destacados_home: md,
      });
      setConfig(updated);
      setSuccess("Configuración guardada correctamente.");
    } catch (err) {
      const msg =
        err?.response?.data?.productos_por_pagina?.[0] ||
        err?.response?.data?.detail ||
        "No se pudo guardar la configuración.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={emptyBoxStyle}>Cargando configuración...</div>;
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={sectionStyle}>
        <div>
          <h1 style={{ margin: 0, color: "#0b2b4b" }}>Configuración del sitio</h1>
          <p style={{ color: "#5c6b7b", margin: "8px 0 0" }}>
            Controla la cantidad de productos y contenido visible en el sitio público.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: "grid", gap: 20, marginTop: 24 }}>

          {/* Catálogo */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <div style={cardTitleStyle}>Catálogo público</div>
                <div style={cardDescStyle}>Controla la paginación en la página de productos</div>
              </div>
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>
                Productos por página
                <span style={hintStyle}>Entre 4 y 48 productos</span>
              </label>
              <div style={inputGroupStyle}>
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, productos_por_pagina: Math.max(4, p.productos_por_pagina - 4) }))}
                >−</button>
                <input
                  type="number"
                  min={4}
                  max={48}
                  step={4}
                  value={form.productos_por_pagina}
                  onChange={(e) => setForm((p) => ({ ...p, productos_por_pagina: Number(e.target.value) }))}
                  style={numInputStyle}
                />
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, productos_por_pagina: Math.min(48, p.productos_por_pagina + 4) }))}
                >+</button>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <p style={{ ...hintStyle, marginBottom: 8 }}>Presets rápidos:</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[8, 12, 16, 24, 36, 48].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, productos_por_pagina: n }))}
                    style={{
                      ...presetBtnStyle,
                      background: form.productos_por_pagina === n ? "#0b2b4b" : "#fff",
                      color: form.productos_por_pagina === n ? "#fff" : "#0b2b4b",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Home - Imágenes informativas */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <div style={cardTitleStyle}>Imágenes informativas en Home</div>
                <div style={cardDescStyle}>Cuántas imágenes de información se muestran en el inicio</div>
              </div>
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>
                Máximo de imágenes
                <span style={hintStyle}>Entre 1 y 20 imágenes</span>
              </label>
              <div style={inputGroupStyle}>
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, max_imagenes_home: Math.max(1, p.max_imagenes_home - 1) }))}
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.max_imagenes_home}
                  onChange={(e) => setForm((p) => ({ ...p, max_imagenes_home: Number(e.target.value) }))}
                  style={numInputStyle}
                />
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, max_imagenes_home: Math.min(20, p.max_imagenes_home + 1) }))}
                >+</button>
              </div>
            </div>
          </div>

          {/* Home - Productos destacados */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <div style={cardTitleStyle}>Productos destacados en Home</div>
                <div style={cardDescStyle}>Cuántos productos destacados aparecen en la sección del inicio</div>
              </div>
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>
                Máximo de productos destacados
                <span style={hintStyle}>Entre 1 y 20 productos</span>
              </label>
              <div style={inputGroupStyle}>
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, max_destacados_home: Math.max(1, p.max_destacados_home - 1) }))}
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.max_destacados_home}
                  onChange={(e) => setForm((p) => ({ ...p, max_destacados_home: Number(e.target.value) }))}
                  style={numInputStyle}
                />
                <button
                  type="button"
                  style={stepBtnStyle}
                  onClick={() => setForm((p) => ({ ...p, max_destacados_home: Math.min(20, p.max_destacados_home + 1) }))}
                >+</button>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <p style={{ ...hintStyle, marginBottom: 8 }}>Presets rápidos:</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[4, 6, 8, 12, 16].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, max_destacados_home: n }))}
                    style={{
                      ...presetBtnStyle,
                      background: form.max_destacados_home === n ? "#0b2b4b" : "#fff",
                      color: form.max_destacados_home === n ? "#fff" : "#0b2b4b",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div style={{ color: "#b42318", fontWeight: 700 }}>{error}</div>}
          {success && <div style={{ color: "#166534", fontWeight: 700 }}>{success}</div>}

          <button type="submit" disabled={saving} style={submitBtnStyle}>
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </form>
      </section>
    </div>
  );
}

// ── Estilos ─────────────────────────────────────────────────────────────────────

const sectionStyle = {
  background: "#fff",
  border: "1px solid #e5edf7",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 8px 18px rgba(2,32,71,0.06)",
};

const cardStyle = {
  border: "1px solid #e5edf7",
  borderRadius: 14,
  padding: 18,
  display: "grid",
  gap: 14,
};

const cardHeaderStyle = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};

const iconStyle = {
  fontSize: 28,
  flexShrink: 0,
};

const cardTitleStyle = {
  fontWeight: 800,
  color: "#0b2b4b",
  fontSize: 16,
};

const cardDescStyle = {
  color: "#5c6b7b",
  fontSize: 13,
  marginTop: 2,
};

const fieldRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontWeight: 700,
  color: "#0b2b4b",
  gap: 2,
};

const hintStyle = {
  fontWeight: 400,
  color: "#5c6b7b",
  fontSize: 13,
};

const inputGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const numInputStyle = {
  width: 64,
  height: 40,
  borderRadius: 10,
  border: "1px solid #e5edf7",
  textAlign: "center",
  font: "inherit",
  fontWeight: 700,
  fontSize: 16,
  color: "#0b2b4b",
};

const stepBtnStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "1px solid #e5edf7",
  background: "#f9fbfe",
  fontWeight: 800,
  fontSize: 18,
  cursor: "pointer",
  color: "#0b2b4b",
};

const presetBtnStyle = {
  height: 32,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid #dbe7f7",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const submitBtnStyle = {
  height: 46,
  borderRadius: 12,
  border: "none",
  background: "#0b2b4b",
  color: "#fff",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
};

const emptyBoxStyle = {
  padding: 24,
  borderRadius: 14,
  border: "1px dashed #c9d8ee",
  color: "#5c6b7b",
};
