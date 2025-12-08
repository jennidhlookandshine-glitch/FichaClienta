import React, { useState, useContext, useEffect } from "react";
import { ClientaContext } from "./ClientaContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function HydroglossLabiosForm() {
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Puede venir del flujo nuevo (nuevaFicha) o desde ficha existente (state.clienta)
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  // Si no hay ninguna clienta, redirigir
  useEffect(() => {
    if (!clientaActiva || !clientaActiva.id) {
      navigate("/clientas");
    }
  }, [clientaActiva, navigate]);

  if (!clientaActiva || !clientaActiva.id) return null;

  const [form, setForm] = useState({
    colorTono: "",
    tipoLabios: "",
    estadoInicial: "",
    estadoFinal: "",
    exfoliacion: false,
    ah: false,
    cartucho: "",
    gloss: false,
    mascarilla: false,
    sesiones: [],
    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        colorTono: d.colorTono || "",
        tipoLabios: d.tipoLabios || "",
        estadoInicial: d.estadoInicial || "",
        estadoFinal: d.estadoFinal || "",
        exfoliacion: !!d.exfoliacion,
        ah: !!d.ah,
        cartucho: d.cartucho || "",
        gloss: !!d.gloss,
        mascarilla: !!d.mascarilla,
        sesiones: Array.isArray(d.sesiones) ? d.sesiones : [],
        observaciones: d.observaciones || "",
      });
    }
  }, [modo, servicioEditar]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSesionChange(index) {
    const newSesiones = [...(form.sesiones || [])];
    newSesiones[index] = !newSesiones[index];
    setForm((p) => ({ ...p, sesiones: newSesiones }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar una clienta 😅");
      navigate("/clientas");
      return;
    }

    setGuardando(true);

    try {
      const servicio = {
        servicio: "Hydrogloss",
        fecha:
          modo === "editar" && servicioEditar?.fecha
            ? servicioEditar.fecha
            : new Date().toISOString(),
        detalle: { ...form },
      };

      if (modo === "editar" && indexEditar !== null) {
        // Editar servicio existente
        await editarServicio(clientaActiva.id, indexEditar, servicio);
      } else {
        // Crear servicio nuevo
        await agregarServicio(clientaActiva.id, servicio);

        // Si es la nueva ficha, actualizar contexto local
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            hydrogloss: form,
            servicioResumen: "Hydrogloss",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Hydrogloss actualizado correctamente ✨"
          : "Hydrogloss guardado correctamente ✨"
      );
      // Si venías desde ficha existente, vuelve a la ficha; si no, paso final
      if (clientaDesdeState) {
        navigate(`/ficha/${clientaActiva.id}`, {
          state: { clienta: clientaActiva },
        });
      } else {
        navigate("/ficha/final");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar Hydrogloss");
    } finally {
      setGuardando(false);
    }
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
  const checkboxStyle = { marginRight: "8px" };

  return (
    <div
      style={{
        backgroundColor: "#fde2e4",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #f9a8d4, #f472b6)",
          color: "white",
          padding: "24px 40px",
          borderRadius: "20px",
          textAlign: "center",
          marginBottom: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>
          Ficha de Hydrogloss 💋
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Registra productos, técnicas, sesiones y observaciones
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px 40px",
          borderRadius: "16px",
          maxWidth: "900px",
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 30px",
          }}
        >
          <label>
            Tipo de labios:
            <select
              name="tipoLabios"
              value={form.tipoLabios}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="resecos">Resecos</option>
              <option value="finos">Finos</option>
              <option value="gruesos">Gruesos</option>
              <option value="grietas">Con grietas</option>
            </select>
          </label>

          <label>
            Estado inicial:
            <input
              name="estadoInicial"
              value={form.estadoInicial}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Estado final:
            <input
              name="estadoFinal"
              value={form.estadoFinal}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <div
            style={{
              gridColumn: "1 / 3",
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <label>
              <input
                type="checkbox"
                name="exfoliacion"
                checked={form.exfoliacion}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Exfoliación
            </label>
            <label>
              <input
                type="checkbox"
                name="ah"
                checked={form.ah}
                onChange={handleChange}
                style={checkboxStyle}
              />
              AH
            </label>
            <label>
              <input
                type="checkbox"
                name="gloss"
                checked={form.gloss}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Gloss
            </label>
            <label>
              <input
                type="checkbox"
                name="mascarilla"
                checked={form.mascarilla}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Mascarilla labial
            </label>
          </div>

          <label>
            Cartucho:
            <select
              name="cartucho"
              value={form.cartucho}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="36">36</option>
              <option value="42">42</option>
              <option value="nano">Nano</option>
            </select>
          </label>

          <label>
            Color Tono:
            <select
              name="colorTono"
              value={form.colorTono}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="rosado">Rosado</option>
              <option value="rojo">Rojo</option>
              <option value="ninguno">Ninguno</option>
            </select>
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Sesiones:
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "5px",
              }}
            >
              {[...Array(10)].map((_, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={form.sesiones[i] || false}
                    onChange={() => handleSesionChange(i)}
                    style={checkboxStyle}
                  />
                  {i + 1}
                </label>
              ))}
            </div>
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Observaciones:
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "none",
                width: "100%",
                height: "80px",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={guardando}
            style={{
              gridColumn: "1 / 3",
              background: "linear-gradient(90deg, #f472b6, #db2777)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              padding: "12px 0",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
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
    </div>
  );
}






