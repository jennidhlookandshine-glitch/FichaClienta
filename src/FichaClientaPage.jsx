import { useParams } from "react-router-dom";
import { useClienta } from "./ClientaContext";
import FichaAppLayout from "./FichaAppLayout";

export default function FichaClientaPage() {
  const { id } = useParams();
  const { clientas } = useClienta();

  const clienta = clientas.find((c) => String(c.id) === String(id));

  if (!clienta) {
    return (
      <p className="text-center p-6 text-pink-600 font-semibold">
        No se encontró esta ficha.
      </p>
    );
  }

  return (
    <FichaAppLayout title={`Ficha de ${clienta.nombre}`}>
      <div className="space-y-5 p-4 text-[16px]">

        {/* INFO GENERAL */}
        <div className="bg-white/70 p-4 rounded-xl shadow border border-pink-300/40">
          <h2 className="text-xl font-semibold text-pink-700 mb-3">
            Información General
          </h2>

          <p><strong>Nombre:</strong> {clienta.nombre}</p>
          <p><strong>Teléfono:</strong> {clienta.telefono || "—"}</p>
          <p><strong>Correo:</strong> {clienta.correo || "—"}</p>
          <p><strong>Primera visita:</strong> {clienta.fecha || "—"}</p>
        </div>

        {/* SERVICIOS */}
        <div className="bg-white/70 p-4 rounded-xl shadow border border-pink-300/40">
          <h2 className="text-xl font-semibold text-pink-700 mb-3">
            Servicios Realizados
          </h2>

          {clienta.servicios?.length ? (
            <ul className="list-disc pl-6 space-y-2">
              {clienta.servicios.map((s, i) => (
                <li key={i}>
                  <strong>{s.servicio}</strong>
                  {s.fecha && ` — ${s.fecha}`}
                  {s.detalle && (
                    <p className="text-sm opacity-80 mt-1">{s.detalle}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay servicios registrados aún.</p>
          )}
        </div>

        {/* OBSERVACIONES */}
        {clienta.observaciones && (
          <div className="bg-white/70 p-4 rounded-xl shadow border border-pink-300/40">
            <h2 className="text-xl font-semibold text-pink-700 mb-3">
              Observaciones
            </h2>
            <p className="whitespace-pre-line">{clienta.observaciones}</p>
          </div>
        )}
      </div>
    </FichaAppLayout>
  );
}





