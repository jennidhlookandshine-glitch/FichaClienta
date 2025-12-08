import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function SeleccionarServicio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nuevaFicha } = useContext(ClientaContext);

  // Puede venir por contexto (nuevaFicha) o por state (clienta existente)
  const clientaDesdeState = location.state?.clienta || null;
  const clientaActiva = clientaDesdeState || nuevaFicha;

  const serviciosDisponibles = [
    { nombre: "Lifting", ruta: "/ficha/lifting" },
    { nombre: "Extensiones", ruta: "/ficha/extensiones" },
    { nombre: "Laminado cejas", ruta: "/ficha/laminado" },
    { nombre: "Limpieza facial", ruta: "/ficha/limpieza" },
    { nombre: "Depilación facial", ruta: "/ficha/depilacion" },
    { nombre: "Hydrogloss", ruta: "/ficha/hydrogloss" },
    { nombre: "Masaje reductivo", ruta: "/ficha/masaje-reductivo" },
    { nombre: "Masaje relajante", ruta: "/ficha/masaje-relajante" },
  ];

  if (!clientaActiva) {
    return (
      <div style={{ padding: 20 }}>
        <p>No hay clienta seleccionada.</p>
        <button onClick={() => navigate("/")}>Volver</button>
      </div>
    );
  }

  const nombreMostrar =
    clientaActiva.nombreCompleto ||
    `${clientaActiva.nombre || ""} ${clientaActiva.apellido || ""}`.trim() ||
    "Clienta sin nombre";

  const handleIrAFormulario = (ruta) => {
    // Pasamos también la clienta al formulario del servicio
    navigate(ruta, { state: { clienta: clientaActiva } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffd6e8, #ffc0da)",
        padding: 30,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        Agregar servicio para
      </h2>

      <h3 style={{ textAlign: "center", marginBottom: 25, color: "#e91e63" }}>
        {nombreMostrar}
      </h3>

      {/* BOTONES DE SERVICIOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 15,
        }}
      >
        {serviciosDisponibles.map((servicio, index) => (
          <button
            key={index}
            onClick={() => handleIrAFormulario(servicio.ruta)}
            style={{
              padding: 14,
              borderRadius: 20,
              border: "2px solid #e91e63",
              background: "#fff",
              color: "#e91e63",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            }}
          >
            {servicio.nombre}
          </button>
        ))}
      </div>

      {/* BOTÓN VOLVER */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: 14,
            background: "#f48fb1",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            fontWeight: "bold",
            cursor: "pointer",
            width: 180,
          }}
        >
          Volver ⬅
        </button>
      </div>
    </div>
  );
}