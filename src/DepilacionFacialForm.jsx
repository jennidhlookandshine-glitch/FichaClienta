import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

export default function DepilacionFacialForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);

  // Puede venir del flujo nuevo (nuevaFicha) o desde ficha existente (state.clienta)
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  const [form, setForm] = useState({
    zonas: [],
    tecnica: "",
    productos: "",
    tiempo: "",
    irritacionPrev: "",
    irritacionPost: "",
    observaciones: "",
  });

  const zonasOpciones = [
    "Cejas",
    "Bozo",
    "Mentón",
    "Mejillas",
    "Patillas",
    "Nariz",
    "Full face",
  ];

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Si no hay clienta válida, redirigir
  useEffect(() => {
    if (!clientaActiva || !clientaActiva.id) {
      navigate("/clientas");
    }
  }, [clientaActiva, navigate]);

  // Precargar datos si estamos editando un servicio existente
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        zonas: Array.isArray(d.zonas) ? d.zonas : d.zonas ? [d.zonas] : [],
        tecnica: d.tecnica || "",
        productos: d.productos || "",
        tiempo: d.tiempo || "",
        irritacionPrev: d.irritacionPrev || "",
        irritacionPost: d.irritacionPost || "",
        observaciones: d.observaciones || "",
      });
    }
  }, [modo, servicioEditar]);

  if (!clientaActiva || !clientaActiva.id) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleZonaChange = (zona) => {
    const nuevasZonas = form.zonas.includes(zona)
      ? form.zonas.filter((z) => z !== zona)
      : [...form.zonas, zona];
    setForm((p) => ({ ...p, zonas: nuevasZonas }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (form.zonas.length === 0) {
      setError("Selecciona al menos una zona.");
      toast.error("Selecciona al menos una zona.");
      return;
    }

    if (!form.tecnica) {
      setError("Selecciona la técnica utilizada.");
      toast.error("Selecciona la técnica utilizada.");
      return;
    }

    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar una clienta 😅");
      navigate("/clientas");
      return;
    }

    setError("");
    setGuardando(true);

    const servicio = {
      servicio: "Depilación facial",
      fecha:
        modo === "editar" && servicioEditar?.fecha
          ? servicioEditar.fecha
          : new Date().toISOString(),
      detalle: { ...form },
    };

    try {
      if (modo === "editar" && indexEditar !== null) {
        // Editar servicio existente
        await editarServicio(clientaActiva.id, indexEditar, servicio);
      } else {
        // Crear nuevo servicio
        await agregarServicio(clientaActiva.id, servicio);

        // Actualizar contexto solo si es la nueva ficha
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            depilacionFacial: form,
            servicioResumen: "Depilación facial",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Depilación facial actualizada ✨"
          : "Depilación facial guardada ✨"
      );

      // Si venías desde ficha existente, volver a la ficha; si no, ir al final
      if (clientaDesdeState) {
        navigate(`/ficha/${clientaActiva.id}`, {
          state: { clienta: clientaActiva },
        });
      } else {
        navigate("/ficha/final");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la depilación facial");
    } finally {
      setGuardando(false);
    }
  };

  const pageStyle = {
    backgroundColor: "#fde2e4",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    color: "#333",
  };
  const headerStyle = {
    background: "linear-gradient(90deg, #f9a8d4, #f472b6)",
    color: "white",
    padding: "24px 40px",
    borderRadius: "20px",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };
  const cardStyle = {
    background: "white",
    padding: "30px 40px",
    borderRadius: "16px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f9a8d4",
    marginTop: "6px",
    fontSize: "14px",
  };
  const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>
          Ficha de Depilación Facial ✨
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Registra zonas, técnica, productos y reacciones de la piel
        </p>
      </div>

      <form style={cardStyle} onSubmit={handleGuardar}>
        {error && (
          <p style={{ color: "red", textAlign: "center", fontWeight: 600 }}>
            {error}
          </p>
        )}

        {/* Zonas */}
        <label>
          Zonas depiladas:
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            {zonasOpciones.map((z) => (
              <label key={z} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={form.zonas.includes(z)}
                  onChange={() => handleZonaChange(z)}
                />{" "}
                {z}
              </label>
            ))}
          </div>
        </label>

        {/* Técnica */}
        <label>
          Técnica:
          <select
            name="tecnica"
            value={form.tecnica}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Selecciona</option>
            <option value="pinza">Pinza</option>
            <option value="cera">Cera</option>
            <option value="hilo">Hilo</option>
          </select>
        </label>

        {/* Productos */}
        <label>
          Productos utilizados:
          <input
            type="text"
            name="productos"
            value={form.productos}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Agua micelar, gel calmante, bloqueador, etc."
          />
        </label>

        {/* Tiempo */}
        <label>
          Tiempo total:
          <input
            type="text"
            name="tiempo"
            value={form.tiempo}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: 20 min"
          />
        </label>

        {/* Reacción antes */}
        <label>
          Estado de la piel antes:
          <input
            type="text"
            name="irritacionPrev"
            value={form.irritacionPrev}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: normal, sensible, brotes activos..."
          />
        </label>

        {/* Reacción después */}
        <label>
          Reacción posterior:
          <input
            type="text"
            name="irritacionPost"
            value={form.irritacionPost}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: leve enrojecimiento, sin novedad..."
          />
        </label>

        {/* Observaciones */}
        <label>
          Observaciones:
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows="3"
            style={{
              ...inputStyle,
              width: "100%",
              resize: "none",
              height: "80px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #f472b6, #db2777)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "12px 0",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            marginTop: "10px",
          }}
          disabled={guardando}
        >
          {guardando
            ? modo === "editar"
              ? "Actualizando ficha..."
              : "Guardando ficha..."
            : modo === "editar"
            ? "Actualizar ficha"
            : "Guardar ficha"}
        </button>
      </form>
    </div>
  );
}
