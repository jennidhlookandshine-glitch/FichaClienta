import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

export default function LimpiezaFacialForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);

  // Puede venir del flujo nuevo (nuevaFicha) o desde ficha existente
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  const [form, setForm] = useState({
    tipoPiel: "",
    evaluacion: "",
    protocolo: "",
    productos: "",
    contraindicaciones: "",
    tiempoTotal: "",
    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        tipoPiel: d.tipoPiel || "",
        evaluacion: d.evaluacion || "",
        protocolo: d.protocolo || "",
        productos: d.productos || "",
        contraindicaciones: d.contraindicaciones || "",
        tiempoTotal: d.tiempoTotal || "",
        observaciones: d.observaciones || "",
      });
    }
  }, [modo, servicioEditar]);

  // Si no hay clienta, redirigir
  useEffect(() => {
    if (!clientaActiva || !clientaActiva.id) {
      navigate("/clientas");
    }
  }, [clientaActiva, navigate]);

  if (!clientaActiva || !clientaActiva.id) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar una clienta 😅");
      navigate("/clientas");
      return;
    }

    setGuardando(true);

    const servicio = {
      servicio: "Limpieza Facial",
      fecha:
        modo === "editar" && servicioEditar?.fecha
          ? servicioEditar.fecha
          : new Date().toISOString(),
      detalle: {
        tipoPiel: form.tipoPiel,
        tiempoTotal: form.tiempoTotal,
        evaluacion: form.evaluacion,
        protocolo: form.protocolo,
        productos: form.productos,
        contraindicaciones: form.contraindicaciones,
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

        // Si es la nueva ficha, actualizar contexto local
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            limpieza: form,
            servicioResumen: "Limpieza Facial",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Limpieza facial actualizada ✨"
          : "Limpieza facial guardada ✨"
      );

      // Si venías desde ficha existente, vuelve a la ficha; si no, paso final
      if (clientaDesdeState) {
        navigate(`/ficha/${clientaActiva.id}`, {
          state: { clienta: clientaActiva },
        });
      } else {
        navigate("/ficha/final");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la ficha de limpieza.");
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
    padding: "25px 20px",
    borderRadius: "20px",
    textAlign: "center",
    marginBottom: "30px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  };
  const cardStyle = {
    background: "white",
    padding: "25px 30px",
    borderRadius: "16px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };
  const sectionStyle = {
    border: "1px solid #f9a8d4",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#fff5f8",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f9a8d4",
    fontSize: "14px",
  };
  const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };
  const textareaStyle = { ...inputStyle, resize: "none", minHeight: "60px" };
  const buttonStyle = {
    background: "linear-gradient(90deg, #f472b6, #db2777)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    padding: "12px 0",
    fontSize: "16px",
    fontWeight: 600,
    cursor: guardando ? "not-allowed" : "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    opacity: guardando ? 0.8 : 1,
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: 700 }}>
          Limpieza Facial 💆‍♀️
        </h1>
        <p
          style={{
            marginTop: "8px",
            fontSize: "16px",
            opacity: 0.95,
          }}
        >
          Registro de evaluación, protocolo y resultados
        </p>
      </div>

      <div style={cardStyle}>
        <div style={sectionStyle}>
          <label>
            Tipo de piel:
            <select
              name="tipoPiel"
              value={form.tipoPiel}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="seca">Seca</option>
              <option value="mixta">Mixta</option>
              <option value="grasa">Grasa</option>
              <option value="sensible">Sensible</option>
            </select>
          </label>

          <label>
            Tiempo total (min):
            <input
              type="number"
              name="tiempoTotal"
              value={form.tiempoTotal}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        <div style={sectionStyle}>
          <label>
            Evaluación:
            <textarea
              name="evaluacion"
              value={form.evaluacion}
              onChange={handleChange}
              style={textareaStyle}
            />
          </label>
        </div>

        <div style={sectionStyle}>
          <label>
            Protocolo aplicado:
            <textarea
              name="protocolo"
              value={form.protocolo}
              onChange={handleChange}
              style={textareaStyle}
            />
          </label>
        </div>

        <div style={sectionStyle}>
          <label>
            Productos utilizados:
            <textarea
              name="productos"
              value={form.productos}
              onChange={handleChange}
              style={textareaStyle}
            />
          </label>
          <label>
            Contraindicaciones:
            <textarea
              name="contraindicaciones"
              value={form.contraindicaciones}
              onChange={handleChange}
              style={textareaStyle}
            />
          </label>
        </div>

        <div style={sectionStyle}>
          <label>
            Observaciones:
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              style={textareaStyle}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleGuardar}
          style={buttonStyle}
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
      </div>
    </div>
  );
}

