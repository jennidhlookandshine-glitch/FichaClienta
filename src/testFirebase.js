import { db, storage } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

async function probarFirebase() {
  try {
    console.log("🟢 Conectando a Firebase...");

    // 1️⃣ Probar Firestore: agregar y leer un documento temporal
    const docRef = await addDoc(collection(db, "prueba_conexion"), {
      mensaje: "Hola Jenni 💅 conexión exitosa!",
      fecha: new Date().toISOString(),
    });

    console.log("✅ Firestore OK. ID del documento:", docRef.id);

    const querySnapshot = await getDocs(collection(db, "prueba_conexion"));
    querySnapshot.forEach((doc) => {
      console.log("📄 Documento:", doc.id, "=>", doc.data());
    });

    // 2️⃣ Probar Storage
    if (storage) {
      console.log("✅ Storage OK. Conectado correctamente.");
    } else {
      console.error("❌ Error: Storage no inicializado.");
    }

    console.log("🔥 Todo funcionando perfectamente 😍");

  } catch (err) {
    console.error("❌ Error al conectar con Firebase:", err);
  }
}

probarFirebase();
