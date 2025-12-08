import { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export const ClientaContext = createContext(null);

export function ClientaProvider({ children }) {
  const [clientas, setClientas] = useState([]);
  const [nuevaFicha, setNuevaFicha] = useState(null);
  const [clientaSeleccionada, setClientaSeleccionada] = useState(null);

  // Cargar clientas en tiempo real
  useEffect(() => {
    const ref = collection(db, "clientas");

    const unsub = onSnapshot(ref, (snap) => {
      const arr = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          id: d.id,
          ...data,
          servicios: data.servicios || [],
          servicioResumen: data.servicioResumen || "Sin servicio aún",
        };
      });

      setClientas(arr);
      console.log("🔄 Clientas actualizadas:", arr.length);
    });

    return () => unsub();
  }, []);

  // Helper para dividir nombre completo
  function dividirNombreCompleto(nombreCompleto = "") {
    const limpio = nombreCompleto.trim();
    if (!limpio) return { nombre: "", apellido: "" };
    const partes = limpio.split(/\s+/);
    if (partes.length === 1) return { nombre: partes[0], apellido: "" };
    return { nombre: partes[0], apellido: partes.slice(1).join(" ") };
  }

  // GUARDAR NUEVA CLIENTA (ficha básica)
  const guardarFicha = async (ficha) => {
    const { nombre, apellido } = ficha.nombreCompleto
      ? dividirNombreCompleto(ficha.nombreCompleto)
      : {
          nombre: (ficha.nombre || "").trim(),
          apellido: (ficha.apellido || "").trim(),
        };

    const nombreLower = nombre.toLowerCase();
    const apellidoLower = apellido.toLowerCase();

    // Verificar duplicados
    const q = query(
      collection(db, "clientas"),
      where("nombreLower", "==", nombreLower),
      where("apellidoLower", "==", apellidoLower)
    );

    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("Esta clienta ya existe 😅");

    const dataFinal = {
      ...ficha,
      nombre,
      apellido,
      nombreLower,
      apellidoLower,
      clienteLower: `${nombre} ${apellido}`.toLowerCase().trim(),
      servicios: [],
      servicioResumen: "Sin servicio aún",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "clientas"), dataFinal);

    setNuevaFicha({
      id: docRef.id,
      ...dataFinal,
    });

    console.log("✅ Nueva clienta creada con ID:", docRef.id);
    return docRef.id;
  };

  // AGREGAR SERVICIO A CLIENTA EXISTENTE
  const agregarServicio = async (id, nuevoServicio) => {
    if (!id) throw new Error("ID de clienta requerido");

    console.log("🔧 AGREGANDO SERVICIO - ID:", id, "Servicio:", nuevoServicio);

    const ref = doc(db, "clientas", id);

    await updateDoc(ref, {
      servicios: arrayUnion(nuevoServicio),
      servicioResumen: nuevoServicio.servicio,
    });

    console.log("✅ Servicio agregado y resumen actualizado");
  };

  const agregarServicioAClienta = async (clientaId, servicio) => {
    await agregarServicio(clientaId, servicio);
  };

  // ACTUALIZAR CLIENTA (cambios generales, ya existente)
  const actualizarClienta = async (id, newData) => {
    const ref = doc(db, "clientas", id);
    await setDoc(ref, newData, { merge: true });

    setClientas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...newData } : c))
    );
  };

  // Alias más claro para actualizar datos básicos y médicos
  const editarClienta = async (id, dataParcial) => {
    await actualizarClienta(id, dataParcial);
  };

  // Editar un servicio por índice
  const editarServicio = async (clientaId, index, servicioActualizado) => {
    if (!clientaId) throw new Error("ID de clienta requerido");
    const ref = doc(db, "clientas", clientaId);

    // 1) Leer documento actual
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("La clienta no existe");

    const data = snap.data() || {};
    const serviciosActuales = Array.isArray(data.servicios)
      ? [...data.servicios]
      : [];

    // 2) Reemplazar el servicio en el índice
    serviciosActuales[index] = servicioActualizado;

    // 3) Guardar array completo de nuevo
    await updateDoc(ref, {
      servicios: serviciosActuales,
      servicioResumen: servicioActualizado.servicio || data.servicioResumen,
    });

    // 4) Actualizar en el estado local
    setClientas((prev) =>
      prev.map((c) =>
        c.id === clientaId
          ? {
              ...c,
              servicios: serviciosActuales,
              servicioResumen:
                servicioActualizado.servicio || c.servicioResumen,
            }
          : c
      )
    );
  };

  // ELIMINAR SERVICIO POR ÍNDICE
  const eliminarServicio = async (clientaId, index) => {
    if (!clientaId) throw new Error("ID de clienta requerido");
    const ref = doc(db, "clientas", clientaId);

    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("La clienta no existe");

    const data = snap.data() || {};
    const serviciosActuales = Array.isArray(data.servicios)
      ? [...data.servicios]
      : [];

    // quitar el servicio en ese índice
    serviciosActuales.splice(index, 1);

    const nuevoResumen =
      serviciosActuales[serviciosActuales.length - 1]?.servicio ||
      "Sin servicio aún";

    await updateDoc(ref, {
      servicios: serviciosActuales,
      servicioResumen: nuevoResumen,
    });

    setClientas((prev) =>
      prev.map((c) =>
        c.id === clientaId
          ? {
              ...c,
              servicios: serviciosActuales,
              servicioResumen: nuevoResumen,
            }
          : c
      )
    );
  };

  // BUSCAR CLIENTA POR ID
  const obtenerClientaPorId = (id) => {
    if (!id) return null;
    return clientas.find((c) => String(c.id) === String(id)) || null;
  };

  // LIMPIAR ESTADOS
  const limpiarNuevaFicha = () => setNuevaFicha(null);
  const limpiarClientaSeleccionada = () => setClientaSeleccionada(null);
  const seleccionarClienta = (clienta) => setClientaSeleccionada(clienta);

  return (
    <ClientaContext.Provider
      value={{
        clientas,
        setClientas,
        guardarFicha,
        agregarServicio,
        agregarServicioAClienta,
        actualizarClienta,
        editarClienta,
        editarServicio,
        eliminarServicio,
        nuevaFicha,
        setNuevaFicha,
        limpiarNuevaFicha,
        clientaSeleccionada,
        setClientaSeleccionada,
        seleccionarClienta,
        limpiarClientaSeleccionada,
        obtenerClientaPorId,
      }}
    >
      {children}
    </ClientaContext.Provider>
  );
}

export function useClienta() {
  const context = useContext(ClientaContext);
  if (!context) {
    throw new Error("useClienta debe usarse dentro de ClientaProvider");
  }
  return context;
}

