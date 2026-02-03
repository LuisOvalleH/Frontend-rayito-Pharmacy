import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./servicios.css";

export default function ServiciosPage() {
  // Animaciones al hacer scroll (sin librerías)
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            // Si querés que solo se anime una vez:
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const services = [
    {
      icon: "📦",
      title: "Distribución farmacéutica al por mayor",
      text:
        "Abastecemos farmacias, clínicas y negocios del sector salud con productos confiables, control de pedidos y disponibilidad real.",
    },
    {
      icon: "🧑‍⚕️",
      title: "Venta a clientes individuales",
      text:
        "Atención directa y orientación responsable para elegir lo que necesitas, con opciones claras y seguimiento.",
    },
    {
      icon: "✅",
      title: "Catálogo por disponibilidad",
      text:
        "Nuestro catálogo se mantiene actualizado por estado (disponible, agotado, descontinuado) para cotizar rápido.",
    },
    {
      icon: "🚚",
      title: "Envíos y coordinación logística",
      text:
        "Coordinamos entregas según ubicación y disponibilidad, buscando siempre la opción más práctica para ti.",
    },
    {
      icon: "💬",
      title: "Asesoría farmacéutica",
      text:
        "Orientación básica sobre productos, uso responsable y alternativas disponibles, con personal capacitado.",
    },
    {
      icon: "⚡",
      title: "Cotización rápida",
      text:
        "Envíanos tu lista y te respondemos con disponibilidad y opciones claras en el menor tiempo posible.",
    },
  ];

  const steps = [
    { n: "01", title: "Consulta", text: "Nos indicas tus productos o necesidades específicas." },
    { n: "02", title: "Validación", text: "Revisamos disponibilidad, presentaciones y condiciones." },
    { n: "03", title: "Cotización", text: "Te enviamos una propuesta clara y sin compromisos." },
    { n: "04", title: "Entrega / Retiro", text: "Coordinamos entrega o retiro según tu zona." },
  ];

  const trust = [
    {
      icon: "🏆",
      title: "Más de 20 años de experiencia",
      text: "Trayectoria respaldada por atención constante y relaciones comerciales duraderas.",
    },
    {
      icon: "🧪",
      title: "Productos confiables",
      text: "Trabajamos con proveedores y laboratorios reconocidos para asegurar calidad.",
    },
    {
      icon: "🤝",
      title: "Atención personalizada",
      text: "Seguimiento real según tu necesidad: mayorista o cliente individual.",
    },
  ];

  return (
    <div className="servicesPage">
      {/* HERO con fondo tech animado */}
      <section className="servicesHero">
        <div className="techBg" aria-hidden="true">
          <div className="grid" />
          <div className="waves" />
          <div className="glow a" />
          <div className="glow b" />
        </div>

        <div className="container heroInner">
          <div className="pill reveal from-left">
            FARQUETSA • Mayoreo • Retail • Asesoría
          </div>

          <h1 className="reveal from-left">
            Servicios farmacéuticos <span>profesionales</span>
          </h1>

          <p className="heroText reveal from-left">
            Soluciones confiables para farmacias, clínicas, negocios y clientes individuales en Guatemala.
            Cotiza rápido con atención cercana.
          </p>

          {/* Solo 1 CTA principal arriba (sin redundancia) */}
          <div className="heroActions reveal from-left">
            <Link className="btnPrimary" to="/contacto">
              Solicitar cotización
            </Link>
            <Link className="btnGhost" to="/productos">
              Ver catálogo
            </Link>
          </div>

          <div className="heroStats reveal from-up">
            <div className="statCard">
              <strong>20+</strong>
              <span>años de experiencia</span>
            </div>
            <div className="statCard">
              <strong>Catálogo</strong>
              <span>actualizado por estado</span>
            </div>
            <div className="statCard">
              <strong>Atención</strong>
              <span>personalizada y responsable</span>
            </div>
            <div className="statCard">
              <strong>Envíos</strong>
              <span>según zona y disponibilidad</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <div>
              <div className="kicker reveal from-left">SERVICIOS</div>
              <h2 className="reveal from-left">Nuestros Servicios</h2>
              <p className="muted reveal from-left">
                Soluciones pensadas para rapidez, claridad en cotizaciones y disponibilidad real.
              </p>
            </div>
          </div>

          <div className="servicesGrid">
            {services.map((s, i) => (
              <article
                key={s.title}
                className={`serviceCard reveal ${i % 2 === 0 ? "from-left" : "from-right"}`}
                style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              >
                <div className="serviceIcon" aria-hidden="true">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section soft">
        <div className="container">
          <div className="sectionHead">
            <div>
              <div className="kicker reveal from-left">PROCESO</div>
              <h2 className="reveal from-left">Cómo trabajamos</h2>
              <p className="muted reveal from-left">Un flujo simple para cotizar sin complicaciones.</p>
            </div>
          </div>

          <div className="processGrid">
            {steps.map((st, i) => (
              <div
                key={st.n}
                className={`processStep reveal from-up`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="stepBadge">{st.n}</div>
                <h4>{st.title}</h4>
                <p>{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <div>
              <div className="kicker reveal from-left">CONFIANZA</div>
              <h2 className="reveal from-left">Compromiso y confianza</h2>
              <p className="muted reveal from-left">
                Nuestro enfoque es calidad, transparencia y seguimiento real.
              </p>
            </div>
          </div>

          <div className="trustGrid">
            {trust.map((t, i) => (
              <div
                key={t.title}
                className={`trustCard reveal ${i === 1 ? "from-up" : i === 0 ? "from-left" : "from-right"}`}
              >
                <div className="trustIcon" aria-hidden="true">{t.icon}</div>
                <strong>{t.title}</strong>
                <p>{t.text}</p>
              </div>
            ))}
          </div>

          {/* CTA final (solo 1) */}
          <div className="ctaPanel reveal from-up">
            <div>
              <div className="ctaKicker">¿LISTO PARA COTIZAR?</div>
              <div className="ctaTitle">Te ayudamos a encontrar lo que necesitas</div>
              <p className="ctaText">
                Para cotizaciones, abastecimiento o información adicional, comunícate con nuestro equipo.
              </p>
            </div>

            <Link className="btnPrimary" to="/contacto">
              Ir a Contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
