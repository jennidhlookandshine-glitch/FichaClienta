import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function DepilacionFacialForm() {
const navigate = useNavigate();
const { setNuevaFicha } = useContext(ClientaContext);

const [form, setForm] = useState({
tipoPiel: "",
zonas: [],
tecnica: "cera",
producto: "",
sensibilidad: "",
observaciones: "",
fotoAntes: null,
fotoDespues: null,
});

const zonasOpciones = [
"Bozo", "Cejas", "Cuello", "Mentón/Barbilla", "Mejillas", "Frente", "Completo",
];

const [error, setError] = useState("");
const [guardando, setGuardando] = useState(false);

function handleChange(e) {
const { name, value, type, files, checked } = e.target;

```
if (name === "zonas") {  
  setForm((p) =>  
    checked ? { ...p, zonas: [...p.zonas, value] } : { ...p, zonas: p.zonas.filter((z) => z !== value) }  
  );  
  return;  
}  

setForm((p) => ({ ...p, [name]: type === "file" ? files[0] : value }));  
```

}

function handleGuardar() {
if (!form.tipoPiel) {
setError("Selecciona el tipo de piel.");
return;
}
if (form.zonas.length === 0) {
setError("Selecciona al menos una zona.");
return;
}

```
setError("");  
setGuardando(true);  

setNuevaFicha((prev) => ({  
  ...prev,  
  depilacion: form,  
}));  

alert("Ficha guardada correctamente 🎉");  

navigate("/ficha/final");  
```

}

return (
<div style={{ backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" }}>
<div style={{ background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "24px 40px", borderRadius: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
<h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>Ficha de Depilación Facial ✨</h1>
<p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Registra tipo de piel, zonas, técnica y resultados</p> </div>

```
  <div style={{ background: "white", padding: "30px 40px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>  
    <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#db2777", textAlign: "center" }}>Detalles del servicio</h2>  

    {error && <p style={{ color: "red", textAlign: "center", fontWeight: "600" }}>{error}</p>}  

    <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 30px" }}>  
      <label>  
        Tipo de piel:  
        <select name="tipoPiel" value={form.tipoPiel} onChange={handleChange} style={selectStyle}>  
          <option value="">Selecciona...</option>  
          <option value="seca">Seca</option>  
          <option value="mixta">Mixta</option>  
          <option value="grasa">Grasa</option>  
          <option value="sensible">Sensible</option>  
        </select>  
      </label>  

      <label>  
        Técnica:  
        <select name="tecnica" value={form.tecnica} onChange={handleChange} style={selectStyle}>  
          <option value="cera">Cera</option>  
          <option value="hilo">Hilo</option>  
          <option value="pinza">Pinza</option>  
        </select>  
      </label>  

      <fieldset style={{ gridColumn: "1 / 3", border: "none" }}>  
        <legend style={{ fontWeight: "600", marginBottom: "8px" }}>Zonas tratadas:</legend>  
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>  
          {zonasOpciones.map((z) => (  
            <label key={z} style={{ display: "flex", alignItems: "center" }}>  
              <input type="checkbox" name="zonas" value={z} checked={form.zonas.includes(z)} onChange={handleChange} style={{ marginRight: "6px" }} />  
              {z}  
            </label>  
          ))}  
        </div>  
      </fieldset>  

      <label style={{ gridColumn: "1 / 3" }}>Producto utilizado:  
        <input name="producto" value={form.producto} onChange={handleChange} style={inputStyle} />  
      </label>  

      <label style={{ gridColumn: "1 / 3" }}>Sensibilidad / reacción:  
        <textarea name="sensibilidad" rows={2} value={form.sensibilidad} onChange={handleChange} style={textareaStyle} />  
      </label>  

      <label style={{ gridColumn: "1 / 3" }}>Observaciones:  
        <textarea name="observaciones" rows={3} value={form.observaciones} onChange={handleChange} style={textareaStyle} />  
      </label>  

      <label>Foto antes: <input type="file" name="fotoAntes" onChange={handleChange} /></label>  
      <label>Foto después: <input type="file" name="fotoDespues" onChange={handleChange} /></label>  

      <button type="button" onClick={handleGuardar} style={botonGuardar} disabled={guardando}>  
        {guardando ? "Guardando..." : "Guardar Clienta"}  
      </button>  

      <button type="button" onClick={() => navigate(-1)} style={botonVolver}>Volver</button>  
    </form>  
  </div>  
</div>  
);
}

const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f9a8d4", marginTop: "6px", fontSize: "14px" };
const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };
const textareaStyle = { ...inputStyle, resize: "none" };
const botonGuardar = { gridColumn: "1 / 3", background: "linear-gradient(90deg, #f472b6, #db2777)", color: "white", border: "none", borderRadius: "30px", padding: "12px 0", fontSize: "16px", cursor: "pointer", fontWeight: "600", marginTop: "10px" };
const botonVolver = { gridColumn: "1 / 3", background: "#ccc", color: "#333", border: "none", borderRadius: "30px", padding: "10px 0", fontSize: "14px", cursor: "pointer", fontWeight: "600", marginTop: "5px" };






