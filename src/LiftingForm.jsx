import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function LiftingForm() {
  const navigate = useNavigate();
  const { setNuevaFicha } = useContext(ClientaContext);

  const [form, setForm] = useState({
    tipoOjo: "",
    tamanoPestanas: "",
    molde: "",
    productoPaso1: "",
    tiempoPaso1: "",
    productoPaso2: "",
    tiempoPaso2: "",
    tinte: "",
    tiempoTotal: "",
    observaciones: "",
    fotoAntes: null,
    fotoDespues: null,
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  }

  function handleGuardar() {
    // Validación básica
    if (!form.tipoOjo || !form.productoPaso1) {
      setError("Completa al menos el tipo de ojo y el producto del paso 1.");
      return;
    }

    setError("");
    setGuardando(true);

    setNuevaFicha((prev) => ({
      ...prev,
      lifting: form,
    }));

    navigate("/ficha/final");
  }

  return (
    <div style={{ backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" }}>
      <div style={{ background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "24px 40px", borderRadius: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>Lifting de Pestañas 💖</h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Registra los productos, moldes y observaciones del servicio</p>
      </div>

      <div style={{ background: "white", padding: "30px 40px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#db2777", textAlign: "center" }}>Detalles del servicio</h2>

        {error && <p style={{ color: "red", textAlign: "center", fontWeight: 600 }}>{error}</p>}

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 30px" }}>
          <label>
            Tipo de ojo:
            <select name="tipoOjo" value={form.tipoOjo} onChange={handleChange} style={selectStyle}>
              <option value="">Selecciona...</option>
              <option value="redondo">Redondo</option>
              <option value="almendrado">Almendrado</option>
              <option value="asiático">Asiático</option>
              <option value="caído">Caído</option>
            </select>
          </label>

          <label>
            Tamaño de pestañas:
            <select name="tamanoPestanas" value={form.tamanoPestanas} onChange={handleChange} style={selectStyle}>
              <option value="">Selecciona...</option>
              <option value="cortas">Cortas</option>
              <option value="medianas">Medianas</option>
              <option value="largas">Largas</option>
            </select>
          </label>

          <label>
            Molde usado:
            <select name="molde" value={form.molde} onChange={handleChange} style={selectStyle}>
              <option value="">Selecciona...</option>
              <option value="frozen">Frozen</option>
              <option value="conchita">Conchita</option>
              <option value="nube">Nube</option>
              <option value="coreano">Coreano</option>
              <option value="ranadura">Ranadura</option>
            </select>
          </label>

          <label>
            Producto paso 1:
            <select name="productoPaso1" value={form.productoPaso1} onChange={handleChange} style={selectStyle}>
              <option value="">Selecciona...</option>
              <option value="maximova">Maximova</option>
              <option value="beautywave">Beauty Wave</option>
              <option value="dlux">Dlux</option>
              <option value="lomansa">Lomansa</option>
            </select>
          </label>

          <label>
            Tiempo (paso 1):
            <input type="text" name="tiempoPaso1" value={form.tiempoPaso1} onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            Producto paso 2:
            <select name="productoPaso2" value={form.productoPaso2} onChange={handleChange} style={selectStyle}>
              <option value="">Selecciona...</option>
              <option value="maximova">Maximova</option>
              <option value="beautywave">Beauty Wave</option>
              <option value="dlux">Dlux</option>
              <option value="lomansa">Lomansa</option>
            </select>
          </label>

          <label>
            Tiempo (paso 2):
            <input type="text" name="tiempoPaso2" value={form.tiempoPaso2} onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            ¿Se utilizó tinte?
            <div>
              <label>
                <input type="radio" name="tinte" value="sí" checked={form.tinte === "sí"} onChange={handleChange} /> Sí
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input type="radio" name="tinte" value="no" checked={form.tinte === "no"} onChange={handleChange} /> No
              </label>
            </div>
          </label>

          <label>
            Tiempo total (min):
            <input type="number" name="tiempoTotal" value={form.tiempoTotal} onChange={handleChange} style={inputStyle} />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Observaciones:
            <textarea name="observaciones" rows={3} value={form.observaciones} onChange={handleChange} style={textareaStyle} />
          </label>

          <label>
            Foto antes:
            <input type="file" name="fotoAntes" onChange={handleChange} />
          </label>

          <label>
            Foto después:
            <input type="file" name="fotoDespues" onChange={handleChange} />
          </label>

          <button type="button" onClick={handleGuardar} disabled={guardando} style={{
            gridColumn: "1 / 3",
            background: "linear-gradient(90deg, #f472b6, #db2777)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "12px 0",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: 600,
          }}>
            {guardando ? "Guardando..." : "Guardar ficha"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f9a8d4", marginTop: "6px", fontSize: "14px" };
const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };
const textareaStyle = { ...inputStyle, resize: "none", width: "100%" };


