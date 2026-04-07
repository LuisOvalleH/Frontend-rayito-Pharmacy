import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "./productos.css";

export default function ProductosPage() {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Filtros UI
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState("relevancia");
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 500 });

  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;

  const fetchPage = useCallback(async (pageNum, qParam) => {
    try {
      setLoading(true);
      const params = { page: pageNum };
      if (qParam) params.search = qParam;

      const data = await getProducts(params);
      const list = Array.isArray(data) ? data : data?.results ?? [];
      const count = data?.count ?? list.length;

      setProducts(list);
      setTotalCount(count);
      setHasNext(!!data?.next);
      setHasPrev(!!data?.previous);

      // Inferir pageSize desde la respuesta
      if (list.length > 0) setPageSize(list.length);

      // Calcular bounds de precio en la primera página
      if (pageNum === 1) {
        const nums = list.map((p) => Number(p?.precio)).filter(Number.isFinite);
        if (nums.length) {
          const min = Math.floor(Math.min(...nums));
          const max = Math.ceil(Math.max(...nums));
          setPriceBounds({ min, max });
          setPriceMin(min);
          setPriceMax(max);
        }
      }
    } catch (e) {
      console.error("Error cargando productos", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page, q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      page === 1 ? next.delete("page") : next.set("page", page);
      return next;
    }, { replace: true });
  }, [page]);

  // Al montar, leer q de la URL
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam) setQ(qParam);
  }, []);

  const norm = (v) => String(v ?? "").trim().toLowerCase();

  const normalizeEstado = useCallback((p) => {
    const e = norm(p?.estado);
    if (e.includes("des") || e.includes("discont")) return "DESCONTINUADO";
    if (e.includes("agot")) return "AGOTADO";
    if (e.includes("disp")) return "DISPONIBLE";
    return p?.disponible ?? true ? "DISPONIBLE" : "AGOTADO";
  }, []);

  const getCategoriaObj = (p) => ({
    id: p?.categoria != null ? String(p.categoria) : "otros",
    nombre: String(p?.categoria_nombre ?? "").trim() || "Otros",
  });

  const categories = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const c = getCategoriaObj(p);
      if (!map.has(c.id)) map.set(c.id, c.nombre);
    }
    return Array.from(map.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [products]);

  const estadosDisponibles = ["DISPONIBLE", "AGOTADO", "DESCONTINUADO"];

  const toggleSetValue = (setter, value) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  // Filtros locales sobre la página actual
  const filtered = useMemo(() => {
    let list = [...products];

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          (p.nombre || "").toLowerCase().includes(query) ||
          (p.descripcion || "").toLowerCase().includes(query)
      );
    }

    list = list.filter((p) => {
      const pr = Number(p?.precio);
      return Number.isFinite(pr) && pr >= priceMin && pr <= priceMax;
    });

    if (selectedCats.size > 0)
      list = list.filter((p) => selectedCats.has(getCategoriaObj(p).id));

    if (selectedStates.size > 0)
      list = list.filter((p) => selectedStates.has(normalizeEstado(p)));

    const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    if (sort === "precio_asc") list.sort((a, b) => n(a.precio) - n(b.precio));
    if (sort === "precio_desc") list.sort((a, b) => n(b.precio) - n(a.precio));
    if (sort === "nombre") list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"));

    return list;
  }, [products, q, sort, selectedCats, selectedStates, priceMin, priceMax, normalizeEstado]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Números de página con ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.add(i);
    return Array.from(pages).sort((a, b) => a - b).reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);
  }, [totalPages, page]);

  return (
    <div className="catalogWrap">
      <div className="catalogTop">
        <div className="catalogTitle">
          <h1>Todos los Medicamentos</h1>
          <p>
            {loading
              ? "Cargando..."
              : totalPages > 1
              ? `${totalCount} productos · página ${page} de ${totalPages}`
              : `${filtered.length} productos`}
          </p>
        </div>

        <div className="catalogSearchRow">
          <div className="searchBox">
            <span className="searchIcon">⌕</span>
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Buscar medicamentos por nombre o principio activo..."
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sortSelect">
            <option value="relevancia">Ordenar: Relevancia</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre: A → Z</option>
          </select>
        </div>
      </div>

      <div className="catalogBody">
        {/* Sidebar filtros */}
        <aside className="filters">
          <h3>Filtros</h3>

          <div className="filterBlock">
            <p className="filterLabel">Rango de Precio</p>
            <div className="rangeValues">
              <span>Q{priceMin}</span>
              <span>Q{priceMax}</span>
            </div>
            <div className="rangeWrap">
              <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceMin}
                onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))} className="rangeInput" />
              <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceMax}
                onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))} className="rangeInput" />
            </div>
            <button className="clearBtn" type="button"
              onClick={() => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }}
              disabled={priceMin === priceBounds.min && priceMax === priceBounds.max}>
              Limpiar precio
            </button>
            <p className="hint">Entre Q{priceMin} y Q{priceMax}.</p>
          </div>

          <div className="filterBlock">
            <p className="filterLabel">Estado</p>
            <div className="pillList">
              {estadosDisponibles.map((st) => (
                <button key={st}
                  className={`pill pillState ${selectedStates.has(st) ? "active" : ""} ${st}`}
                  type="button" onClick={() => toggleSetValue(setSelectedStates, st)}>
                  {st === "DISPONIBLE" ? "Disponible" : st === "AGOTADO" ? "Agotado" : "Descontinuado"}
                </button>
              ))}
            </div>
            <button className="clearBtn" type="button"
              onClick={() => setSelectedStates(new Set())} disabled={selectedStates.size === 0}>
              Limpiar estado
            </button>
          </div>

          <div className="filterBlock">
            <p className="filterLabel">Categoría</p>
            <div className="pillList">
              {categories.map((cat) => (
                <button key={cat.id}
                  className={`pill ${selectedCats.has(cat.id) ? "active" : ""}`}
                  type="button" onClick={() => toggleSetValue(setSelectedCats, cat.id)}>
                  {cat.nombre}
                </button>
              ))}
            </div>
            <button className="clearBtn" type="button"
              onClick={() => setSelectedCats(new Set())} disabled={selectedCats.size === 0}>
              Limpiar categorías
            </button>
          </div>
        </aside>

        {/* Grid + paginación */}
        <section className="gridWrap">
          {loading ? (
            <div className="stateBox">Cargando productos…</div>
          ) : filtered.length === 0 ? (
            <div className="stateBox">
              <strong>No hay productos</strong>
              <p>Prueba con otra búsqueda o ajusta los filtros.</p>
            </div>
          ) : (
            <>
              <div className="grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={addItem} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Páginas del catálogo">
                  <button className="pageBtn" onClick={() => goToPage(page - 1)}
                    disabled={!hasPrev} aria-label="Página anterior">
                    ← Anterior
                  </button>

                  <div className="pageNumbers">
                    {pageNumbers.map((item, idx) =>
                      item === "..." ? (
                        <span key={`e-${idx}`} className="pageEllipsis">…</span>
                      ) : (
                        <button key={item}
                          className={`pageNum ${item === page ? "active" : ""}`}
                          onClick={() => goToPage(item)}
                          aria-current={item === page ? "page" : undefined}>
                          {item}
                        </button>
                      )
                    )}
                  </div>

                  <button className="pageBtn" onClick={() => goToPage(page + 1)}
                    disabled={!hasNext} aria-label="Página siguiente">
                    Siguiente →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
