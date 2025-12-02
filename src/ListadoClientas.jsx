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
        {clientas.map((c) => (
          <li key={c.id} className="p-3 bg-pink-100 rounded">
            <Link to={`/clienta/${c.id}`}>{c.nombre}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}



