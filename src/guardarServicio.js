import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

// Guarda un servicio completo para una clienta EXISTENTE
export async function guardarServicio(clientaId, tipoServicio, form) {
  const ref = doc(db, "clientas", clientaId);

  const hoy = new Date();
  const fechaBonita = hoy.toLocaleDateString("es-CL");

  const nuevoServicio = {
    tipo: tipoServicio,          // ej: "lifting", "depilacion_facial"
    servicio: form.servicio,     // texto visible: "Lifting de pestañas"
    fecha: fechaBonita,
    detalle: form.detalle || "",

    // todos los campos específicos del formulario
    ...form,
  };

  await updateDoc(ref, {
    servicios: arrayUnion(nuevoServicio),
  });

  console.log(`${tipoServicio} guardado para clienta ${clientaId}`);
}
