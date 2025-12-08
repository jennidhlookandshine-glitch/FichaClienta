import { useState, useEffect, useContext } from "react";
import { ClientaContext } from "./ClientaContext";
import { useNavigate } from "react-router-dom";
import FichaAppLayout from "./FichaAppLayout";

export default function ClientasABC() {
  const [letraSeleccionada, setLetraSeleccionada] = useState("");
  const [clientasLetra, setClientasLetra] = useState([]);
  const { clientas } = useContext(ClientaContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (letraSeleccionada && clientas.length > 0) {
      const letraLower = letraSeleccionada.toLowerCase();

      const filtradas = clientas
        .filter((clienta) => (clienta.clienteLower || "").startsWith(letraLower))
        .sort((a, b) =>
          (a.clienteLower || "").localeCompare(b.clienteLower || "")
        );

      setClientasLetra(filtradas);
    } else {
      setClientasLetra([]);
    }
  }, [letraSeleccionada, clientas]);

  // Ir a ficha de una clienta
  const irAFicha = (clienta) => {
    if (!clienta || !clienta.id) {
      console.warn("No hay id de clienta para navegar:", clienta);
      return;
    }
    navigate(`/ficha/${clienta.id}`, { state: { clienta } });
  };

  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <FichaAppLayout
      currentServicio={null}
      showServicios={false}
      modo="clientas"
    >
      <div style={{ padding: 16, fontFamily: "Poppins, system-ui" }}>
        {/* Título */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            textAlign: "center",
            color: "#333",
            marginBottom: 20,
          }}
        >
          Clientas
        </h1>

        {/* Botones ABC */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {letras.map((letra) => {
            const activa = letraSeleccionada === letra;
            return (
              <button
                key={letra}
                type="button"
                onClick={() => setLetraSeleccionada(letra)}
                style={{
                  padding: "10px 0",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: activa
                    ? "#e91e63"
                    : "rgba(255,255,255,0.9)",
                  color: activa ? "#ffffff" : "#444",
                  boxShadow: activa
                    ? "0 4px 10px rgba(233,30,99,0.35)"
                    : "0 2px 6px rgba(0,0,0,0.10)",
                }}
              >
                {letra}
              </button>
            );
          })}
        </div>

        {/* Tarjeta lista de clientas */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 22,
            boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
            padding: 24,
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {letraSeleccionada ? (
            clientasLetra.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {clientasLetra.map((clienta) => (
                  <div
                    key={clienta.id}
                    onClick={() => irAFicha(clienta)}
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      background:
                        "linear-gradient(90deg,#fff0f7,#fce4ff,#f3e5f5)",
                      cursor: "pointer",
                      border: "1px solid #f8bbd0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {clienta.nombreCompleto ||
                        clienta.nombre ||
                        "Sin nombre"}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 14,
                        color: "#666",
                      }}
                    >
                      {clienta.servicio || "Servicio no especificado"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#777",
                }}
              >
                <p style={{ fontSize: 26, marginBottom: 6 }}>👀</p>
                <p style={{ fontWeight: 500 }}>
                  No hay clientas con la letra "{letraSeleccionada}"
                </p>
              </div>
            )
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#777",
              }}
            >
              <p style={{ fontSize: 30, marginBottom: 8 }}>📋</p>
              <p style={{ fontSize: 18, fontWeight: 500 }}>
                Selecciona una letra para ver tus clientas
              </p>
            </div>
          )}
        </div>
      </div>
    </FichaAppLayout>
  );
}
