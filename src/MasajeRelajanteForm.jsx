import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

export default function MasajeRelajanteForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);

  // Puede venir del flujo nuevo (nuevaFicha) o desde FichaClientaPage
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  const [form, setForm] = useState({
    zonas: "",
    tecnica: "relajante",
    productos: "",
    tiempoTotal: "",
    escalaMolestiaAntes: "",
    escalaMolestiaDespues: "",
    observaciones: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        zonas: d.zonas || "",
        tecnica: d.tecnica || "relajante",
        productos: d.productos || "",
        tiempoTotal: d.tiempoTotal || "",
        escalaMolestiaAntes: d.escalaMolestia?.antes || "",
        escalaMolestiaDespues: d.escalaMolestia?.despues || "",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (
      !form.zonas ||
      !form.tiempoTotal ||
      !form.escalaMolestiaAntes ||
      !form.escalaMolestiaDespues
    ) {
      setError("Por favor completa todos los campos obligatorios");
      toast.error("Faltan campos obligatorios en la ficha de masaje.");
      return;
    }

    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar o crear la clienta 😅");
      return;
    }

    setError("");
    setGuardando(true);

    const servicio = {
      servicio: "Masaje Relajante",
      fecha:
        modo === "editar" && servicioEditar?.fecha
          ? servicioEditar.fecha
          : new Date().toISOString(),
      detalle: {
        zonas: form.zonas,
        tecnica: form.tecnica,
        productos: form.productos,
        tiempoTotal: form.tiempoTotal,
        escalaMolestia: {
          antes: form.escalaMolestiaAntes,
          despues: form.escalaMolestiaDespues,
        },
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

        // Si la clienta viene de nuevaFicha, actualizamos también ese contexto
        if (nuevaFicha && nuevaFicha.id === clientaActiva.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            masajeRelajante: form,
            servicioResumen: "Masaje Relajante",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Masaje relajante actualizado ✨"
          : "Masaje relajante guardado ✨"
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
      console.error("❌ ERROR completo:", err);
      toast.error("Error al guardar la ficha de masaje.");
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

  const errorStyle = { color: "red", gridColumn: "1 / 3" };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>
          Ficha de Masaje Relajante 💆‍♀️
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Zonas, técnica, productos, tiempos y escala de molestia
        </p>
      </div>

      <form style={cardStyle} onSubmit={handleGuardar}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 30px",
          }}
        >
          {error && <div style={errorStyle}>{error}</div>}

          <label>
            Zonas:
            <select
              name="zonas"
              value={form.zonas}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="medio cuerpo">Medio cuerpo</option>
              <option value="cuerpo completo">Cuerpo completo</option>
            </select>
          </label>

          <label>
            Técnica:
            <select
              name="tecnica"
              value={form.tecnica}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="relajante">Relajante</option>
              <option value="descontracturante">Descontracturante</option>
              <option value="mixto">Mixto</option>
            </select>
          </label>

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

          <label>
            Escala de molestia antes (0-10):
            <input
              type="number"
              min="0"
              max="10"
              name="escalaMolestiaAntes"
              value={form.escalaMolestiaAntes}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Escala de molestia después (0-10):
            <input
              type="number"
              min="0"
              max="10"
              name="escalaMolestiaDespues"
              value={form.escalaMolestiaDespues}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Observaciones:
            <textarea
              name="observaciones"
              rows="3"
              value={form.observaciones}
              onChange={handleChange}
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
              gridColumn: "1 / 3",
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
        </div>
      </form>
    </div>
  );
}

