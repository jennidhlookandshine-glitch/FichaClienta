import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import toast from "react-hot-toast";

// Estilos para inputs y selects
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #f9a8d4",
  fontSize: "14px",
  boxSizing: "border-box",
};

const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };

export default function LiftingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nuevaFicha,
    setNuevaFicha,
    agregarServicio,
    editarServicio,
  } = useContext(ClientaContext);

  // Puede venir del flujo nuevo (nuevaFicha) o desde la ficha existente
  const clientaDesdeState = location.state?.clienta || null;
  const servicioEditar = location.state?.servicio || null;
  const indexEditar = location.state?.index ?? null;
  const modo = location.state?.modo || "crear";

  const clientaActiva = clientaDesdeState || nuevaFicha;

  const [form, setForm] = useState({
  tipoOjo: "",
  tamanoPestanas: "",
  tipoMolde: "",
  moldeModelo: "",
  moldeOtro: "",      // 👈 nuevo
  productoPaso1: "",
  tiempoPaso1: "",
  productoPaso2: "",
  tiempoPaso2: "",
  tinte: "",
  tiempoTotal: "",
  observaciones: "",
});


  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Precargar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && servicioEditar?.detalle) {
      const d = servicioEditar.detalle;
      setForm({
        tipoOjo: d.tipoOjo || "",
        tamanoPestanas: d.tamanoPestanas || "",
        tipoMolde: d.tipoMolde || "",
        moldeOtro: d.moldeOtro || "",
        moldeModelo: d.moldeModelo || d.moldeTalla || "",
        productoPaso1: d.productoPaso1 || "",
        tiempoPaso1: d.tiempoPaso1 || "",
        productoPaso2: d.productoPaso2 || "",
        tiempoPaso2: d.tiempoPaso2 || "",
        tinte: d.tinte || "",
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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTinteChange(e) {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      tinte: value,
    }));
  }

  // Guardar servicio de Lifting
  const handleGuardar = async () => {
    if (!clientaActiva || !clientaActiva.id) {
      toast.error("Primero debes seleccionar una clienta 😅");
      navigate("/clientas");
      return;
    }

    if (
      !form.tipoOjo ||
      !form.productoPaso1 ||
      !form.tipoMolde ||
      !form.moldeModelo
    ) {
      setError(
        "Completa al menos tipo de ojo, tipo de molde, modelo de molde y producto del paso 1."
      );
      toast.error("Faltan datos importantes del lifting");
      return;
    }

    setError("");
    setGuardando(true);

    const servicio = {
      servicio: "Lifting de pestañas",
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
        // Crear nuevo servicio
        await agregarServicio(clientaActiva.id, servicio);

        // Si la clienta activa es la nueva ficha, actualiza su contexto local
        if (nuevaFicha && clientaActiva.id === nuevaFicha.id) {
          setNuevaFicha((prev) => ({
            ...prev,
            servicios: [...(prev?.servicios || []), servicio],
            lifting: form,
            servicioResumen: "Lifting de pestañas",
          }));
        }
      }

      toast.success(
        modo === "editar"
          ? "Lifting actualizado correctamente ✨"
          : "Lifting guardado correctamente ✨"
      );

      // Si venías desde una ficha existente, vuelve a la ficha; si no, paso final
      if (clientaDesdeState) {
        navigate(`/ficha/${clientaActiva.id}`, {
          state: { clienta: clientaActiva },
        });
      } else {
        navigate("/ficha/final");
      }
    } catch (err) {
      console.error("❌ ERROR al guardar lifting:", err);
      toast.error("Ocurrió un error al guardar el lifting");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffe4ec",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      }}
    >
      {/* Cabecera rosa */}
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto 40px",
          textAlign: "center",
          color: "white",
          padding: "24px 0",
          background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
        }}
      >
        <h1>Ficha de Lifting de Pestañas 💖</h1>
        <p>Registra los productos, moldes y observaciones del servicio</p>
      </div>

      {/* Tarjeta blanca */}
      <div
        style={{
          background: "white",
          padding: "30px 40px 40px",
          borderRadius: "16px",
          maxWidth: "900px",
          margin: "0 auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
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
            gap: 20,
            alignItems: "center",
          }}
        >
          {/* Tipo de ojo */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Tipo de ojo:
            </label>
            <select
              style={{ ...selectStyle, marginTop: 4 }}
              name="tipoOjo"
              value={form.tipoOjo}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="redondo">Redondo</option>
              <option value="almendrado">Almendrado</option>
              <option value="asiatico">Asiático</option>
              <option value="profundo">Profundo</option>
              <option value="prominente">caido</option>
            </select>
          </div>

          {/* Tamaño pestañas */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Tamaño de pestañas:
            </label>
            <select
              style={{ ...selectStyle, marginTop: 4 }}
              name="tamanoPestanas"
              value={form.tamanoPestanas}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="corto">Corto</option>
              <option value="medio">Medio</option>
              <option value="largo">Largo</option>
            </select>
          </div>

          {/* Tipo de molde */}
<div>
  <label style={{ fontSize: 13, fontWeight: 500 }}>
    Tipo de molde:
  </label>
  <select
    style={{ ...selectStyle, marginTop: 4 }}
    name="tipoMolde"
    value={form.tipoMolde}
    onChange={handleChange}
  >
    <option value="">Selecciona...</option>
    <option value="Frozen">Frozen</option>
    <option value="Nube">Nube</option>
    <option value="Plano">Plano</option>
    <option value="Anatomico">Anatómico / redondo</option>
    <option value="Otro">Otro</option>
  </select>

  {form.tipoMolde === "Otro" && (
    <input
      style={{ ...inputStyle, marginTop: 8 }}
      name="moldeOtro"
      placeholder="Especifica el molde (ej: Molde nube glitter S)"
      value={form.moldeOtro}
      onChange={handleChange}
    />
  )}
</div>


          {/* Modelo / talla de molde */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Modelo / talla del molde:
            </label>
            <select
              style={{ ...selectStyle, marginTop: 4 }}
              name="moldeModelo"
              value={form.moldeModelo}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              {/* tallas típicas Frozen / Nube */}
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="S+">S+</option>
              <option value="M">M</option>
              <option value="M+">M+</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              {/* modelos planos / anatómicos */}
              <option value="S1">S1</option>
              <option value="M1">M1</option>
              <option value="L1">L1</option>
              <option value="XL1">XL1</option>
            </select>
          </div>

          {/* Producto paso 1 */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Producto paso 1:
            </label>
            <select
              style={{ ...selectStyle, marginTop: 4 }}
              name="productoPaso1"
              value={form.productoPaso1}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="DLUX">DLUX</option>
              <option value="Maximova">Maximova</option>
              <option value="Beauty Wave">Beauty Wave</option>
              <option value="My Lamination">My Lamination</option>
            </select>
          </div>

          {/* Tiempo paso 1 */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Tiempo (paso 1):
            </label>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              name="tiempoPaso1"
              placeholder="Ej: 10 min"
              value={form.tiempoPaso1}
              onChange={handleChange}
            />
          </div>

          {/* Producto paso 2 */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Producto paso 2:
            </label>
            <select
              style={{ ...selectStyle, marginTop: 4 }}
              name="productoPaso2"
              value={form.productoPaso2}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="DLUX">DLUX</option>
              <option value="Maximova">Maximova</option>
              <option value="Beauty Wave">Beauty Wave</option>
              <option value="My Lamination">My Lamination</option>
            </select>
          </div>

          {/* Tiempo paso 2 */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Tiempo (paso 2):
            </label>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              name="tiempoPaso2"
              placeholder="Ej: 8 min"
              value={form.tiempoPaso2}
              onChange={handleChange}
            />
          </div>

          {/* Tinte */}
          <div style={{ gridColumn: "1 / 3", textAlign: "center" }}>
            <label
              style={{ fontSize: 13, fontWeight: 500, display: "block" }}
            >
              ¿Se utilizó tinte?
            </label>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <label style={{ fontSize: 13 }}>
                <input
                  type="radio"
                  name="tinte"
                  value="si"
                  checked={form.tinte === "si"}
                  onChange={handleTinteChange}
                  style={{ marginRight: 4 }}
                />
                Sí
              </label>
              <label style={{ fontSize: 13 }}>
                <input
                  type="radio"
                  name="tinte"
                  value="no"
                  checked={form.tinte === "no"}
                  onChange={handleTinteChange}
                  style={{ marginRight: 4 }}
                />
                No
              </label>
            </div>
          </div>

          {/* Tiempo total */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Tiempo total (min):
            </label>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              name="tiempoTotal"
              value={form.tiempoTotal}
              onChange={handleChange}
            />
          </div>

          <div /> {/* Espacio vacío para el grid */}

          {/* Observaciones */}
          <div style={{ gridColumn: "1 / 3" }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Resultado / Observaciones:
            </label>
            <textarea
              style={{
                ...inputStyle,
                marginTop: 4,
                resize: "none",
                minHeight: "80px",
              }}
              name="observaciones"
              placeholder="Escribe tus observaciones aquí..."
              value={form.observaciones}
              onChange={handleChange}
            />
          </div>

          {/* Botón Guardar */}
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              gridColumn: "1 / 3",
              marginTop: 10,
              background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              padding: "14px",
              fontSize: "16px",
              cursor: guardando ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: guardando ? 0.7 : 1,
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

