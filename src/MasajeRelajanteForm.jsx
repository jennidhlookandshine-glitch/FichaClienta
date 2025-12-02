import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function MasajeRelajanteForm() {
const navigate = useNavigate();
const { setNuevaFicha } = useContext(ClientaContext);

const [form, setForm] = useState({
zonas: "",
tecnica: "relajante",
productos: "",
tiempoTotal: "",
escalaMolestiaAntes: "",
escalaMolestiaDespues: "",
observaciones: "",
fotoAntes: null,
fotoDespues: null,
});

function handleChange(e) {
const { name, value, type, files } = e.target;
setForm(p => ({ ...p, [name]: type === "file" ? files?.[0] || null : value }));
}

function handleGuardar() {
setNuevaFicha(prev => ({
...prev,
masajeRelajante: form,
}));
navigate("/ficha/final");
}

const pageStyle = { backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" };
const headerStyle = { background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "24px 40px", borderRadius: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" };
const cardStyle = { background: "white", padding: "30px 40px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "20px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f9a8d4", marginTop: "6px", fontSize: "14px" };
const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };

return ( <div style={pageStyle}> <div style={headerStyle}>
<h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>Ficha de Masaje Relajante 💆‍♀️</h1>
<p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Zonas, técnica, productos, tiempos y escala de molestia</p> </div>

```
  <div style={cardStyle}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 30px" }}>
      <label>
        Zonas:
        <select name="zonas" value={form.zonas} onChange={handleChange} style={selectStyle}>
          <option value="">Selecciona...</option>
          <option value="medio cuerpo">Medio cuerpo</option>
          <option value="cuerpo completo">Cuerpo completo</option>
        </select>
      </label>

      <label>
        Técnica:
        <select name="tecnica" value={form.tecnica} onChange={handleChange} style={selectStyle}>
          <option value="relajante">Relajante</option>
          <option value="descontracturante">Descontracturante</option>
          <option value="mixto">Mixto</option>
        </select>
      </label>

      <label>
        Producto:
        <input type="text" name="productos" value={form.productos} onChange={handleChange} style={inputStyle} />
      </label>

      <label>
        Tiempo total (min):
        <input type="number" min="10" max="180" name="tiempoTotal" value={form.tiempoTotal} onChange={handleChange} style={inputStyle} />
      </label>

      <label>
        Escala de molestia antes (0-10):
        <input type="number" min="0" max="10" name="escalaMolestiaAntes" value={form.escalaMolestiaAntes} onChange={handleChange} style={inputStyle} />
      </label>

      <label>
        Escala de molestia después (0-10):
        <input type="number" min="0" max="10" name="escalaMolestiaDespues" value={form.escalaMolestiaDespues} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={{ gridColumn: "1 / 3" }}>
        Observaciones:
        <textarea name="observaciones" rows="3" value={form.observaciones} onChange={handleChange} style={{...inputStyle, width:"100%", resize:"none", height:"80px"}} />
      </label>

      <label>
        Foto antes:
        <input type="file" name="fotoAntes" accept="image/*" onChange={handleChange} />
      </label>
      <label>
        Foto después:
        <input type="file" name="fotoDespues" accept="image/*" onChange={handleChange} />
      </label>
    </div>

    <button type="button" onClick={handleGuardar} style={{ gridColumn:"1 / 3", background:"linear-gradient(90deg, #f472b6, #db2777)", color:"white", border:"none", borderRadius:"30px", padding:"12px 0", fontSize:"16px", cursor:"pointer", fontWeight:"600", boxShadow:"0 4px 10px rgba(0,0,0,0.2)" }}>
      Guardar ficha
    </button>
  </div>
</div>

);
}

