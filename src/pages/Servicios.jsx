import "./servicios.css";

export default function ServiciosPage() {
  return (
    <div className="servicesPage">
      {/* HEADER */}
      <section className="servicesHero">
        <div className="container">
          <h1>Servicios</h1>
          <p>
            En Farquetsa S.A. ofrecemos soluciones farmacéuticas confiables,
            adaptadas tanto a farmacias y negocios como a clientes individuales
            en Guatemala.
          </p>
        </div>
      </section>

      {/* SERVICIOS PRINCIPALES */}
      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Nuestros Servicios</h2>

          <div className="servicesGrid">
            <div className="serviceBox">
              <h3>Distribución farmacéutica al por mayor</h3>
              <p>
                Abastecemos farmacias, clínicas y negocios del sector salud con
                productos farmacéuticos confiables, garantizando disponibilidad
                y control en cada pedido.
              </p>
            </div>

            <div className="serviceBox">
              <h3>Venta a clientes individuales</h3>
              <p>
                Atención directa a clientes finales, ofreciendo medicamentos y
                productos de salud con asesoría responsable y transparente.
              </p>
            </div>

            <div className="serviceBox">
              <h3>Catálogo actualizado por disponibilidad</h3>
              <p>
                Nuestro catálogo se mantiene actualizado, mostrando productos
                disponibles para facilitar cotizaciones claras y eficientes.
              </p>
            </div>

            <div className="serviceBox">
              <h3>Envíos y coordinación logística</h3>
              <p>
                Coordinamos entregas según ubicación y disponibilidad, buscando
                siempre una solución práctica para cada cliente.
              </p>
            </div>

            <div className="serviceBox">
              <h3>Asesoría farmacéutica</h3>
              <p>
                Brindamos orientación básica sobre productos, uso responsable y
                alternativas disponibles, con personal capacitado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section soft">
        <div className="container">
          <h2 className="sectionTitle">Cómo trabajamos</h2>

          <div className="processGrid">
            <div className="processStep">
              <span>01</span>
              <p>Consulta de productos o necesidades específicas.</p>
            </div>

            <div className="processStep">
              <span>02</span>
              <p>Revisión de disponibilidad y condiciones.</p>
            </div>

            <div className="processStep">
              <span>03</span>
              <p>Cotización clara y sin compromisos.</p>
            </div>

            <div className="processStep">
              <span>04</span>
              <p>Coordinación de entrega o retiro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Compromiso y confianza</h2>

          <div className="trustGrid">
            <div className="trustItem">
              <strong>Más de 20 años de experiencia</strong>
              <p>
                Trayectoria respaldada por atención constante y relaciones
                comerciales duraderas.
              </p>
            </div>

            <div className="trustItem">
              <strong>Productos confiables</strong>
              <p>
                Trabajamos únicamente con proveedores y laboratorios reconocidos.
              </p>
            </div>

            <div className="trustItem">
              <strong>Atención personalizada</strong>
              <p>
                Cada cliente recibe seguimiento acorde a su necesidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE SIN BOTÓN */}
      <section className="section soft">
        <div className="container closingText">
          <p>
            Para cotizaciones, abastecimiento o información adicional, puedes
            comunicarte con nuestro equipo desde la sección de contacto.
          </p>
        </div>
      </section>
    </div>
  );
}
