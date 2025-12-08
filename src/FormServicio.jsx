// FormServicio.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClienta } from "./ClientaContext";
import { guardarServicioEnFirebase } from "./firebaseServicios"; // crea esta función para guardar

export default function FormServicio() {
  const { clientas, actualizarClienta } = useClienta();
  const location = useLocation();
  const navigate = useNavigate();

  const clienta = location.state?.clienta;
  const servicioSeleccionado = location.state?.servicio;

  const [detalle, setDetalle] = useState("");
  const [notas, setNotas] = useState("");
  const [fotoAntes, setFotoAntes] = useState(null);
  const [fotoDespues, setFotoDespues] = useState(null);

  if (!clienta || !servicioSeleccionado) {
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
        No se encontró la clienta o el servicio.
      </div>
    );
  }

  const handleGuardarServicio = async () => {
    const nuevoServicio = {
      servicio: servicioSeleccionado,
      detalle,
      notas,
      fotoAntes,
      fotoDespues,
      fecha: new Date().toLocaleDateString(),
    };

    try {
      // 1️⃣ Guardar en Firebase o en tu base de datos
      await guardarServicioEnFirebase(clienta.id, nuevoServicio);

      // 2️⃣ Actualizar en el contexto local
      actualizarClienta(clienta.id, nuevoServicio);

      alert("Servicio agregado correctamente");
      navigate("/"); // vuelve a la lista de clientas o a seleccionar servicio
    } catch (error) {
      console.error(error);
      alert("Error al guardar el servicio");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#e91e63", marginBottom: 20 }}>
        {servicioSeleccionado} para {clienta.nombre || clienta.nombreCompleto}
      </h2>

      <textarea
        placeholder="Detalle del servicio"
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="Notas adicionales"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <label>
          Foto Antes:{" "}
          <input type="file" onChange={(e) => setFotoAntes(e.target.files[0])} />
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Foto Después:{" "}
          <input type="file" onChange={(e) => setFotoDespues(e.target.files[0])} />
        </label>
      </div>

      <button
        onClick={handleGuardarServicio}
        style={{
          width: "100%",
          padding: 14,
          background: "#e91e63",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Guardar Servicio ✅
      </button>
    </div>
  );
}
