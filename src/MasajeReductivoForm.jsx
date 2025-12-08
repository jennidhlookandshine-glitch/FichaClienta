import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

export default function MasajeReductivoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);

  // Clienta puede venir del flujo nuevo (nuevaFicha) o desde ficha existente
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  const [form, setForm] = useState({
    zonas: [],
    tecnica: "manual",
    productos: "",
    tiempoTotal: "",
    medidasAntes: {
      cintura: "",
      cadera: "",
      muslos: "",
      brazos: "",
      peso: "",
      grasa: "",
      estatura: "",
    },
    medidasDespues: {
      cintura: "",
      cadera: "",
      muslos: "",
      brazos: "",
      peso: "",
      grasa: "",
      estatura: "",
    },
    observaciones: "",
  });

  const zonasOpciones = [
    "Abdomen",
    "Glúteo",
    "Muslos",
    "Brazos",
    "Espalda",
    "Piernas",
  ];

  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        zonas: Array.isArray(d.zonas) ? d.zonas : [],
        tecnica: d.tecnica || "manual",
        productos: d.productos || "",
        tiempoTotal: d.tiempoTotal || "",
        medidasAntes: d.medidasAntes || form.medidasAntes,
        medidasDespues: d.medidasDespues || form.medidasDespues,
        observaciones: d.observaciones || "",
      });
    }
  }, [modo, servicioEditar]);

  // Si no hay ninguna clienta válida, redirigir
  useEffect(() => {
    if (!clientaActiva || !clientaActiva.id) {
      navigate("/clientas");
    }
  }, [clientaActiva, navigate]);

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

  const handleMedidaChange = (e, tipo, campo) => {
    const { value } = e.target;
    setForm((p) => ({
      ...p,
      [tipo]: { ...p[tipo], [campo]: value },
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar una clienta 😅");
      navigate("/clientas");
      return;
    }

    setGuardando(true);

    const servicio = {
      servicio: "Masaje Reductivo",
      fecha:
        modo === "editar" && servicioEditar?.fecha
          ? servicioEditar.fecha
          : new Date().toISOString(),
      detalle: {
        zonas: form.zonas,
        tecnica: form.tecnica,
        productos: form.productos,
        tiempoTotal: form.tiempoTotal,
        medidasAntes: form.medidasAntes,
        medidasDespues: form.medidasDespues,
        observaciones: form.observaciones,
      },
    };

    try {
      if (modo === "editar" && indexEditar !== null) {
        // Editar servicio existente
        await editarServicio(clientaActiva.id, indexEditar, servicio);
      } else {
        // Crear nuevo servicio
        await agregarServicio(clientaActiva.id, servicio);

        // Actualizar contexto local si es la nueva ficha
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            masajeReductivo: form,
            servicioResumen: "Masaje Reductivo",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Masaje reductivo actualizado ✨"
          : "Masaje reductivo guardado ✨"
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
      toast.error("Error al guardar el masaje reductivo.");
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
          Ficha de Masaje Reductivo 💆‍♀️
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Registra zonas, técnicas, productos, tiempos y medidas comparativas
        </p>
      </div>

      <form style={cardStyle} onSubmit={handleGuardar}>
        {/* Zonas */}
        <label>
          Zonas a tratar:
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
            <option value="manual">Manual</option>
            <option value="aparatologia">Aparatología</option>
            <option value="maderoterapia">Maderoterapia</option>
          </select>
        </label>

        {/* Producto */}
        <label>
          Producto:
          <input
            type="text"
            name="productos"
            value={form.productos}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        {/* Tiempo */}
        <label>
          Tiempo total (min):
          <input
            type="number"
            min="10"
            max="180"
            name="tiempoTotal"
            value={form.tiempoTotal}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        {/* Medidas Antes */}
        <fieldset
          style={{
            border: "1px solid #f9a8d4",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <legend>Medidas Antes</legend>
          {Object.keys(form.medidasAntes).map((campo) => (
            <label key={campo} style={{ display: "block", marginBottom: "6px" }}>
              {campo.charAt(0).toUpperCase() + campo.slice(1)}:
              <input
                type={
                  ["peso", "grasa", "estatura"].includes(campo)
                    ? "number"
                    : "text"
                }
                value={form.medidasAntes[campo]}
                onChange={(e) =>
                  handleMedidaChange(e, "medidasAntes", campo)
                }
                style={inputStyle}
              />
            </label>
          ))}
        </fieldset>

        {/* Medidas Después */}
        <fieldset
          style={{
            border: "1px solid #f9a8d4",
            borderRadius: "10px",
            padding: "15px",
            marginTop: "10px",
          }}
        >
          <legend>Medidas Después</legend>
          {Object.keys(form.medidasDespues).map((campo) => (
            <label key={campo} style={{ display: "block", marginBottom: "6px" }}>
              {campo.charAt(0).toUpperCase() + campo.slice(1)}:
              <input
                type={
                  ["peso", "grasa", "estatura"].includes(campo)
                    ? "number"
                    : "text"
                }
                value={form.medidasDespues[campo]}
                onChange={(e) =>
                  handleMedidaChange(e, "medidasDespues", campo)
                }
                style={inputStyle}
              />
            </label>
          ))}
        </fieldset>

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

        {/* Botón Guardar */}
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #f472b6, #db2777)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "12px 0",
            fontSize: "16px",
            cursor: guardando ? "not-allowed" : "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            marginTop: "10px",
            opacity: guardando ? 0.8 : 1,
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

