import { useContext } from "react";
import { ClientaContext } from "./ClientaContext";
import { Link } from "react-router-dom";

export default function ListadoClientas() {
  const { clientas } = useContext(ClientaContext);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Lista de Clientas</h1>

      {clientas.length === 0 && <p>No hay clientas registradas aún.</p>}

      <ul className="space-y-2">
        {clientas.map((c) => {
          const nombre = c.nombreCompleto || c.nombre || "Sin nombre";
          const servicioResumen =
            c.servicioResumen ||
            (Array.isArray(c.servicios) && c.servicios.length > 0
              ? c.servicios[0].nombre || "Primer servicio registrado"
              : "Servicio no especificado");

          return (
            <li key={c.id} className="p-3 bg-pink-100 rounded">
              <Link
                to={`/clienta/${c.id}`}
                state={{ clienta: c }} // ← pasa todos los datos a la pantalla de detalle
                className="flex flex-col"
              >
                <span className="font-semibold">{nombre}</span>
                <span className="text-sm text-gray-600">
                  {servicioResumen}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


