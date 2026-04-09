import { useState, useEffect } from "react";
import "./historial.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OPCIONES_LIMPIEZA = [
  { label: "Nunca", meses: null },
  { label: "Cada 6 meses", meses: 6 },
  { label: "Cada año", meses: 12 },
  { label: "Todos", meses: "todos" },
];

const historialInicial = [
  {
    usuario: "admin1",
    accion: "Creó usuario",
    fecha: "2026-03-20",
    hora: "10:30 AM",
    detalle: "Usuario: juan123",
    tipo: "Usuarios",
  },
  {
    usuario: "admin2",
    accion: "Eliminó producto",
    fecha: "2026-03-20",
    hora: "11:15 AM",
    detalle: "Producto: Paracetamol",
    tipo: "Productos",
  },
  {
    usuario: "admin3",
    accion: "Editó categoría",
    fecha: "2025-01-10",
    hora: "09:00 AM",
    detalle: "Categoría: Analgésicos",
    tipo: "Categorías",
  },
];

function limpiarPorAntiguedad(lista, meses) {
  if (!meses || meses === "todos") return [];
  const limite = new Date();
  limite.setMonth(limite.getMonth() - meses);
  return lista.filter((item) => new Date(item.fecha) >= limite);
}

export default function Historial() {
  const [filtro, setFiltro] = useState("Todos");
  const [historial, setHistorial] = useState(historialInicial);
  const [limpieza, setLimpieza] = useState("Nunca");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    if (limpieza === "Nunca") {
      setHistorial(historialInicial);
    }
  }, [limpieza]);

  const handleLimpiezaChange = (e) => {
    const valor = e.target.value;
    setLimpieza(valor);
    if (valor !== "Nunca") {
      setMostrarConfirmacion(true);
    }
  };

  const handleConfirmar = () => {
    const opcion = OPCIONES_LIMPIEZA.find((o) => o.label === limpieza);
    if (opcion.meses === "todos") {
      setHistorial([]);
    } else {
      const limpio = limpiarPorAntiguedad(historial, opcion.meses);
      setHistorial(limpio);
    }
    setMostrarConfirmacion(false);
    setLimpieza("Nunca");
  };

  const handleCancelar = () => {
    setMostrarConfirmacion(false);
    setLimpieza("Nunca");
  };

  const historialFiltrado =
    filtro === "Todos"
      ? historial
      : historial.filter((item) => item.tipo === filtro);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de acciones", 14, 15);
    const tabla = historialFiltrado.map((item) => [
      item.usuario,
      item.accion,
      item.fecha,
      item.hora,
      item.detalle,
    ]);
    autoTable(doc, {
      head: [["Usuario", "Acción", "Fecha", "Hora", "Detalle"]],
      body: tabla,
      startY: 20,
    });
    doc.save("historial.pdf");
  };

  return (
    <div className="historial-container">
      <h2>Historial de acciones</h2>

      <div className="historial-layout">
        {/* Tabla */}
        <table className="historial-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {historialFiltrado.length > 0 ? (
              historialFiltrado.map((item, index) => (
                <tr key={index}>
                  <td>{item.usuario}</td>
                  <td>{item.accion}</td>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.detalle}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="sin-resultados">
                  Sin resultados para este filtro
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Panel derecho */}
        <div className="historial-panel">

          {/* Filtros */}
          <div className="filtros">
            {["Todos", "Productos", "Categorías", "Usuarios"].map((tipo) => (
              <button
                key={tipo}
                className={`btn-filtro ${filtro === tipo ? "activo" : ""}`}
                onClick={() => setFiltro(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Limpieza */}
          <div className="limpieza">
            <label className="limpieza-label">🗑️ Borrar registros:</label>
            <select
              className="limpieza-select"
              value={limpieza}
              onChange={handleLimpiezaChange}
            >
              {OPCIONES_LIMPIEZA.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exportar */}
          <button className="btn-pdf" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-titulo">¿Borrar historial?</h3>
            <p className="modal-texto">
              {limpieza === "Todos"
                ? "Se eliminará todo el historial de acciones."
                : `Se eliminarán todos los registros con más de ${limpieza.toLowerCase()}.`}{" "}
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-acciones">
              <button className="modal-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
              <button className="modal-confirmar" onClick={handleConfirmar}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}