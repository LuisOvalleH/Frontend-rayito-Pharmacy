import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";

import Home from "./pages/Home";
import Productos from "./pages/ProductosPage";
import Servicios from "./pages/Servicios";
import Contacto from "./pages/Contacto";

import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

// Admin
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminCategorias from "./pages/admin/AdminCategorias";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>

          {/* ================= ADMIN LOGIN ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= ADMIN PROTEGIDO ================= */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="categorias" element={<AdminCategorias />} />
            </Route>
          </Route>
        </Routes>

        {/* Drawer global (solo una vez) */}
        <CartDrawer />
      </BrowserRouter>
    </CartProvider>
  );
}
