export default function Contacto() {
  return (
    <div className="section">
      <div className="container">
        <h1>Contacto</h1>
        <p className="muted">
          Estamos disponibles para atender consultas, cotizaciones y solicitudes
          de abastecimiento farmacéutico en Guatemala.
        </p>

        {/* Tarjetas de contacto */}
        <div className="grid3" style={{ marginTop: 24 }}>
          <div className="cardInfo">
            <h3>Atención telefónica</h3>
            <p>
              Comunicación directa con nuestro equipo para consultas,
              cotizaciones y coordinación de pedidos.
            </p>
            <p style={{ marginTop: 12, fontWeight: 700 }}>
              📞 +502 0000 0000
            </p>
          </div>

          <div className="cardInfo">
            <h3>Facebook oficial</h3>
            <p>
              Información, novedades y atención directa a través de nuestra
              página oficial.
            </p>
            <p style={{ marginTop: 12, fontWeight: 700 }}>
              🔵 facebook.com/Farquetsa
            </p>
          </div>

          <div className="cardInfo">
            <h3>Horarios de atención</h3>
            <p>Lunes a Viernes: 8:00 a.m. – 5:00 p.m.</p>
            <p>Sábados: 8:00 a.m. – 12:00 p.m.</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>

        {/* Ubicación */}
        <div style={{ marginTop: 56 }}>
          <h2>Ubicación</h2>
          <p className="muted">
            Atención presencial previa coordinación. Nuestra sede se encuentra
            en Quetzaltenango, Guatemala.
          </p>

          <div className="mapCard">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3490.106725632739!2d-91.5199464!3d14.842451700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858ea38b78a2b0c5%3A0x444628a06ac3715a!2sFARQUETSA!5e1!3m2!1ses-419!2sgt!4v1770006451115!5m2!1ses-419!2sgt"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación FARQUETSA"
            />
          </div>
        </div>

        <p className="muted" style={{ marginTop: 36 }}>
          Para cotizaciones, abastecimiento o información adicional, puedes
          comunicarte con nuestro equipo a través de los canales indicados.
        </p>
      </div>
    </div>
  );
}
