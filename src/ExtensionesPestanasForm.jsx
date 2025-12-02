import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";
import MapaExtensiones from "./MapaExtensiones";

export default function ExtensionesForm() {
  const navigate = useNavigate();
  const { setNuevaFicha } = useContext(ClientaContext);

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
    fotoAntes: null,
    fotoDespues: null,
    mapaExtensiones: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function handleChange(e) {
    const { name, value, type, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  }

  function handleGuardar() {
    if (!form.tecnica) {
      setError("Selecciona la técnica");
      return;
    }

    setError("");
    setGuardando(true);

    setNuevaFicha((prev) => ({
      ...prev,
      extensiones: form,
    }));

    alert("Ficha guardada correctamente 🎉");
    navigate("/final-ficha");
  }

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
        <h1
          style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}
        >
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
              fontWeight: "600",
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
              name="adhesivo"
              value={form.adhesivo}
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

          <label>
            Foto antes:
            <input type="file" name="fotoAntes" onChange={handleChange} />
          </label>

          <label>
            Foto después:
            <input type="file" name="fotoDespues" onChange={handleChange} />
          </label>

          {/* Mapa */}
          <div style={{ gridColumn: "1 / 3", marginTop: "20px" }}>
            <h3 className="text-pink-600 font-semibold mb-2">
              Mapa de extensiones
            </h3>
            <MapaExtensiones
              onGuardar={(dataUrl) =>
                setForm((prev) => ({
                  ...prev,
                  mapaExtensiones: dataUrl,
                }))
              }
            />
          </div>

          <button
            type="button"
            onClick={handleGuardar}
            style={botonGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar ficha"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
