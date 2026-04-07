import React, { useState } from "react";
import "./historial.css";

const Historial = () => {
  const [logs] = useState([
    {
      id: 1,
      usuario: "admin1",
      accion: "Creó usuario",
      fecha: "2026-03-20",
      hora: "10:30 AM",
      detalle: "Usuario: juan123"
    },
    {
      id: 2,
      usuario: "admin2",
      accion: "Eliminó producto",
      fecha: "2026-03-20",
      hora: "11:15 AM",
      detalle: "Producto: Paracetamol"
    }
  ]);

  return (
    <div className="historial-container">
      <h2>Historial de acciones</h2>

      <table className="historial-table">
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
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.usuario}</td>
              <td>{log.accion}</td>
              <td>{log.fecha}</td>
              <td>{log.hora}</td>
              <td>{log.detalle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historial;