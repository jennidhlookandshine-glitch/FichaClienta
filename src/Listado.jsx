import React, { useEffect, useState } from "react";
import CardGradient from "./CardGradient";

export default function Listado({ clienteInicial = "" }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);
    setError("");
    const mock = [
      { id: "1", servicio: "extensiones", cliente: "Ana", fecha: "2025-11-01", detalle: "Clásica natural" },
      { id: "2", servicio: "extensiones", cliente: "Bárbara", fecha: "2025-11-03", detalle: "Volumen cat" },
      { id: "3", servicio: "extensiones", cliente: "Carla", fecha: "2025-11-05", detalle: "Mega muñeca" },
    ];
    const filtrado = clienteInicial
      ? mock.filter((x) => x.cliente.toLowerCase().includes(clienteInicial.toLowerCase()))
      : mock;
    const t = setTimeout(() => {
      setItems(filtrado);
      setCargando(false);
    }, 300);
    return () => clearTimeout(t);
  }, [clienteInicial]);

  return (
    <div className="max-w-[840px] mx-auto my-4">
      <CardGradient title="Listado" subtitle={clienteInicial ? `Filtro: ${clienteInicial}` : "Sin filtro de clienta"}>
        {cargando && <div>Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!cargando && !error && items.length === 0 && <div>No hay registros para mostrar.</div>}

        {!cargando && !error && items.length > 0 && (
          <ul className="grid gap-2">
            {items.map((it) => (
              <li key={it.id} className="border border-pink600/20 bg-white rounded-[10px] p-3">
                <div className="font-bold">{it.cliente}</div>
                <div className="text-sm text-[#666]">{(it.servicio || "extensiones")} • {(it.fecha || "-")}</div>
                <div className="text-[0.95rem]">{it.detalle || "-"}</div>
              </li>
            ))}
          </ul>
        )}
      </CardGradient>
    </div>
  );
}
