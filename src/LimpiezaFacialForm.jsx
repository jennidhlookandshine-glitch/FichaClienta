import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";

export default function LimpiezaFacialForm() {
const navigate = useNavigate();
const { setNuevaFicha } = useContext(ClientaContext);

const [form, setForm] = useState({
tipoPiel: "",
evaluacion: "",
protocolo: "",
productos: "",
contraindicaciones: "",
tiempoTotal: "",
observaciones: "",
fotoAntes: null,
fotoDespues: null,
});

function handleChange(e) {
const { name, value, type, files } = e.target;
setForm((prev) => ({
...prev,
[name]: type === "file" ? files[0] : value,
}));
}

function handleGuardar() {
setNuevaFicha((prev) => ({
...prev,
limpieza: form,
}));

```
navigate("/ficha/final");  
```

}

const pageStyle = { backgroundColor: "#fde2e4", minHeight: "100vh", padding: "40px", fontFamily: "'Poppins', sans-serif", color: "#333" };
const headerStyle = { background: "linear-gradient(90deg, #f9a8d4, #f472b6)", color: "white", padding: "25px 20px", borderRadius: "20px", textAlign: "center", marginBottom: "30px", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" };
const cardStyle = { background: "white", padding: "25px 30px", borderRadius: "16px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "20px" };
const sectionStyle = { border: "1px solid #f9a8d4", borderRadius: "12px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#fff5f8" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f9a8d4", fontSize: "14px" };
const selectStyle = { ...inputStyle, backgroundColor: "#fff0f7" };
const textareaStyle = { ...inputStyle, resize: "none", minHeight: "60px" };
const buttonStyle = { background: "linear-gradient(90deg, #f472b6, #db2777)", color: "white", border: "none", borderRadius: "30px", padding: "12px 0", fontSize: "16px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" };

return ( <div style={pageStyle}> <div style={headerStyle}>
<h1 style={{ fontSize: "32px", margin: 0, fontWeight: 700 }}>Limpieza Facial 💆‍♀️</h1>
<p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>Registro de evaluación, protocolo y resultados</p> </div>

```
  <div style={cardStyle}>  
    <div style={sectionStyle}>  
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
        Tiempo total (min):  
        <input type="number" name="tiempoTotal" value={form.tiempoTotal} onChange={handleChange} style={inputStyle} />  
      </label>  
    </div>  

    <div style={sectionStyle}>  
      <label>Evaluación:  
        <textarea name="evaluacion" value={form.evaluacion} onChange={handleChange} style={textareaStyle} />  
      </label>  
    </div>  

    <div style={sectionStyle}>  
      <label>Protocolo aplicado:  
        <textarea name="protocolo" value={form.protocolo} onChange={handleChange} style={textareaStyle} />  
      </label>  
    </div>  

    <div style={sectionStyle}>  
      <label>Productos utilizados:  
        <textarea name="productos" value={form.productos} onChange={handleChange} style={textareaStyle} />  
      </label>  
      <label>Contraindicaciones:  
        <textarea name="contraindicaciones" value={form.contraindicaciones} onChange={handleChange} style={textareaStyle} />  
      </label>  
    </div>  

    <div style={sectionStyle}>  
      <label>Foto antes: <input type="file" name="fotoAntes" onChange={handleChange} /></label>  
      <label>Foto después: <input type="file" name="fotoDespues" onChange={handleChange} /></label>  
    </div>  

    <div style={sectionStyle}>  
      <label>Observaciones:  
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} style={textareaStyle} />  
      </label>  
    </div>  

    <button type="button" onClick={handleGuardar} style={buttonStyle}>  
      Guardar ficha  
    </button>  
  </div>  
</div>  

);
}





