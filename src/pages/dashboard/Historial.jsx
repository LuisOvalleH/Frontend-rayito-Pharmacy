import { useState } from "react";
import "./historial.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Historial() {
  const [filtro, setFiltro] = useState("Productos");

  const historial = [
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
  ];

  const historialFiltrado = historial.filter((item) => item.tipo === filtro);

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

        {/* Panel derecho: filtros + exportar */}
        <div className="historial-panel">
          <div className="filtros">
            {["Productos", "Categorías", "Usuarios"].map((tipo) => (
              <button
                key={tipo}
                className={`btn-filtro ${filtro === tipo ? "activo" : ""}`}
                onClick={() => setFiltro(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>

          <button className="btn-pdf" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}