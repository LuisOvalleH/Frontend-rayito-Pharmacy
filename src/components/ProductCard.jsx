import "./productCard.css";

export default function ProductCard({ product, onAdd }) {
  const price = Number(product.precio || 0);

  const normalizeEstado = () => {
    const raw = String(product.estado ?? "").trim().toLowerCase();

    if (raw.includes("des") || raw.includes("discont")) return "DESCONTINUADO";
    if (raw.includes("agot")) return "AGOTADO";
    if (raw.includes("disp")) return "DISPONIBLE";

    // fallback por boolean disponible
    const disp = product.disponible ?? true;
    return disp ? "DISPONIBLE" : "AGOTADO";
  };

  const estado = normalizeEstado();

  const badge = {
    text: estado === "DISPONIBLE" ? "Disponible" : estado === "AGOTADO" ? "Agotado" : "Descontinuado",
    cls: estado === "DISPONIBLE" ? "ok" : estado === "AGOTADO" ? "warn" : "off",
  };

  const categoria = product.categoria_nombre || "Otros";
  const canAdd = estado === "DISPONIBLE";

  return (
    <div className="pCard">
      <div className="pImg">
        <img
          src={product.imagen || "https://via.placeholder.com/600x400?text=Producto"}
          alt={product.nombre}
          loading="lazy"
        />
        <span className={`pBadge ${badge.cls}`}>{badge.text}</span>
      </div>

      <div className="pBody">
        <div className="pMeta">
          <div className="pCategory">{categoria.toUpperCase()}</div>
          <div className="pTag">Q</div>
        </div>

        <div className="pTitle">{product.nombre}</div>
        <div className="pDesc">{product.descripcion || "—"}</div>

        <div className="pBottom">
          <div className="pPrice">Q{price.toFixed(2)}</div>
          <button className="pBtn" disabled={!canAdd} onClick={() => onAdd?.(product)}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
