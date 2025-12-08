// FichaClientaPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useClienta } from "./ClientaContext";
import FichaAppLayout from "./FichaAppLayout";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

export default function FichaClientaPage() {
  const { id } = useParams();
  const { clientas, obtenerClientaPorId, eliminarServicio } = useClienta();
  const navigate = useNavigate();
  const location = useLocation();
  const [guardando, setGuardando] = useState(false);
  const [clienta, setClienta] = useState(null);

  const clientaDesdeState = location.state?.clienta || null;

  useEffect(() => {
    if (!id && !clientaDesdeState) {
      setClienta(null);
      return;
    }

    let clientaEncontrada =
      clientas.find((c) => String(c.id) === String(id)) ||
      obtenerClientaPorId?.(id) ||
      clientaDesdeState;

    if (clientaEncontrada) {
      setClienta(clientaEncontrada);
    } else {
      setClienta(null);
    }
  }, [id, clientas, clientaDesdeState, obtenerClientaPorId]);

  if (!clienta) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins",
          color: "#e91e63",
          fontWeight: 600,
          padding: 24,
          textAlign: "center",
        }}
      >
        No se encontró la clienta.{" "}
        <button
          onClick={() => navigate("/clientas")}
          style={{
            marginLeft: 8,
            background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Volver a clientas
        </button>
      </div>
    );
  }

  const medicos = {
    embarazadaLactancia: clienta.embarazadaLactancia,
    alergias: clienta.alergia,
    medicamentos: clienta.medicamentos,
    cirugias: clienta.cirugias,
    enfermedadPiel: clienta.enfermedadPiel,
    retinolAcidos: clienta.retinolAcidos,
    reacciones: clienta.reacciones,
    lentesContacto: clienta.lentesContacto,
    observaciones: clienta.observaciones,
    notas: clienta.notas,
  };

  function handleAgregarServicio() {
    navigate("/seleccionar-servicio", { state: { clienta } });
  }

  function handleEditarDatos() {
    navigate("/editar-clienta", { state: { clienta } });
  }

  const subirFotoAFirebase = async (file, nombreCarpeta = "servicios") => {
    if (!file) return null;
    setGuardando(true);
    try {
      const storageRef = ref(
        storage,
        `${nombreCarpeta}/${clienta.id}-${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setGuardando(false);
      return url;
    } catch (error) {
      setGuardando(false);
      console.error("Error subiendo foto:", error);
      return null;
    }
  };

  const formatearFechaServicio = (fecha) => {
    if (!fecha) return "";
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString("es-CL");
    }
    if (fecha.seconds) {
      return new Date(fecha.seconds * 1000).toLocaleDateString("es-CL");
    }
    return String(fecha);
  };

  // === RENDER DETALLE SEGÚN TIPO DE SERVICIO ===
  const renderDetalleServicio = (s) => {
    const d = s.detalle || {};

    switch (s.servicio) {
      case "Limpieza Facial":
        return (
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Tipo de piel:</strong> {d.tipoPiel || "—"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Tiempo total:</strong>{" "}
              {d.tiempoTotal ? `${d.tiempoTotal} min` : "—"}
            </p>
            {d.evaluacion && (
              <p style={{ margin: "4px 0" }}>
                <strong>Evaluación:</strong> {d.evaluacion}
              </p>
            )}
            {d.protocolo && (
              <p style={{ margin: "4px 0" }}>
                <strong>Protocolo:</strong> {d.protocolo}
              </p>
            )}
            {d.productos && (
              <p style={{ margin: "4px 0" }}>
                <strong>Productos:</strong> {d.productos}
              </p>
            )}
            {d.contraindicaciones && (
              <p style={{ margin: "4px 0" }}>
                <strong>Contraindicaciones:</strong> {d.contraindicaciones}
              </p>
            )}
            {d.observaciones && (
              <p
                style={{
                  margin: "8px 0",
                  fontStyle: "italic",
                  color: "#666",
                }}
              >
                {d.observaciones}
              </p>
            )}
          </div>
        );

      case "Masaje Reductivo":
        return (
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Zonas:</strong>{" "}
              {Array.isArray(d.zonas) && d.zonas.length > 0
                ? d.zonas.join(", ")
                : "—"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Técnica:</strong> {d.tecnica || "—"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Productos:</strong> {d.productos || "—"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Tiempo total:</strong>{" "}
              {d.tiempoTotal ? `${d.tiempoTotal} min` : "—"}
            </p>

            {(d.medidasAntes || d.medidasDespues) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <div>
                  <strong>Medidas antes:</strong>
                  <div style={{ fontSize: 13 }}>
                    {Object.entries(d.medidasAntes || {}).map(
                      ([k, v]) =>
                        v && (
                          <div key={k}>
                            {k.charAt(0).toUpperCase() + k.slice(1)}: {v}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div>
                  <strong>Medidas después:</strong>
                  <div style={{ fontSize: 13 }}>
                    {Object.entries(d.medidasDespues || {}).map(
                      ([k, v]) =>
                        v && (
                          <div key={k}>
                            {k.charAt(0).toUpperCase() + k.slice(1)}: {v}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}

            {d.observaciones && (
              <p
                style={{
                  margin: "8px 0",
                  fontStyle: "italic",
                  color: "#666",
                }}
              >
                {d.observaciones}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {Object.keys(d).length === 0 ? (
              <p style={{ margin: 0, color: "#888" }}>Sin detalles registrados.</p>
            ) : (
              Object.entries(d).map(([k, v]) =>
                v ? (
                  <p key={k} style={{ margin: "4px 0" }}>
                    <strong>
                      {k.charAt(0).toUpperCase() + k.slice(1)}:
                    </strong>{" "}
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </p>
                ) : null
              )
            )}
          </div>
        );
    }
  };

  return (
    <FichaAppLayout currentServicio={null} showServicios={false} modo="clientas">
      <div style={{ padding: 16, fontSize: 16, maxWidth: 900, margin: "0 auto" }}>
        {/* INFORMACIÓN GENERAL */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ad1457",
                margin: 0,
              }}
            >
              Información General
            </h2>
            <button
              onClick={handleEditarDatos}
              style={{
                background: "linear-gradient(90deg, #f9a8d4, #e879f9)",
                border: "none",
                borderRadius: 24,
                padding: "8px 16px",
                fontSize: 13,
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(233,30,99,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(233,30,99,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(233,30,99,0.3)";
              }}
            >
              ✏️ Editar datos
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Nombre completo:</strong>{" "}
              <span style={{ color: "#db2777" }}>
                {clienta.nombreCompleto || "—"}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <strong>Fecha de nacimiento:</strong>{" "}
              {clienta.fechaNacimiento || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Teléfono:</strong> {clienta.telefono || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Fecha atención:</strong> {clienta.fechaAtencion || "—"}
            </p>
          </div>
        </div>

        {/* DATOS MÉDICOS */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ad1457",
              marginBottom: 16,
            }}
          >
            Datos Médicos Relevantes 🩺
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 12,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>¿Embarazada o en lactancia?</strong>{" "}
              {medicos.embarazadaLactancia || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>¿Presenta alergias?</strong> {medicos.alergias || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>¿Toma medicamentos?</strong>{" "}
              {medicos.medicamentos || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Cirugías recientes:</strong> {medicos.cirugias || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Enfermedad de la piel:</strong>{" "}
              {medicos.enfermedadPiel || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Retinol/Ácidos:</strong> {medicos.retinolAcidos || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Reacciones previas:</strong>{" "}
              {medicos.reacciones || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Lentes de contacto:</strong>{" "}
              {medicos.lentesContacto || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Observaciones:</strong>{" "}
              {medicos.observaciones || "—"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Notas importantes:</strong> {medicos.notas || "—"}
            </p>
          </div>
        </div>

        {/* SERVICIOS REALIZADOS */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(249,168,212,0.3))",
            padding: 20,
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(244,143,177,0.4)",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ad1457",
              marginBottom: 20,
            }}
          >
            Servicios Realizados ✨ ({clienta.servicios?.length || 0})
          </h2>

          {clienta.servicios && clienta.servicios.length > 0 ? (
            <ul
              style={{
                paddingLeft: 0,
                listStyle: "none",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {clienta.servicios.map((s, i) => {
                const fechaTexto = formatearFechaServicio(s.fecha);
                return (
                  <li
                    key={i}
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid #e879f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <strong
                          style={{ color: "#db2777", fontSize: 16 }}
                        >
                          {s.servicio}
                        </strong>
                        {fechaTexto && (
                          <span
                            style={{
                              color: "#666",
                              fontSize: 14,
                              marginLeft: 8,
                            }}
                          >
                            — {fechaTexto}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{
                            background:
                              "linear-gradient(90deg, #e879f9, #db2777)",
                            border: "none",
                            borderRadius: 20,
                            padding: "6px 12px",
                            fontSize: 12,
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: 600,
                            boxShadow: "0 2px 8px rgba(233,30,99,0.3)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(233,30,99,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 2px 8px rgba(233,30,99,0.3)";
                          }}
                          onClick={() =>
                            navigate("/editar-servicio", {
                              state: { clienta, servicio: s, index: i },
                            })
                          }
                        >
                          ✏️ Editar
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            const ok = window.confirm(
                              "¿Eliminar este servicio?"
                            );
                            if (!ok) return;
                            await eliminarServicio(clienta.id, i);
                          }}
                          style={{
                            background:
                              "linear-gradient(90deg, #fb7185, #ef4444)",
                            border: "none",
                            borderRadius: 20,
                            padding: "6px 10px",
                            fontSize: 12,
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: 700,
                            boxShadow: "0 2px 8px rgba(248,113,113,0.4)",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {s.detalle && renderDetalleServicio(s)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              <p style={{ fontSize: 18, marginBottom: 16 }}>
                📋 No hay servicios registrados aún
              </p>
              <p>Registra el primer servicio para esta clienta</p>
            </div>
          )}

          <button
            onClick={handleAgregarServicio}
            disabled={guardando}
            style={{
              marginTop: "24px",
              background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: guardando ? "not-allowed" : "pointer",
              width: "100%",
              boxShadow: "0 8px 24px rgba(233,30,99,0.3)",
              transition: "all 0.2s",
            }}
          >
            {guardando ? "⏳ Procesando..." : "➕ Agregar nuevo servicio"}
          </button>
        </div>
      </div>
    </FichaAppLayout>
  );
}


