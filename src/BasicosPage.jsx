import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormularioDatosBasicos from "./FormularioDatosBasicos";
import { useClienta } from "./ClientaContext";

export default function BasicosPage() {
  const navigate = useNavigate();
  const [datosLocales, setDatosLocales] = useState(null);

  // ✔️ Ahora SÍ usamos la función correcta
  const { setNuevaFicha } = useClienta();

  const rutas = {
    lifting: "/ficha/lifting",
    extensiones: "/ficha/extensiones",
    laminado: "/ficha/laminado",
    limpieza: "/ficha/limpieza",
    depilacion: "/ficha/depilacion",
    hydrogloss: "/ficha/hydrogloss",
    masaje_reductivo: "/ficha/masaje-reductivo",
    masaje_relajante: "/ficha/masaje-relajante",
  };

  const continuar = () => {
    if (!datosLocales) return;

    // ✔️ Ahora SÍ guardamos esto en el contexto que FinalFicha espera
    setNuevaFicha(datosLocales);

    const key = datosLocales?.servicio ?? "lifting";
    navigate(rutas[key] || "/ficha/basicos");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#ffd1e1,#ffc1dc,#ffb3d7)",
        paddingBottom: 40,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 25,
          }}
        >
          <aside
            style={{
              position: "sticky",
              top: 24,
              alignSelf: "start",
              display: "flex",
              flexDirection: "column",
              gap: 70,
            }}
          >
            <Link className="btn-outline" to="/ficha/lifting" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Lifting</Link>
            <Link className="btn-outline" to="/ficha/extensiones" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Extensiones</Link>
            <Link className="btn-outline" to="/ficha/laminado" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Laminado cejas</Link>
            <Link className="btn-outline" to="/ficha/limpieza" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Limpieza facial</Link>
            <Link className="btn-outline" to="/ficha/depilacion" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Depilación facial</Link>
            <Link className="btn-outline" to="/ficha/hydrogloss" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Hydrogloss</Link>
            <Link className="btn-outline" to="/ficha/masaje-reductivo" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Masaje reductivo</Link>
            <Link className="btn-outline" to="/ficha/masaje-relajante" style={{ height: 48, minWidth: 220, fontSize: 15 }}>Masaje relajante</Link>
          </aside>

          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto",
              justifyItems: "center",
            }}
          >
            <div style={{ width: "min(1040px, 100%)", fontSize: 25, lineHeight: 1.5 }}>
              <FormularioDatosBasicos onChange={setDatosLocales} />
            </div>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                gap: 100,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/"
                className="btn-primary"
                style={{
                  width: 200,
                  height: 48,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Volver
              </Link>

              <button
                className="btn-primary"
                style={{ width: 200, height: 48 }}
                onClick={continuar}
              >
                Continuar
              </button>

              <Link
                to="/clientas"
                className="btn-primary"
                style={{
                  width: 200,
                  height: 48,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Clientas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


