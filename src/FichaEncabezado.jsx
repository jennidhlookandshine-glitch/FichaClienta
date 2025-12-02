import { useState } from "react";

export default function FichaEncabezado({ onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      onGuardar({ nombre, fecha });
      setNombre("");
      setFecha("");
      setEnviando(false);
    }, 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 max-w-sm mx-auto flex flex-col gap-4 bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-soft border border-pink-200"
    >
      <h2 className="text-xl font-semibold text-pink-700 text-center mb-2">
        Nueva Ficha
      </h2>

      <label className="text-sm font-medium text-gray-700">
        Nombre de la clienta
      </label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: Daniela Soto"
        required
      />

      <label className="text-sm font-medium text-gray-700">
        Fecha de atención
      </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={enviando}
        className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-xl shadow-btn transform transition hover:scale-105 disabled:opacity-60"
      >
        {enviando ? "Guardando..." : "Guardar ficha"}
      </button>
    </form>
  );
}