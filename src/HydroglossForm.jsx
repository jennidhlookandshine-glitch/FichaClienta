import React, { useState } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function HydroglossLabiosForm() {
  const [form, setForm] = useState({
    colorTono: "",
    tipoLabios: "",
    estadoInicial: "",
    estadoFinal: "",
    exfoliacion: false,
    ah: false,
    cartucho: "",
    colorCartucho: "",
    gloss: false,
    mascarilla: false,
    sesiones: [],
    observaciones: "",
    fotoAntes: null,
    fotoDespues: null,
  });

  const [guardando, setGuardando] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "file"
          ? files?.[0] || null
          : type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleSesionChange(index) {
    const newSesiones = [...form.sesiones];
    newSesiones[index] = !newSesiones[index];
    setForm((p) => ({ ...p, sesiones: newSesiones }));
  }

  async function subir(carpeta, file) {
    if (!file) return null;
    const limpio = (file.name || "foto").replace(/\s+/g, "_");
    const r = ref(storage, `${carpeta}/${Date.now()}_${limpio}`);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setGuardando(true);
      const urlAntes = await subir("hydrogloss/antes", form.fotoAntes);
      const urlDespues = await subir("hydrogloss/despues", form.fotoDespues);

      await addDoc(collection(db, "hydrogloss"), {
        ...form,
        fotoAntesURL: urlAntes || "",
        fotoDespuesURL: urlDespues || "",
        creadoEn: serverTimestamp(),
      });

      alert("Hydrogloss guardado");
      setForm({
        colorTono: "",
        tipoLabios: "",
        estadoInicial: "",
        estadoFinal: "",
        exfoliacion: false,
        ah: false,
        cartucho: "",
        colorCartucho: "",
        gloss: false,
        mascarilla: false,
        sesiones: [],
        observaciones: "",
        fotoAntes: null,
        fotoDespues: null,
      });
    } catch (e) {
      console.error(e);
      alert("Error al guardar hydrogloss");
    } finally {
      setGuardando(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f9a8d4",
    marginTop: "6px",
    fontSize: "14px",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "#fff0f7",
  };

  const checkboxStyle = {
    marginRight: "8px",
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
      {/* Encabezado */}
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
          Ficha de Hydrogloss 💋
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Registra productos, técnicas, sesiones y observaciones
        </p>
      </div>

      {/* Formulario */}
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
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 30px",
          }}
        >

          <label>
            Tipo de labios:
            <select
              name="tipoLabios"
              value={form.tipoLabios}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="resecos">Resecos</option>
              <option value="finos">Finos</option>
              <option value="gruesos">Gruesos</option>
              <option value="grietas">Con grietas</option>
            </select>
          </label>

          <label>
            Estado inicial:
            <input
              name="estadoInicial"
              value={form.estadoInicial}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Estado final:
            <input
              name="estadoFinal"
              value={form.estadoFinal}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Checkboxes */}
          <div
            style={{
              gridColumn: "1 / 3",
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <label>
              <input
                type="checkbox"
                name="exfoliacion"
                checked={form.exfoliacion}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Exfoliación
            </label>
            <label>
              <input
                type="checkbox"
                name="ah"
                checked={form.ah}
                onChange={handleChange}
                style={checkboxStyle}
              />
              AH
            </label>
            <label>
              <input
                type="checkbox"
                name="gloss"
                checked={form.gloss}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Gloss
            </label>
            <label>
              <input
                type="checkbox"
                name="mascarilla"
                checked={form.mascarilla}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Mascarilla labial
            </label>
          </div>

          {/* Cartucho y color */}
          <label>
            Cartucho:
            <select
              name="cartucho"
              value={form.cartucho}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="36">36</option>
              <option value="42">42</option>
              <option value="nano">Nano</option>
            </select>
          </label>

          <label>
            Color Tinte:
            <select
              name="colorTinte"
              value={form.colorTinte}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecciona...</option>
              <option value="rosado">Rosado</option>
              <option value="rojo">Rojo</option>
              <option value="ninguno">Ninguno</option>
            </select>
          </label>

          {/* Sesiones */}
          <label style={{ gridColumn: "1 / 3" }}>
            Sesiones:
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "5px",
              }}
            >
              {[...Array(10)].map((_, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={form.sesiones[i] || false}
                    onChange={() => handleSesionChange(i)}
                    style={checkboxStyle}
                  />
                  {i + 1}
                </label>
              ))}
            </div>
          </label>

          {/* Observaciones */}
          <label style={{ gridColumn: "1 / 3" }}>
            Observaciones:
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "none", width: "100%", height: "80px" }}
            />
          </label>

          {/* Fotos */}
          <label>
            Foto antes:
            <input
              type="file"
              name="fotoAntes"
              accept="image/*"
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Foto después:
            <input
              type="file"
              name="fotoDespues"
              accept="image/*"
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Botón */}
          <button
            type="submit"
            disabled={guardando}
            style={{
              gridColumn: "1 / 3",
              background: "linear-gradient(90deg, #f472b6, #db2777)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              padding: "12px 0",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            {guardando ? "Guardando..." : "Guardar Hydrogloss"}
          </button>
        </form>
      </div>
    </div>
  );
}



