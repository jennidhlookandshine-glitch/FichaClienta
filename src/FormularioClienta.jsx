// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormNuevaClienta({ onGuardar }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
    fechaAtencion: new Date().toISOString().split("T")[0],
    alergias: "",
    embarazadaLactancia: "",
    lentesContacto: "",
    enfermedadPiel: "",
    observacionesProfesional: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      alert("Debes ingresar nombre y apellido de la clienta");
      return;
    }

    const fichaCompleta = {
      ...form,
      nombreCompleto: `${form.nombre.trim()} ${form.apellido.trim()}`,
      creadoEn: new Date(),
      servicios: [],
    };

    try {
      // onGuardar debe devolver un id único de la clienta en Firebase
      const id = await onGuardar(fichaCompleta);

      // 🚀 Navegar a selección de servicios pasando la clienta creada
      navigate("/seleccionar-servicio", { state: { clienta: { ...fichaCompleta, id } } });
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
      alert("Error al guardar la ficha");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="alergias" placeholder="Alergias" value={form.alergias} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="embarazadaLactancia" placeholder="Embarazo / lactancia" value={form.embarazadaLactancia} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="lentesContacto" placeholder="Uso de lentes de contacto" value={form.lentesContacto} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <input name="enfermedadPiel" placeholder="Enfermedades de la piel" value={form.enfermedadPiel} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      <textarea name="observacionesProfesional" placeholder="Observaciones del profesional" value={form.observacionesProfesional} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      
      <button onClick={handleGuardar} style={{ width: "100%", padding: 14, background: "#e91e63", color: "#fff", border: "none", borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}>
        Continuar ➡️
      </button>
    </div>
  );
}







