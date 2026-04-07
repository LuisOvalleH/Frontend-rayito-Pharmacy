import { useEffect, useMemo, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getAllProducts,
  uploadProductImage,
  updateProduct,
  validateImageFile,
  IMAGE_RULES,
} from "../../api/products";

const EMPTY_FORM = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
  estado: "disponible",
  formula: "",
  registro: "",
  presentacion: "",
  destacado: false,
};

export default function AdminProductos() {
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categoryMap = useMemo(
    () => new Map(categories.map((item) => [String(item.id), item.nombre])),
    [categories]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productData, categoryData] = await Promise.all([
        getAllProducts(),
        getCategories(),
      ]);
      setProducts(Array.isArray(productData) ? productData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = ({ clearFeedback = true } = {}) => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPreview("");
    setError("");
    if (clearFeedback) setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildPayload = () => {
    const currentFile = fileInputRef.current?.files?.[0] || null;
    const hasSelectedFile = !!(currentFile && currentFile.size > 0);
    const current = editingId ? products.find((item) => item.id === editingId) : null;

    return {
      currentFile,
      hasSelectedFile,
      payload: {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: form.precio || "0",
        estado: form.estado,
        categoria: form.categoria || null,
        imagen: current?.imagen || "",
        formula: form.formula.trim(),
        registro: form.registro.trim(),
        presentacion: form.presentacion.trim(),
        destacado: form.destacado,
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { payload, hasSelectedFile, currentFile } = buildPayload();
    const precioNum = parseFloat(payload.precio);

    if (!editingId && !hasSelectedFile) {
      setError("Debes seleccionar una imagen antes de crear el producto.");
      setSuccess("");
      return;
    }

    if (isNaN(precioNum) || precioNum <= 0) {
      setError("El precio debe ser mayor a Q0.00.");
      setSuccess("");
      return;
    }
    if (precioNum > 999999) {
      setError("El precio no puede superar Q999,999.00.");
      setSuccess("");
      return;
    }

    // Validar imagen en el frontend antes de subir
    if (hasSelectedFile) {
      const imageError = await validateImageFile(currentFile);
      if (imageError) {
        setError(imageError);
        setSuccess("");
        return;
      }
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = payload.imagen;

      if (hasSelectedFile) {
        imageUrl = await uploadProductImage(currentFile);
      }

      const productPayload = { ...payload, imagen: imageUrl };

      if (editingId) await updateProduct(editingId, productPayload);
      else await createProduct(productPayload);

      resetForm({ clearFeedback: false });
      await loadData();
      setSuccess(editingId ? "Producto actualizado." : "Producto creado.");
    } catch (err) {
      const detail =
        err?.response?.data?.imagen_file?.[0] ||
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "No se pudo guardar el producto.";
      setError(detail);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || "",
      categoria: product.categoria ? String(product.categoria) : "",
      estado: product.estado || "disponible",
      formula: product.formula || "",
      registro: product.registro || "",
      presentacion: product.presentacion || "",
      destacado: product.destacado ?? false,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(product.imagen || "");
    setError("");
    setSuccess("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Se eliminará este producto. ¿Deseas continuar?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteProduct(id);
      if (editingId === id) resetForm();
      await loadData();
      setSuccess("Producto eliminado.");
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) { setPreview(""); return; }
    setPreview(URL.createObjectURL(file));
    // Validación inmediata al seleccionar
    validateImageFile(file).then((err) => {
      if (err) setError(err);
      else setError("");
    });
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={sectionStyle} ref={formRef}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#0b2b4b" }}>Productos</h1>
            <p style={{ color: "#5c6b7b", margin: "8px 0 0" }}>
              Crea, edita y elimina productos. Las imágenes deben ser {IMAGE_RULES.allowedTypesLabel},
              mínimo {IMAGE_RULES.minDimension}×{IMAGE_RULES.minDimension} px.
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} style={cancelBtnStyle}>
              Cancelar edición
            </button>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 14, marginTop: 18 }}
        >
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
              placeholder="Nombre del producto"
              required
              style={inputStyle}
            />
            <input
              value={form.precio}
              onChange={(e) => setForm((p) => ({ ...p, precio: e.target.value }))}
              placeholder="Precio (Q)"
              type="number"
              min="0"
              step="0.01"
              required
              style={inputStyle}
            />
            <input
              value={form.formula}
              onChange={(e) => setForm((p) => ({ ...p, formula: e.target.value }))}
              placeholder="Fórmula"
              style={inputStyle}
            />
            <input
              value={form.registro}
              onChange={(e) => setForm((p) => ({ ...p, registro: e.target.value }))}
              placeholder="Registro sanitario"
              style={inputStyle}
            />
            <input
              value={form.presentacion}
              onChange={(e) => setForm((p) => ({ ...p, presentacion: e.target.value }))}
              placeholder="Presentación"
              style={inputStyle}
            />
            <select
              value={form.categoria}
              onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
              style={inputStyle}
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <select
              value={form.estado}
              onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}
              style={inputStyle}
            >
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
              <option value="descontinuado">Descontinuado</option>
            </select>
          </div>

          <textarea
            value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
            placeholder="Descripción"
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          {/* ── Toggle Destacado ──────────────────────────────────── */}
          <label style={toggleLabelStyle}>
            <div
              style={{
                ...toggleTrackStyle,
                background: form.destacado ? "#0b2b4b" : "#e5edf7",
              }}
              onClick={() => setForm((p) => ({ ...p, destacado: !p.destacado }))}
            >
              <div
                style={{
                  ...toggleThumbStyle,
                  transform: form.destacado ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </div>
            <span style={{ fontWeight: 700, color: "#0b2b4b" }}>
              {form.destacado ? "⭐ Producto destacado" : "Marcar como destacado"}
            </span>
            <span style={{ color: "#5c6b7b", fontSize: 13 }}>
              Aparece en el Home y primero en el catálogo
            </span>
          </label>

          {/* ── Imagen ────────────────────────────────────────────── */}
          <div style={imageBoxStyle}>
            <label style={{ color: "#20344f", fontWeight: 700 }}>
              Imagen del producto
            </label>
            <p style={{ color: "#5c6b7b", fontSize: 13, margin: "4px 0 8px" }}>
              {IMAGE_RULES.allowedTypesLabel} · mínimo{" "}
              {IMAGE_RULES.minDimension}×{IMAGE_RULES.minDimension} px
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_RULES.allowedTypes.map((t) => `.${t.split("/")[1]}`).join(",")}
              onClick={(e) => { e.target.value = ""; }}
              onChange={onFileChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 14, border: "1px solid #e5edf7", marginTop: 10 }}
              />
            )}
          </div>

          {error && <div style={{ color: "#b42318", fontWeight: 700 }}>{error}</div>}
          {success && <div style={{ color: "#166534", fontWeight: 700 }}>{success}</div>}

          <button
            type="submit"
            disabled={saving}
            style={submitBtnStyle}
          >
            {saving ? "Guardando..." : editingId ? "Actualizar producto" : "Crear producto"}
          </button>
        </form>
      </section>

      {/* Listado */}
      <section style={{ ...sectionStyle, boxShadow: "none" }}>
        <h2 style={{ margin: 0, color: "#0b2b4b" }}>Listado actual</h2>
        <p style={{ color: "#5c6b7b", marginTop: 8 }}>
          {loading ? "Cargando..." : `${products.length} producto(s) registrados`}
        </p>

        {loading ? (
          <div style={emptyBoxStyle}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div style={emptyBoxStyle}>No hay productos creados todavía.</div>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
            {products.map((product) => (
              <article key={product.id} style={rowStyle}>
                <img
                  src={product.imagen || "https://placehold.co/92x92?text=Img"}
                  alt={product.nombre}
                  style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 12 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "#0b2b4b", display: "flex", alignItems: "center", gap: 6 }}>
                    {product.destacado && (
                      <span style={destacadoBadgeStyle}>⭐ Destacado</span>
                    )}
                    {product.nombre}
                  </div>
                  <div style={{ color: "#5c6b7b", marginTop: 4 }}>
                    {categoryMap.get(String(product.categoria)) ||
                      product.categoria_nombre ||
                      "Sin categoría"}
                  </div>
                  <div style={{ color: "#20344f", marginTop: 4 }}>
                    Q{(Number(product.precio) || 0).toFixed(2)} · {product.estado}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <button type="button" onClick={() => handleEdit(product)} style={secondaryBtnStyle}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
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

// ── Estilos ────────────────────────────────────────────────────────────────────

const sectionStyle = {
  background: "#fff",
  border: "1px solid #e5edf7",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 8px 18px rgba(2,32,71,0.06)",
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
  padding: 14,
  display: "grid",
  gap: 12,
  gridTemplateColumns: "92px 1fr auto",
  alignItems: "center",
};

const imageBoxStyle = {
  border: "1px dashed #c9d8ee",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 8,
};

const toggleLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5edf7",
  background: "#f9fbfe",
};

const toggleTrackStyle = {
  width: 46,
  height: 26,
  borderRadius: 999,
  cursor: "pointer",
  transition: "background .2s",
  flexShrink: 0,
  position: "relative",
};

const toggleThumbStyle = {
  position: "absolute",
  top: 3,
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,.2)",
  transition: "transform .2s",
};

const destacadoBadgeStyle = {
  fontSize: 11,
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: 999,
  background: "#FEF9C3",
  color: "#854D0E",
};
