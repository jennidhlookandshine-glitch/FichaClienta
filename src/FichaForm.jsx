import React, { useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import FormularioDatosBasicos from "./FormularioDatosBasicos";

export default function FichaForm() {
  const [datosBasicos, setDatosBasicos] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const formularioRef = useRef(null); // opcional: para resetear desde el hijo si expones un método

  function normNombre(s = "") {
    return s.trim().replace(/\s+/g, " ");
  }
  function normTel(s = "") {
    return s.replace(/[^\d+]/g, "");
  }

  async function handleGuardar(e) {
    e.preventDefault();
    if (!datosBasicos) {
      alert("Faltan los datos de la clienta.");
      return;
    }

    const nombre = normNombre(datosBasicos.nombreCompleto || "");
    const servicio = (datosBasicos.servicio || "").trim();
    const fecha = datosBasicos.fechaAtencion || new Date().toISOString().slice(0, 10);

    if (!nombre) return alert("Ingresa el nombre de la clienta.");
    if (!servicio) return alert("Selecciona el servicio.");

    const telefonoLimpio = normTel(datosBasicos.telefono || "");
    const payload = {
      nombre,
      clienteLower: nombre.toLowerCase(),
      servicio,
      fecha,
      detalle: datosBasicos.observacionesProfesional || "",
      telefono: telefonoLimpio,
      creado_en: new Date().toISOString(), // si tienes columna timestampz en Supabase
    };

    try {
      setGuardando(true);
      const { error } = await supabase.from("Clientas").insert([payload]);
      if (error) {
        alert("Error al guardar ficha: " + error.message);
        return;
      }
      alert("Ficha guardada con éxito ✅");
      setDatosBasicos(null);
      // Si FormularioDatosBasicos expone un reset, úsalo:
      // formularioRef.current?.resetForm?.();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la ficha.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-[840px] mx-auto p-4">
      <form onSubmit={handleGuardar}>
        <FormularioDatosBasicos onChange={setDatosBasicos} ref={formularioRef} />
        <button
          type="submit"
          disabled={guardando}
          className="
            mt-4 px-5 py-2 rounded-xl font-bold text-white shadow-btn
            bg-gradient-to-b from-pink500 to-pink700
            hover:brightness-110 active:translate-y-[1px]
            disabled:opacity-60 disabled:cursor-not-allowed transition
          "
        >
          {guardando ? "Guardando..." : "Guardar ficha"}
        </button>
      </form>
    </div>
  );
}
