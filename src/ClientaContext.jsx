import { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export const ClientaContext = createContext();

export function ClientaProvider({ children }) {
  const [clientas, setClientas] = useState([]);

  // 🔹 Estado para la ficha temporal
  const [nuevaFicha, setNuevaFicha] = useState(null);

  // 🔹 Cargar clientas desde Firebase
  useEffect(() => {
    async function cargar() {
      const snap = await getDocs(collection(db, "clientas"));
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setClientas(arr);
    }
    cargar();
  }, []);

  // 🔹 Guardar ficha completa como una nueva clienta
  const guardarFicha = async (ficha) => {
    const ref = doc(collection(db, "clientas"));
    await setDoc(ref, ficha);

    // Agregar a la lista local
    setClientas((prev) => [...prev, { id: ref.id, ...ficha }]);

    return ref.id;
  };

  // 🔹 Actualizar clienta existente
  const actualizarClienta = async (id, newData) => {
    const ref = doc(db, "clientas", id);
    await setDoc(ref, newData, { merge: true });

    setClientas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...newData } : c))
    );
  };

  // 🔹 Limpiar ficha temporal
  const limpiarNuevaFicha = () => setNuevaFicha(null);

  return (
    <ClientaContext.Provider
      value={{
        clientas,
        setClientas,
        agregarClienta: guardarFicha, // Alias para compatibilidad
        actualizarClienta,
        nuevaFicha,
        setNuevaFicha,
        guardarFicha,
        limpiarNuevaFicha,
      }}
    >
      {children}
    </ClientaContext.Provider>
  );
}

export function useClienta() {
  return useContext(ClientaContext);
}





