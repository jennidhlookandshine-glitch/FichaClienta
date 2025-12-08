// EditarClientaPage.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useClienta } from "./ClientaContext";
import FichaAppLayout from "./FichaAppLayout";

export default function EditarClientaPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { editarClienta, obtenerClientaPorId } = useClienta();

  // Puede venir por state o buscarse por id
  const clientaDesdeState = location.state?.clienta || null;
  const clienta = clientaDesdeState || (id ? obtenerClientaPorId(id) : null);

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    telefono: "",
    fechaAtencion: "",
    embarazadaLactancia: "",
    alergia: "",
    medicamentos: "",
    cirugias: "",
    enfermedadPiel: "",
    retinolAcidos: "",
    reacciones: "",
    lentesContacto: "",
    observaciones: "",
    notas: "",
  });

  // Cargar datos de la clienta en el formulario
  useEffect(() => {
    if (clienta) {
      setForm({
        nombreCompleto: clienta.nombreCompleto || "",
        fechaNacimiento: clienta.fechaNacimiento || "",
        telefono: clienta.telefono || "",
        fechaAtencion: clienta.fechaAtencion || "",
        embarazadaLactancia: clienta.embarazadaLactancia || "",
        alergia: clienta.alergia || "",
        medicamentos: clienta.medicamentos || "",
        cirugias: clienta.cirugias || "",
        enfermedadPiel: clienta.enfermedadPiel || "",
        retinolAcidos: clienta.retinolAcidos || "",
        reacciones: clienta.reacciones || "",
        lentesContacto: clienta.lentesContacto || "",
        observaciones: clienta.observaciones || "",
        notas: clienta.notas || "",
      });
    }
  }, [clienta]);

  // Si no hay clienta, redirigir
  if (!clienta) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins",
          color: "#e91e63",
          fontWeight: 600,
          padding: 24,
          textAlign: "center",
        }}
      >
        No hay clienta para editar.{" "}
        <button
          onClick={() => navigate("/clientas")}
          style={{
            marginLeft: 8,
            background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Volver a clientas
        </button>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await editarClienta(clienta.id, form);
      navigate(`/ficha/${clienta.id}`, {
        state: { clienta: { ...clienta, ...form } },
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios. Intenta de nuevo.");
    }
  }

  function handleCancelar() {
    navigate(-1);
  }

  return (
    <FichaAppLayout currentServicio={null} showServicios={false} modo="clientas">
      <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#ad1457",
            marginBottom: 16,
          }}
        >
          Editar datos de la clienta
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {/* Datos básicos */}
          <label style={{ fontWeight: 500, color: "#555" }}>
            Nombre completo
            <input
              type="text"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
              required
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Fecha de nacimiento
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Teléfono
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Fecha atención
            <input
              type="date"
              name="fechaAtencion"
              value={form.fechaAtencion}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          {/* Datos médicos */}
          <label style={{ fontWeight: 500, color: "#555" }}>
            Embarazada / Lactancia
            <input
              type="text"
              name="embarazadaLactancia"
              value={form.embarazadaLactancia}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Alergias
            <input
              type="text"
              name="alergia"
              value={form.alergia}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Medicamentos
            <input
              type="text"
              name="medicamentos"
              value={form.medicamentos}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Cirugías / Tratamientos
            <input
              type="text"
              name="cirugias"
              value={form.cirugias}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Enfermedad de la piel
            <input
              type="text"
              name="enfermedadPiel"
              value={form.enfermedadPiel}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Retinol / Ácidos
            <input
              type="text"
              name="retinolAcidos"
              value={form.retinolAcidos}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Reacciones en otros tratamientos
            <input
              type="text"
              name="reacciones"
              value={form.reacciones}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Lentes de contacto
            <input
              type="text"
              name="lentesContacto"
              value={form.lentesContacto}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Observaciones
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
                resize: "vertical",
              }}
            />
          </label>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Notas
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
                resize: "vertical",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={handleCancelar}
              style={{
                flex: 1,
                borderRadius: 24,
                border: "1px solid #f9a8d4",
                backgroundColor: "#fff",
                padding: "12px 0",
                fontWeight: 600,
                color: "#e91e63",
                cursor: "pointer",
                fontSize: 16,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f9a8d4";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = "#e91e63";
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                borderRadius: 24,
                border: "none",
                background: "linear-gradient(90deg, #ff7ac4, #ff3f8e)",
                padding: "12px 0",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </FichaAppLayout>
  );
}


