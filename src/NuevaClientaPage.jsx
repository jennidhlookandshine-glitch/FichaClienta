import React from "react";
import { useClienta } from "./ClientaContext";
import FormNuevaClienta from "./FormularioClienta";

export default function NuevaClientaPage() {
  const { guardarFicha } = useClienta();

  return (
    <div className="min-h-screen bg-pink50 py-8">
      <h1 className="text-center text-2xl font-bold text-pink700 mb-6">
        Nueva clienta
      </h1>
      <FormNuevaClienta onGuardar={guardarFicha} />
    </div>
  );
}
