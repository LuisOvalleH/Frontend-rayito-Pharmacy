import api from "./axios";

// ── Restricciones de imagen ───────────
export const IMAGE_RULES = {
  minDimension: 300,                       // 300×300 px mínimo
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  allowedTypesLabel: "JPG, PNG o WebP",
};

/**
 * Valida un archivo de imagen en el frontend antes de enviarlo al backend.
 * Retorna null si es válido, o un string con el mensaje de error.
 */
export async function validateImageFile(file) {
  if (!file) return "Debes seleccionar una imagen.";

  if (!IMAGE_RULES.allowedTypes.includes(file.type.toLowerCase())) {
    return `Solo se permiten imágenes ${IMAGE_RULES.allowedTypesLabel}.`;
  }

  // Validar dimensiones mínimas
  try {
    const dimensions = await getImageDimensions(file);
    if (
      dimensions.width < IMAGE_RULES.minDimension ||
      dimensions.height < IMAGE_RULES.minDimension
    ) {
      return (
        `La imagen debe tener al menos ${IMAGE_RULES.minDimension}×${IMAGE_RULES.minDimension} px ` +
        `(recibida: ${dimensions.width}×${dimensions.height} px).`
      );
    }
  } catch {
    // backend valida
  }

  return null;
}

function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

// ── Productos ─────────────────────────────────────────────────────────────────

/**
 * Obtiene productos paginados.
 * Retorna { results, count, next, previous } o array plano si no hay paginación.
 */
/**
 * Catálogo público — devuelve { results, count, next, previous } paginado.
 */
export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products/", { params });
  return data;
};

/**
 * Panel admin — carga todos los productos sin paginación (?admin=true).
 */
export const getAllProducts = async () => {
  const { data } = await api.get("/products/", { params: { admin: "true" } });
  return Array.isArray(data) ? data : data?.results ?? [];
};

/**
 * Destacados para el Home — sin paginación (?destacado=true).
 */
export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/", { params: { destacado: "true" } });
  return Array.isArray(data) ? data : data?.results ?? [];
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}/`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categorias/");
  return data?.results ?? data;
};

export const uploadProductImage = async (file) => {
  const payload = new FormData();
  payload.append("file", file, file.name || "upload.jpg");
  const { data } = await api.post("/uploads/product-image/", payload);
  return data?.url || "";
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products/", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}/`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}/`);
};

// ── Configuración del sitio ────────────────────────────────────────────────

export const getSiteConfig = async () => {
  const { data } = await api.get("/config/");
  return data;
};

export const updateSiteConfig = async (payload) => {
  const { data } = await api.patch("/config/", payload);
  return data;
};
