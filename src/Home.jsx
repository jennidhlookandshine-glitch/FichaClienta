import { useMemo, useState } from "react";
import logo from "./logo.png";
import FichaApp from "./FichaApp.jsx";

function Abecedario({ letraActiva, setLetra }) {
  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 12 }}>
      {letras.map((L) => (
        <button
          key={L}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "2px solid #f472b6",
            background: letraActiva === L ? "#ffe7f1" : "transparent",
            color: "#db2777",
            fontWeight: 700,
          }}
          onClick={() => setLetra(L)}
        >
          {L}
        </button>
      ))}
    </div>
  );
}

function VistaClientas({ clientas = [], onVolver }) {
  const [letra, setLetra] = useState("A");
  const filtradas = useMemo(
    () => clientas.filter((c) => (c.nombre || "").toLowerCase().startsWith(letra.toLowerCase())),
    [clientas, letra]
  );

  return (
    <section style={{ textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Marcellus', serif" }}>Clientas</h2>
      <p>Pulsa una letra para ver las clientas con esa inicial.</p>
      <Abecedario letraActiva={letra} setLetra={setLetra} />
      <div style={{ margin: "0 auto", maxWidth: 920, background: "rgba(255,255,255,.75)", border: "1px solid rgba(255,105,180,.25)", borderRadius: 16, padding: 16 }}>
        {filtradas.length === 0 ? (
          <p>No hay clientas con “{letra}”.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {filtradas.map((c) => (
              <li key={c.id ?? c.nombre}>{c.nombre}</li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <button
          onClick={onVolver}
          style={{ border: "2px solid #f472b6", color: "#db2777", borderRadius: 999, padding: "10px 16px", fontWeight: 700, background: "transparent" }}
        >
          Volver
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [vista, setVista] = useState("landing");
  const [fichas, setFichas] = useState([]);
  const handleGuardar = (nuevaFicha) => setFichas((prev) => [...prev, nuevaFicha]);

  const clientas = useMemo(
    () => [
      { id: 1, nombre: "Daniela Soto" },
      { id: 2, nombre: "Diana Pérez" },
      { id: 3, nombre: "Carla Núñez" },
      { id: 4, nombre: "Camila Ríos" },
      { id: 5, nombre: "Antonella Vera" },
      { id: 6, nombre: "Bárbara León" },
    ],
    []
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#ffd1e1,#ffc1dc,#ffb3d7)" }}>
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: 24, textAlign: "center" }}>
        {vista === "landing" && (
          <header style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24, paddingBottom: 28 }}>
            <img src={logo} alt="Jenni HD Look and Shine" style={{ maxWidth: 300, height: "auto", marginBottom: 50 }} />
            <h1 style={{ fontFamily: "'Marcellus', serif", fontWeight: 600, fontSize: "clamp(34px, 6.4vw, 56px)", letterSpacing: ".3px", marginTop: 4, marginBottom: 20 }}>
              Ficha Clientas
            </h1>
            <p style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui", fontSize: "clamp(15px, 2.4vw, 20px)", color: "#6b214a", marginBottom: 50 }}>
              Belleza, confianza y cuidado personal 💖
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
              {/* Botón rosado 1 */}
              <button
                onClick={() => setVista("ficha")}
                style={{
                  width: 300,
                  height: 60,
                  border: 0,
                  borderRadius: 999,
                  color: "#fff",
                  fontWeight: 700,
                  background: "linear-gradient(90deg,#f472b6,#db2777)",
                  boxShadow: "0 6px 16px rgba(219,39,119,.35)",
                }}
              >
                INICIAR FICHA
              </button>

              {/* Corregido: también rosado */}
              <button
                onClick={() => setVista("clientas")}
                style={{
                  width: 300,
                  height: 60,
                  border: 0,
                  borderRadius: 999,
                  color: "#fff",
                  fontWeight: 700,
                  background: "linear-gradient(90deg,#f472b6,#db2777)",
                  boxShadow: "0 6px 16px rgba(219,39,119,.35)",
                }}
              >
                VER CLIENTAS
              </button>
            </div>
          </header>
        )}

        {vista === "ficha" && (
          <div>
            <FichaApp onGuardar={handleGuardar} onVolver={() => setVista("landing")} />
          </div>
        )}

        {vista === "clientas" && (
          <div>
            <VistaClientas clientas={clientas} onVolver={() => setVista("landing")} />
          </div>
        )}
      </div>
    </div>
  );
}
