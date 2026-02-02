import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./navbar.css";

export default function Navbar() {
  const { open, count } = useCart();

  return (
    <header className="navWrap">
      <div className="navInner">
        <div className="brand">
          <div className="brandLogo">F</div>
          <div className="brandText">
            <strong>Farquetsa</strong>
            <span>Farmaceutica S.A</span>
          </div>
        </div>

        <nav className="navLinks">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "active" : "")}>
            Servicios
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => (isActive ? "active" : "")}>
            Productos
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "active" : "")}>
            Contacto
          </NavLink>
        </nav>

        <div className="navActions">
          <button className="cartBtn" type="button" onClick={open}>
            Carrito
            {count > 0 && <span className="cartBadge">{count}</span>}
          </button>

          <a className="callBtn" href="tel:+50200000000">
            Llamar Ahora
          </a>
        </div>
      </div>
    </header>
  );
}
