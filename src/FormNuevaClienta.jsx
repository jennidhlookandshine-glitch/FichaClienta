import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormularioDatosBasicos from "./FormularioDatosBasicos";
import { useClienta } from "./ClientaContext";

export default function BasicosPage() {
  const navigate = useNavigate();
  const [datosLocales, setDatosLocales] = useState(null);

  const { setNuevaFicha } = useClienta();

  const handleGuardarYContinuar = () => {
    if (!datosLocales) {
      alert("Primero completa y guarda los datos básicos de la clienta.");
      return;
    }

    // Guardas en el contexto (por si lo necesitas después)
    setNuevaFicha(datosLocales);

    // Pasas a la pantalla de selección de servicio con la clienta en state
    navigate("/seleccionar-servicio", {
      state: { clienta: datosLocales },
    });
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
            gridTemplateColumns: "1fr",
            gap: 25,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto",
              justifyItems: "center",
            }}
          >
            <div
              style={{
                width: "min(1040px, 100%)",
                fontSize: 25,
                lineHeight: 1.5,
              }}
            >
              {/* Este formulario debe ir actualizando datosLocales con todos los datos básicos + médicos */}
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
                onClick={handleGuardarYContinuar}
              >
                Guardar y continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
