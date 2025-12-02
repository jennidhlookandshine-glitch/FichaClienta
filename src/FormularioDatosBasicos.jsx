import React, { useEffect, useMemo, useState } from "react";
import CardGradient from "./CardGradient";

export default function FormularioDatosBasicos({ onChange }) {
  const hoy = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    telefono: "",
    fechaAtencion: hoy,
    servicio: "lifting",

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

  /* === Estilos base iguales a tu ficha de Extensiones === */

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

  return (
    <div style={pageStyle}>
      {/* 🔥 ENCABEZADO */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "700" }}>
          Datos Básicos de la Clienta 👩🏻‍🦰
        </h1>
        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.95 }}>
          Información esencial para seguridad y registro
        </p>
      </div>

      {/* 🔥 TARJETA BLANCA CENTRAL */}
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

        {/* FORMULARIO */}
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

          {/* Servicio */}
          <label>
            Servicio solicitado
            <select
              style={selectStyle}
              value={form.servicio}
              onChange={(e) => setCampo("servicio", e.target.value)}
            >
              <option value="lifting">Lifting de pestañas</option>
              <option value="extensiones">Extensiones de pestañas</option>
              <option value="depilacion">Depilación facial</option>
              <option value="limpieza">Limpieza facial</option>
              <option value="hydrogloss">Hydrogloss</option>
              <option value="masaje_reductivo">Masaje reductivo</option>
              <option value="masaje_relajante">Masaje relajante</option>
              <option value="laminado">Laminado de cejas</option>
            </select>
          </label>

          {/* Título datos médicos */}
          <h3
            style={{
              fontSize: "18px",
              marginTop: "10px",
              marginBottom: "10px",
              color: "#db2777",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Datos médicos relevantes 🩺
          </h3>

          {/* === SECCION MÉDICA === */}
          {/* Fila 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Embarazo */}
            <label>
              Embarazo o lactancia
              <select
                style={selectStyle}
                value={form.embarazadaLactancia}
                onChange={(e) => setCampo("embarazadaLactancia", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>

            {/* Alergias */}
            <label>
              Alergias
              <select
                style={selectStyle}
                value={form.alergias}
                onChange={(e) => setCampo("alergias", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>

              {form.alergias === "si" && (
                <input
                  style={{ ...inputStyle, marginTop: "8px" }}
                  value={form.alergiasDetalle}
                  onChange={(e) => setCampo("alergiasDetalle", e.target.value)}
                  placeholder="Indicar alergia"
                />
              )}
            </label>

            {/* Medicamentos */}
            <label>
              Medicamentos
              <select
                style={selectStyle}
                value={form.medicamentos}
                onChange={(e) => setCampo("medicamentos", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>

              {form.medicamentos === "si" && (
                <input
                  style={{ ...inputStyle, marginTop: "8px" }}
                  value={form.medicamentosDetalle}
                  onChange={(e) =>
                    setCampo("medicamentosDetalle", e.target.value)
                  }
                  placeholder="¿Cuáles?"
                />
              )}
            </label>
          </div>

          {/* Fila 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <label>
              Cirugías o tratamientos
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
              {form.cirugiasTratamientos === "si" && (
                <input
                  style={{ ...inputStyle, marginTop: "8px" }}
                  value={form.cirugiasDetalle}
                  onChange={(e) => setCampo("cirugiasDetalle", e.target.value)}
                  placeholder="Indicar detalle"
                />
              )}
            </label>

            <label>
              Enfermedad de la piel
              <input
                style={inputStyle}
                value={form.enfermedadPiel}
                onChange={(e) => setCampo("enfermedadPiel", e.target.value)}
                placeholder="Acné, rosácea…"
              />
            </label>

            <label>
              Retinol / ácidos
              <select
                style={selectStyle}
                value={form.retinolAcidos}
                onChange={(e) => setCampo("retinolAcidos", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </label>
          </div>

          {/* Fila 3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <label>
              Reacción adversa
              <select
                style={selectStyle}
                value={form.reaccionAdversa}
                onChange={(e) => setCampo("reaccionAdversa", e.target.value)}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
              {form.reaccionAdversa === "si" && (
                <input
                  style={{ ...inputStyle, marginTop: "8px" }}
                  value={form.reaccionDetalle}
                  onChange={(e) =>
                    setCampo("reaccionDetalle", e.target.value)
                  }
                  placeholder="¿Cuál?"
                />
              )}
            </label>

            <label>
              Lentes de contacto
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
              Observaciones
              <textarea
                rows={3}
                style={{ ...inputStyle, height: "100px", resize: "none" }}
                value={form.observacionesProfesional}
                onChange={(e) =>
                  setCampo("observacionesProfesional", e.target.value)
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

