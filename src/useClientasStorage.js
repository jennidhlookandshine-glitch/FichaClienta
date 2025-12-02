import { useState, useEffect } from "react";

export default function useClientasStorage() {
  const [clientas, setClientas] = useState([]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const data = localStorage.getItem("clientas");
    if (data) {
      setClientas(JSON.parse(data));
    }
  }, []);

  // Guardar cuando cambie
  useEffect(() => {
    localStorage.setItem("clientas", JSON.stringify(clientas));
  }, [clientas]);

  const agregarClienta = (clienta) => {
    setClientas((prev) => [...prev, { id: Date.now(), ...clienta }]);
  };

  return { clientas, agregarClienta };
}
