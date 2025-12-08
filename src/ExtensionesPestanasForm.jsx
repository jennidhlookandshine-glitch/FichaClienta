import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import MapaExtensiones from "./MapaExtensiones";
import toast from "react-hot-toast";

export default function ExtensionesForm() {
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

  if (!clientaActiva || !clientaActiva.id) return null;

  const [form, setForm] = useState({
    tecnica: "",
    efecto: "",
    curvatura: "",
    diametro: "",
    longitudes: "",
    mapping: "",
    densidad: "",
    adhesive: "",
    observaciones: "",
    mapaExtensiones: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        tecnica: d.tecnica || "",
        efecto: d.efecto || "",
        curvatura: d.curvatura || "",
        diametro: d.diametro || "",
        longitudes: d.longitudes || "",
        mapping: d.mapping || "",
        densidad: d.densidad || "",
        adhesive: d.adhesive || "",
        observaciones: d.observaciones || "",
        mapaExtensiones: d.mapaExtensiones || "",
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

  const handleGuardar = async () => {
    if (!form.tecnica) {
      setError("Selecciona la técnica");
      toast.error("Selecciona la técnica de extensiones.");
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
      servicio: "Extensiones de pestañas",
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

        // Si es la nueva ficha, actualizar contexto local
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            extensiones: form,
            servicioResumen: "Extensiones de pestañas",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Ficha de extensiones actualizada ✨"
          : "Ficha de extensiones guardada ✨"
      );

      // Si venías desde una ficha existente, volver a la ficha; si no, ir al final
      if (clientaDesdeState) {
        navigate(`/ficha/${clientaActiva.id}`, {
          state: { clienta: clientaActiva },
        });
      } else {
        navigate("/ficha/final");
      }
    } catch (err) {
      console.error(err);
      setError("Error al guardar la ficha. Intenta nuevamente.");
      toast.error("Error al guardar la ficha de extensiones.");
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
  const botonGuardar = {
    gridColumn: "1 / 3",
    background: "linear-gradient(90deg, #f472b6, #db2777)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    padding: "12px 0",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
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
          Ficha de Extensiones de Pestañas 👁️
        </h1>
        <p
          style={{
            marginTop: "8px",
            fontSize: "16px",
            opacity: 0.95,
          }}
        >
          Registra los detalles técnicos y resultados del servicio
        </p>
      </div>

      {error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {error}
        </p>
      )}

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
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 30px",
          }}
        >
          <label>
            Técnica:
            <select
              name="tecnica"
              value={form.tecnica}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona</option>
              <option>Clásica</option>
              <option>Volumen ruso</option>
              <option>Volumen americano</option>
              <option>Mega volumen</option>
            </select>
          </label>

          <label>
            Efecto:
            <select
              name="efecto"
              value={form.efecto}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona</option>
              <option>Natural</option>
              <option>Cat Eye</option>
              <option>Open Eye</option>
              <option>Foxi</option>
              <option>Wispy</option>
              <option>Mojado</option>
            </select>
          </label>

          <label>
            Curvatura:
            <select
              name="curvatura"
              value={form.curvatura}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona</option>
              <option>C</option>
              <option>CC</option>
              <option>D</option>
              <option>L</option>
            </select>
          </label>

          <label>
            Diámetro:
            <select
              name="diametro"
              value={form.diametro}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona</option>
              {Array.from({ length: 11 }, (_, i) => 0.1 + i * 0.01).map(
                (d) => (
                  <option key={d}>{d.toFixed(2)}</option>
                )
              )}
            </select>
          </label>

          <label>
            Longitudes:
            <input
              type="text"
              name="longitudes"
              value={form.longitudes}
              onChange={handleChange}
              placeholder="Ej: 8-12 mm"
              style={inputStyle}
            />
          </label>

          <label>
            Mapping / Picos:
            <input
              type="text"
              name="mapping"
              value={form.mapping}
              onChange={handleChange}
              placeholder="Ej: 8-9-10-11-12"
              style={inputStyle}
            />
          </label>

          <label>
            Densidad:
            <select
              name="densidad"
              value={form.densidad}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona</option>
              <option>Ligera</option>
              <option>Media</option>
              <option>Densa</option>
            </select>
          </label>

          <label>
            Adhesivo:
            <input
              type="text"
              name="adhesive"
              value={form.adhesive}
              onChange={handleChange}
              placeholder="Nombre o marca"
              style={inputStyle}
            />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Observaciones:
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows="3"
              placeholder="Notas, alergias o recomendaciones..."
              style={{
                ...inputStyle,
                resize: "none",
                width: "100%",
                height: "100px",
              }}
            />
          </label>

          <div style={{ gridColumn: "1 / 3", marginTop: "20px" }}>
            <h3 className="text-pink-600 font-semibold mb-2">
              Mapa de extensiones
            </h3>
            <MapaExtensiones
              onGuardar={(dataUrl) =>
                setForm((prev) => ({ ...prev, mapaExtensiones: dataUrl }))
              }
            />
          </div>

          <button
            type="button"
            onClick={handleGuardar}
            style={botonGuardar}
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
    </div>
  );
}
