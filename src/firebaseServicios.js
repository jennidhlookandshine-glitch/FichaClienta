import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Guarda un servicio completo para una clienta
export async function guardarServicio(clientaId, tipoServicio, form, nombre, telefono) {
  const ref = doc(db, "clientas", clientaId);

  try {
    // Intentar agregar servicio a clienta existente
    await updateDoc(ref, {
      [`servicios.${tipoServicio}`]: arrayUnion({ ...form, fecha: new Date().toISOString() })
    });
  } catch (error) {
    // Si la clienta no existe, crear el documento
    await setDoc(ref, {
      nombre,
      telefono,
      servicios: {
        [tipoServicio]: [{ ...form, fecha: new Date().toISOString() }]
      }
    });
  }

  console.log(`${tipoServicio} guardado para ${nombre}`);
}
