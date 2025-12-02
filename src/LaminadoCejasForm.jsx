import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function LaminadoCejasForm() {
  const navigate = useNavigate();
  const { setNuevaFicha } = useContext(ClientaContext);

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
    // Validaciones simples
    if (!form.laminarMarca || !form.neutralizado) {
      setError("Selecciona las marcas de paso 1 y neutralizador.");
      return;
    }

    setError("");
    setGuardando(true);

    // Guardar en ficha general
    setNuevaFicha((prev) => ({
      ...prev,
      laminadoCejas: form,
    }));

    // Ir a pantalla final
    navigate("/ficha/final");
  }

  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f9a8d4",
    marginTop: "6px",
    fontSize: "14px",
    background: "white",
  };

  return (
    <div style={{ backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" }}>
      <div style={{ background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "24px 40px", borderRadius: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>Laminado de Cejas 💖</h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Registra detalles del servicio y resultados</p>
      </div>

      <div style={{ background: "white", padding: "30px 40px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#db2777", textAlign: "center" }}>Detalles del servicio</h2>

        {error && <p style={{ color: "red", textAlign: "center", fontWeight: 600 }}>{error}</p>}

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 30px" }}>
          <label>
            Producto paso 1:
            <select name="laminarMarca" value={form.laminarMarca} onChange={handleChange} style={input}>
              <option value="">Selecciona...</option>
              <option value="Producto A">Producto A</option>
              <option value="Producto B">Producto B</option>
            </select>
          </label>

          <label>
            Tiempo (paso 1):
            <input type="text" name="tiemposPaso1" value={form.tiemposPaso1} onChange={handleChange} placeholder="Ej: 10 min" style={input} />
          </label>

          <label>
            Neutralizador:
            <select name="neutralizado" value={form.neutralizado} onChange={handleChange} style={input}>
              <option value="">Selecciona...</option>
              <option value="Neutralizador A">Neutralizador A</option>
              <option value="Neutralizador B">Neutralizador B</option>
            </select>
          </label>

          <label>
            Tiempo (paso 2):
            <input type="text" name="tiemposPaso2" value={form.tiemposPaso2} onChange={handleChange} placeholder="Ej: 8 min" style={input} />
          </label>

          <label>
            Henna (marca):
            <input name="hennaMarca" value={form.hennaMarca} onChange={handleChange} style={input} />
          </label>

          <label>
            Tono de Henna:
            <input name="tonoHenna" value={form.tonoHenna} onChange={handleChange} style={input} />
          </label>

          <label>
            Tiempo de Henna (min):
            <input type="number" name="tiempoHenna" value={form.tiempoHenna} onChange={handleChange} style={input} />
          </label>

          <label>
            Mapeo:
            <input name="mapeo" value={form.mapeo} onChange={handleChange} style={input} />
          </label>

          <label>
            Cuidados:
            <input name="cuidados" value={form.cuidados} onChange={handleChange} style={input} />
          </label>

          <label>
            Contraindicaciones:
            <input name="contraindicaciones" value={form.contraindicaciones} onChange={handleChange} style={input} />
          </label>

          <label style={{ gridColumn: "1 / 3" }}>
            Resultado / observaciones:
            <textarea name="observaciones" rows={3} placeholder="Escribe tus observaciones..." style={{ ...input, resize: "none", height: 100 }} value={form.observaciones} onChange={handleChange} />
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


