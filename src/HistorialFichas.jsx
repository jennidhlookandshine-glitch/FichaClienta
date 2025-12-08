import React, { useEffect, useState } from "react";
import { useClienta } from "./ClientaContext";

export default function HistorialFichas() {
  const { clientas } = useClienta();
  const [todosServicios, setTodosServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        setCargando(true);
        
        // Recopilar todos los servicios de todas las clientas
        const servicios = [];
        clientas.forEach((clienta) => {
          if (clienta.servicios && Array.isArray(clienta.servicios)) {
            clienta.servicios.forEach((servicio, index) => {
              servicios.push({
                id: `${clienta.id}-${servicio.fecha}-${index}`,
                clientaId: clienta.id,
                clientaNombre: clienta.nombreCompleto || clienta.nombre || "Sin nombre",
                telefono: clienta.telefono,
                ...servicio,
              });
            });
          }
        });

        // Ordenar por fecha más reciente primero
        servicios.sort((a, b) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);
          return fechaB - fechaA;
        });

        setTodosServicios(servicios);
      } catch (e) {
        console.error("Error cargando historial:", e);
      } finally {
        setCargando(false);
      }
    }

    if (clientas.length > 0) {
      cargar();
    }
  }, [clientas]);

  if (cargando) {
    return (
      <div style={{ padding: "30px", fontFamily: "Poppins", textAlign: "center" }}>
        <p>Cargando fichas...</p>
      </div>
    );
  }

  if (todosServicios.length === 0) {
    return (
      <div style={{ padding: "30px", fontFamily: "Poppins", textAlign: "center" }}>
        <h1 style={{ marginBottom: 24 }}>Historial de Servicios 💆‍♀️</h1>
        <p>No hay servicios registrados aún.</p>
      </div>
    );
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha desconocida";
    try {
      return new Date(fecha).toLocaleDateString("es-CL");
    } catch {
      return String(fecha);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Historial Completo ({todosServicios.length} servicios) 💆‍♀️
      </h1>

      <div style={{ display: "grid", gap: "16px" }}>
        {todosServicios.map((servicio) => (
          <div
            key={servicio.id}
            style={{
              border: "1px solid #f9a8d4",
              borderRadius: 12,
              padding: 20,
              backgroundColor: "#fff5f8",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: 16 }}>
                  <strong>{servicio.clientaNombre}</strong>
                </p>
                {servicio.telefono && (
                  <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                    📞 {servicio.telefono}
                  </p>
                )}
                <p style={{ margin: "4px 0", color: "#db2777", fontWeight: "600" }}>
                  {servicio.servicio}
                </p>
                <p style={{ margin: "4px 0", fontSize: 14 }}>
                  📅 {formatearFecha(servicio.fecha)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => window.location.href = `/clienta/${servicio.clientaId}`}
                  style={{
                    background: "linear-gradient(90deg, #f472b6, #db2777)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginBottom: "4px",
                  }}
                >
                  Ver ficha completa
                </button>
              </div>
            </div>

            {/* Detalles del servicio */}
            {servicio.detalle && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f9a8d4" }}>
                {servicio.detalle.tiempoTotal && (
                  <p style={{ margin: "4px 0" }}>
                    <strong>⏱️ Tiempo:</strong> {servicio.detalle.tiempoTotal} min
                  </p>
                )}
                {servicio.detalle.zonas && (
                  <p style={{ margin: "4px 0" }}>
                    <strong>📍 Zonas:</strong> {Array.isArray(servicio.detalle.zonas) ? servicio.detalle.zonas.join(", ") : servicio.detalle.zonas}
                  </p>
                )}
                {servicio.detalle.tecnica && (
                  <p style={{ margin: "4px 0" }}>
                    <strong>🔧 Técnica:</strong> {servicio.detalle.tecnica}
                  </p>
                )}
                {servicio.detalle.productos && (
                  <p style={{ margin: "4px 0" }}>
                    <strong>🧴 Productos:</strong> {servicio.detalle.productos}
                  </p>
                )}
                {servicio.detalle.escalaMolestia && (
                  <p style={{ margin: "4px 0" }}>
                    <strong>😬 Molestia:</strong> {servicio.detalle.escalaMolestia.antes} → {servicio.detalle.escalaMolestia.despues}
                  </p>
                )}
                {servicio.detalle.observaciones && (
                  <p style={{ margin: "8px 0 0 0", fontStyle: "italic", color: "#555" }}>
                    📝 {servicio.detalle.observaciones}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

