import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cotizacion_cart_v1";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? safeParse(raw, []) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
  if (!product?.id) return;

  let wasNew = false; // 👈 bandera

  setItems((prev) => {
    const idx = prev.findIndex((x) => x.id === product.id);
    const price = Number(product.precio) || 0;

    if (idx >= 0) {
      // ya existía → solo suma qty, NO abrir
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
      return copy;
    }

    // no existía → lo agregamos y marcamos que fue nuevo
    wasNew = true;

    return [
      ...prev,
      {
        id: product.id,
        nombre: product.nombre,
        precio: price,
        imagen: product.imagen,
        qty: 1,
      },
    ];
  });

  // 👇 solo si fue nuevo
  if (wasNew) setIsOpen(true);
};

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const inc = (id) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));

  const dec = (id) =>
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
        .filter((x) => x.qty > 0)
    );

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((acc, x) => acc + (Number(x.precio) || 0) * x.qty, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((acc, x) => acc + x.qty, 0), [items]);

  const value = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    inc,
    dec,
    clear,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
