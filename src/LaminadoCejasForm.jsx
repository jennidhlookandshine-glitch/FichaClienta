import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

export default function LaminadoCejasForm() {
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

  // Si no hay ninguna clienta, redirigir
  useEffect(() => {
    if (!clientaActiva || !clientaActiva.id) {
      navigate("/clientas");
    }
  }, [clientaActiva, navigate]);

  if (!clientaActiva || !clientaActiva.id) {
    return null;
  }

  const [form, setForm] = useState({
    evaluacion: "",
    limpieza: "",
    laminarMarca: "",
    tiemposPaso1: "",
    tiemposPaso2: "",
    neutralizado: "",
    hennaMarca: "",
    tonoHenna: "",
    tiempoHenna: "",
    mapeo: "",
    cuidados: "",
    contraindicaciones: "",
    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Precargar si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        evaluacion: d.evaluacion || "",
        limpieza: d.limpieza || "",
        laminarMarca: d.laminarMarca || "",
        tiemposPaso1: d.tiemposPaso1 || "",
        tiemposPaso2: d.tiemposPaso2 || "",
        neutralizado: d.neutralizado || "",
        hennaMarca: d.hennaMarca || "",
        tonoHenna: d.tonoHenna || "",
        tiempoHenna: d.tiempoHenna || "",
        mapeo: d.mapeo || "",
        cuidados: d.cuidados || "",
        contraindicaciones: d.contraindicaciones || "",
        observaciones: d.observaciones || "",
      });
    }
  }, [modo, servicioEditar]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGuardar() {
    if (!form.laminarMarca || !form.neutralizado) {
      setError("Selecciona las marcas de paso 1 y neutralizador.");
      toast.error("Faltan las marcas de paso 1 y neutralizador.");
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
      servicio: "Laminado de Cejas",
      fecha:
        modo === "editar" && servicioEditar?.fecha
          ? servicioEditar.fecha
          : new Date().toISOString(),
      detalle: {
        ...form,
      },
    };

    try {
      if (modo === "editar" && indexEditar !== null) {
        // Editar servicio existente
        await editarServicio(clientaActiva.id, indexEditar, servicio);
      } else {
        // Crear servicio nuevo
        await agregarServicio(clientaActiva.id, servicio);

        // Actualizar contexto local si es la nueva ficha
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            laminadoCejas: form,
            servicioResumen: "Laminado de Cejas",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Laminado de cejas actualizado ✨"
          : "Laminado de cejas guardado ✨"
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
      toast.error("Error al guardar la ficha de laminado.");
    } finally {
      setGuardando(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f9a8d4",
    marginTop: "6px",
    fontSize: "14px",
    background: "white",
  };

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
          Laminado de Cejas 💖
        </h1>
        <p
          style={{
            marginTop: "8px",
            fontSize: "16px",
            opacity: 0.95,
          }}
        >
          Registra detalles del servicio y resultados
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
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            color: "#db2777",
            textAlign: "center",
          }}
        >
          Detalles del servicio
        </h2>

        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 30px",
          }}
        >
          <label>
            Tipo de ceja:
            <select
              name="evaluacion"
              value={form.evaluacion}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecciona...</option>
              <option value="poblada">Poblada</option>
              <option value="fina">Fina</option>
              <option value="mixta">Mixta</option>
              <option value="con huecos">Con huecos</option>
            </select>
          </label>

          <label>
            Limpieza previa:
            <select
              name="limpieza"
              value={form.limpieza}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecciona...</option>
              <option value="agua micelar">Agua micelar</option>
              <option value="espuma">Espuma</option>
              <option value="gel">Gel limpiador</option>
            </select>
          </label>

          {/* Producto paso 1 */}
          <label>
            Producto paso 1:
            <select
              name="laminarMarca"
              value={form.laminarMarca}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecciona...</option>
              <option value="DLUX">DLUX</option>
              <option value="Maximova">Maximova</option>
              <option value="Beauty Wave">Beauty Wave</option>
            </select>
          </label>

          <label>
            Tiempo (paso 1):
            <input
              type="text"
              name="tiemposPaso1"
              value={form.tiemposPaso1}
              onChange={handleChange}
              placeholder="Ej: 10 min"
              style={inputStyle}
            />
          </label>

          {/* Producto paso 2 */}
          <label>
            Producto paso 2 (neutralizador):
            <select
              name="neutralizado"
              value={form.neutralizado}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecciona...</option>
              <option value="DLUX">DLUX</option>
              <option value="Maximova">Maximova</option>
              <option value="Beauty Wave">Beauty Wave</option>
            </select>
          </label>

          <label>
            Tiempo (paso 2):
            <input
              type="text"
              name="tiemposPaso2"
              value={form.tiemposPaso2}
              onChange={handleChange}
              placeholder="Ej: 8 min"
              style={inputStyle}
            />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Mapeo:
            <input
              name="mapeo"
              value={form.mapeo}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ej: lifting suave, peinado hacia arriba..."
            />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Cuidados:
            <textarea
              name="cuidados"
              value={form.cuidados}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "none", height: 80 }}
              placeholder="Indicaciones para la clienta (no mojar, no maquillaje, etc.)"
            />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Resultado / observaciones:
            <textarea
              name="observaciones"
              rows={3}
              placeholder="Escribe tus observaciones..."
              style={{ ...inputStyle, resize: "none", height: 100 }}
              value={form.observaciones}
              onChange={handleChange}
            />
          </label>

          <button
            type="button"
            onClick={handleGuardar}
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
              fontWeight: 600,
              opacity: guardando ? 0.8 : 1,
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

