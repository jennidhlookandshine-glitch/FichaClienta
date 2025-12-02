import React from "react";
import { Link } from "react-router-dom";

export default function CardGradient({
  title,
  subtitle,
  children,
  actions = null, // opcional: botones o links a la derecha del título
}) {
  return (
    <div
      className="card-gradient"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,105,180,.25)",
        background: "linear-gradient(180deg,#fff0f5,#ffe4ef)",
        boxShadow: "0 8px 18px rgba(0,0,0,.06)",
        padding: 20,
        color: "#3b2f34",
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  letterSpacing: ".3px",
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  opacity: 0.8,
                  fontSize: ".92rem",
                  margin: "4px 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      )}

      <div
        style={{
          height: 1,
          margin: "12px 0 16px",
          background:
            "linear-gradient(90deg,transparent,rgba(255,105,180,.35),transparent)",
        }}
      />

      <div>{children}</div>
    </div>
  );
}

/* ------- Ejemplo de acciones (chips de servicios) ------- */
export const ServiciosChips = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Link to="/ficha/lifting" className="chip">Lifting</Link>
    <Link to="/ficha/extensiones" className="chip">Extensiones</Link>
    <Link to="/ficha/laminado" className="chip">Laminado cejas</Link>
    <Link to="/ficha/limpieza" className="chip">Limpieza facial</Link>
    <Link to="/ficha/depilacion" className="chip">Depilación facial</Link>
    <Link to="/ficha/hydrogloss" className="chip">Hydrogloss</Link>
    <Link to="/ficha/masaje-reductivo" className="chip">Masaje reductivo</Link>
    <Link to="/ficha/masaje-relajante" className="chip">Masaje relajante</Link>
    <Link to="/clientas" className="chip">Clientas</Link>
  </div>
);

/* ------- Estilos base para .chip (App.css o index.css) -------
.chip {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,105,180,.35);
  background: rgba(255,255,255,.65);
  color: #7a3b52;
  text-decoration: none;
  font-size: .9rem;
  transition: all .15s ease-in-out;
}
.chip:hover {
  background: #ffd1e1;
  border-color: rgba(255,105,180,.6);
  color: #5c2b3e;
}
*/

/* ------- Ejemplo de uso -------
<CardGradient
  title="💁‍♀️ Datos Básicos de la Clienta"
  subtitle="Para identificar y mantener registro clínico"
  actions={<ServiciosChips />}
/>
*/

