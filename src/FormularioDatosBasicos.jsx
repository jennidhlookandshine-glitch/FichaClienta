import React, { useEffect, useMemo, useState } from "react";
import { useClienta } from "./ClientaContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FormularioDatosBasicos({ onChange }) {
  const hoy = new Date().toISOString().slice(0, 10);

  const { setNuevaFicha, guardarFicha } = useClienta();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    telefono: "",
    fechaAtencion: hoy,
    servicios: [],

    embarazadaLactancia: "no",
    alergias: "no",
    alergiasDetalle: "",
    medicamentos: "no",
    medicamentosDetalle: "",
    cirugiasTratamientos: "no",
    cirugiasDetalle: "",
    enfermedadPiel: "",
    retinolAcidos: "no",
    reaccionAdversa: "no",
    reaccionDetalle: "",
    lentesContacto: "no",
    observacionesProfesional: "",
  });

  const normalizados = useMemo(() => {
    const clienteLower = (form.nombreCompleto || "").trim().toLowerCase();
    const telefonoLimpio = (form.telefono || "").replace(/[^\d+]/g, "");
    return { clienteLower, telefonoLimpio };
  }, [form.nombreCompleto, form.telefono]);

  useEffect(() => {
    if (onChange) onChange({ ...form, ...normalizados });
  }, [form, normalizados, onChange]);

  function setCampo(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleConfirmarDatos() {
    if (!form.nombreCompleto.trim()) {
      toast.error("Ingresa el nombre completo");
      return;
    }
    if (!form.telefono.trim()) {
      toast.error("Ingresa el teléfono");
      return;
    }
    if (!form.fechaNacimiento) {
      toast.error("Ingresa la fecha de nacimiento");
      return;
    }

    const fichaFinal = { ...form, ...normalizados };
    console.log("GUARDANDO FICHA:", fichaFinal);

    try {
      const clientaId = await guardarFicha(fichaFinal);
      console.log("CLIENTA CREADA ID:", clientaId);

      setNuevaFicha({
        id: clientaId,
        ...fichaFinal,
        servicios: [],
      });

      toast.success("Ficha guardada correctamente ✨");

      navigate("/seleccionar-servicio", {
        state: { clienta: { id: clientaId, ...fichaFinal } },
      });
    } catch (error) {
      console.error("ERROR AL GUARDAR:", error);
      if (error.message === "DUPLICADA") {
        toast.error("Esta clienta ya existe en el sistema");
      } else {
        toast.error("Ocurrió un error al guardar la ficha");
      }
    }
  }

  const pageStyle = {
    backgroundColor: "#fde2e4",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    color: "#333",
  };

  const headerStyle = {
    background: "linear-gradient(90deg, #f9a8d4, #f472b6)",
    color: "white",
    padding: "24px 40px",
    borderRadius: "20px",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const cardStyle = {
    background: "white",
    padding: "30px 40px",
    borderRadius: "16px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  };

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

  const subTitleStyle = {
    fontSize: "18px",
    margin: "32px 0 12px",
    color: "#db2777",
    fontWeight: "600",
    textAlign: "left",
  };

  const gridMedicosStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "20px",
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>
          Datos Básicos de la Clienta 👩🏻‍🦰
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Información esencial para seguridad y registro
        </p>
      </div>

      <div style={cardStyle}>
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            color: "#db2777",
            textAlign: "center",
          }}
        >
          Información general
        </h2>

        <div style={{ display: "grid", gap: "20px" }}>
          {/* Nombre */}
          <label>
            Nombre completo
            <input
              style={inputStyle}
              value={form.nombreCompleto}
              onChange={(e) => setCampo("nombreCompleto", e.target.value)}
              placeholder="Ej: María López"
            />
          </label>

          {/* Fechas + teléfono */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <label>
              Fecha de nacimiento
              <input
                type="date"
                style={inputStyle}
                value={form.fechaNacimiento}
                onChange={(e) => setCampo("fechaNacimiento", e.target.value)}
              />
            </label>

            <label>
              Teléfono
              <input
                style={inputStyle}
                value={form.telefono}
                onChange={(e) => setCampo("telefono", e.target.value)}
                placeholder="+56 9 ..."
              />
            </label>

            <label>
              Fecha atención
              <input
                type="date"
                style={inputStyle}
                value={form.fechaAtencion}
                onChange={(e) => setCampo("fechaAtencion", e.target.value)}
              />
            </label>
          </div>

          {/* DATOS MÉDICOS */}
          <h3 style={subTitleStyle}>Datos médicos relevantes 🩺</h3>

          <div style={gridMedicosStyle}>
            <label>
              ¿Embarazada o en lactancia?
              <select
                style={selectStyle}
                value={form.embarazadaLactancia}
                onChange={(e) =>
                  setCampo("embarazadaLactancia", e.target.value)
                }
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              ¿Presenta alergias?
              <select
                style={selectStyle}
                value={form.alergias}
                onChange={(e) => setCampo("alergias", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              ¿Toma medicamentos?
              <select
                style={selectStyle}
                value={form.medicamentos}
                onChange={(e) => setCampo("medicamentos", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              Cirugías o tratamientos recientes
              <select
                style={selectStyle}
                value={form.cirugiasTratamientos}
                onChange={(e) =>
                  setCampo("cirugiasTratamientos", e.target.value)
                }
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              Enfermedad de la piel diagnosticada
              <input
                style={inputStyle}
                value={form.enfermedadPiel}
                onChange={(e) => setCampo("enfermedadPiel", e.target.value)}
                placeholder="Ej: dermatitis, psoriasis, rosácea"
              />
            </label>

            <label>
              ¿Usa retinol o ácidos en su rutina?
              <select
                style={selectStyle}
                value={form.retinolAcidos}
                onChange={(e) => setCampo("retinolAcidos", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              ¿Ha tenido reacción adversa en otros tratamientos?
              <select
                style={selectStyle}
                value={form.reaccionAdversa}
                onChange={(e) => setCampo("reaccionAdversa", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              ¿Usa lentes de contacto?
              <select
                style={selectStyle}
                value={form.lentesContacto}
                onChange={(e) => setCampo("lentesContacto", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            <label>
              Observaciones del profesional
              <textarea
                style={{ ...inputStyle, minHeight: 80 }}
                value={form.observacionesProfesional}
                onChange={(e) =>
                  setCampo("observacionesProfesional", e.target.value)
                }
                placeholder="Notas importantes para el procedimiento"
              />
            </label>
          </div>

          {form.alergias === "si" && (
            <label>
              Detalle alergias
              <input
                style={inputStyle}
                value={form.alergiasDetalle}
                onChange={(e) => setCampo("alergiasDetalle", e.target.value)}
                placeholder="Medicamentos, látex, tintes..."
              />
            </label>
          )}

          {form.medicamentos === "si" && (
            <label>
              Detalle medicamentos
              <input
                style={inputStyle}
                value={form.medicamentosDetalle}
                onChange={(e) =>
                  setCampo("medicamentosDetalle", e.target.value)
                }
                placeholder="Nombre y dosis"
              />
            </label>
          )}

          {form.cirugiasTratamientos === "si" && (
            <label>
              Detalle cirugías / tratamientos
              <input
                style={inputStyle}
                value={form.cirugiasDetalle}
                onChange={(e) => setCampo("cirugiasDetalle", e.target.value)}
              />
            </label>
          )}

          {form.reaccionAdversa === "si" && (
            <label>
              Detalle reacción adversa
              <input
                style={inputStyle}
                value={form.reaccionDetalle}
                onChange={(e) => setCampo("reaccionDetalle", e.target.value)}
              />
            </label>
          )}

          <div
            style={{ marginTop: 30, display: "flex", justifyContent: "center" }}
          >
            <button
              type="button"
              onClick={handleConfirmarDatos}
              style={{
                background: "linear-gradient(90deg, #f472b6, #db2777)",
                color: "white",
                border: "none",
                borderRadius: "999px",
                padding: "10px 32px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              Guardar y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}










