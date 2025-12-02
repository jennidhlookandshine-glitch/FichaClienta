import React, { useMemo, useState } from "react";

export default function FormNuevaClienta({ onGuardar }) {
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  function normNombre(s = "") {
    return s.trim().replace(/\s+/g, " ");
  }
  function normTelefono(s = "") {
    return s.replace(/[^\d+]/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nombreOk = normNombre(nombre);
    if (!nombreOk) {
      setMensaje("Ingresa un nombre válido.");
      return;
    }
    const telefonoOk = normTelefono(telefono);
    const payload = {
      nombre: nombreOk,
      clienteLower: nombreOk.toLowerCase(),
      telefono: telefonoOk,
      fecha: fecha || hoy,
    };

    try {
      setGuardando(true);
      setMensaje("");
      if (onGuardar) {
        await onGuardar(payload);
      }
      setMensaje("Clienta guardada correctamente.");
      setNombre("");
      setTelefono("");
      setFecha(hoy);
    } catch (err) {
      console.error(err);
      setMensaje("No se pudo guardar. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-pink300/30 animate-fadeIn"
    >
      <h3 className="text-pink700 text-lg font-semibold mb-4 text-center">
        Agregar nueva clienta
      </h3>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full mb-3 px-4 py-2 border border-pink300 rounded-xl focus:ring-2 focus:ring-pink400 focus:outline-none transition"
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full mb-3 px-4 py-2 border border-pink300 rounded-xl focus:ring-2 focus:ring-pink400 focus:outline-none transition"
      />

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-pink300 rounded-xl focus:ring-2 focus:ring-pink400 focus:outline-none transition"
      />

      <button
        type="submit"
        disabled={guardando}
        className="w-full bg-gradient-to-b from-pink400 to-pink600 text-white font-semibold py-2.5 rounded-xl shadow-btn hover:brightness-110 active:translate-y-[1px] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {guardando ? "Guardando..." : "Guardar"}
      </button>

      {mensaje && (
        <p className="mt-3 text-pink700 font-medium text-center">{mensaje}</p>
      )}
    </form>
  );
}

