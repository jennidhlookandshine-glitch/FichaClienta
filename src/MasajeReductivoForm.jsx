import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function MasajeReductivoForm() {
const navigate = useNavigate();
const { setNuevaFicha } = useContext(ClientaContext);

const [form, setForm] = useState({
zonas: [],
tecnica: "manual",
productos: "",
tiempoTotal: "",
medidasAntes: { cintura: "", cadera: "", muslos: "", brazos: "", peso: "", grasa: "", estatura: "" },
medidasDespues: { cintura: "", cadera: "", muslos: "", brazos: "", peso: "", grasa: "", estatura: "" },
observaciones: "",
fotoAntes: null,
fotoDespues: null,
});

const zonasOpciones = ["Abdomen", "Glúteo", "Muslos", "Brazos", "Espalda", "Piernas"];

function handleChange(e) {
const { name, value, type, files } = e.target;
setForm(p => ({ ...p, [name]: type === "file" ? files[0] : value }));
}

function handleZonaChange(zona) {
const nuevasZonas = form.zonas.includes(zona)
? form.zonas.filter(z => z !== zona)
: [...form.zonas, zona];
setForm(p => ({ ...p, zonas: nuevasZonas }));
}

function handleMedidaChange(e, tipo, campo) {
const { value } = e.target;
setForm(p => ({ ...p, [tipo]: { ...p[tipo], [campo]: value } }));
}

function handleGuardar() {
setNuevaFicha(prev => ({
...prev,
masaje: form,
}));
navigate("/ficha/final");
}

const pageStyle = { backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" };
const headerStyle = { background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "24px 40px", borderRadius: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" };
const cardStyle = { background: "white", padding: "30px 40px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "20px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f9a8d4", marginTop: "6px", fontSize: "14px" };
const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };

return ( <div style={pageStyle}> <div style={headerStyle}>
<h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>Ficha de Masaje Reductivo 💆‍♀️</h1>
<p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Registra zonas, técnicas, productos, tiempos y medidas comparativas</p> </div>

```
  <div style={cardStyle}>
    <div>
      <label>
        Zonas a tratar:
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
          {zonasOpciones.map(z => (
            <label key={z} style={{ marginRight: "10px" }}>
              <input type="checkbox" checked={form.zonas.includes(z)} onChange={() => handleZonaChange(z)} /> {z}
            </label>
          ))}
        </div>
      </label>

      <label>
        Técnica:
        <select name="tecnica" value={form.tecnica} onChange={handleChange} style={selectStyle}>
          <option value="manual">Manual</option>
          <option value="aparatologia">Aparatología</option>
          <option value="maderoterapia">Maderoterapia</option>
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

      <fieldset style={{ border: "1px solid #f9a8d4", borderRadius: "10px", padding: "15px" }}>
        <legend>Medidas Antes</legend>
        {Object.keys(form.medidasAntes).map(campo => (
          <label key={campo} style={{ display: "block", marginBottom: "6px" }}>
            {campo.charAt(0).toUpperCase() + campo.slice(1)}:
            <input type={["peso","grasa","estatura"].includes(campo)?"number":"text"}
              value={form.medidasAntes[campo]}
              onChange={e=>handleMedidaChange(e,"medidasAntes",campo)}
              style={inputStyle} />
          </label>
        ))}
      </fieldset>

      <fieldset style={{ border: "1px solid #f9a8d4", borderRadius: "10px", padding: "15px", marginTop:"10px" }}>
        <legend>Medidas Después</legend>
        {Object.keys(form.medidasDespues).map(campo => (
          <label key={campo} style={{ display: "block", marginBottom: "6px" }}>
            {campo.charAt(0).toUpperCase() + campo.slice(1)}:
            <input type={["peso","grasa","estatura"].includes(campo)?"number":"text"}
              value={form.medidasDespues[campo]}
              onChange={e=>handleMedidaChange(e,"medidasDespues",campo)}
              style={inputStyle} />
          </label>
        ))}
      </fieldset>

      <label>
        Observaciones:
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" style={{...inputStyle, width:"100%", resize:"none", height:"80px"}}></textarea>
      </label>

      <label>
        Foto Antes:
        <input type="file" name="fotoAntes" accept="image/*" onChange={handleChange} />
      </label>
      <label>
        Foto Después:
        <input type="file" name="fotoDespues" accept="image/*" onChange={handleChange} />
      </label>
    </div>

    <button type="button" onClick={handleGuardar} style={{ background:"linear-gradient(90deg, #f472b6, #db2777)", color:"white", border:"none", borderRadius:"30px", padding:"12px 0", fontSize:"16px", cursor:"pointer", fontWeight:"600", boxShadow:"0 4px 10px rgba(0,0,0,0.2)" }}>
      Guardar ficha
    </button>
  </div>
</div>

);
}



