// utils/asignarMedallas.js
import Medallas from "../data/Medallas";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export async function evaluarYAsignarMedallas(usuario) {
  const nuevasMedallas = [];

  Medallas.forEach((medalla) => {
    if (medalla.tipo === "automatico" && medalla.criterio(usuario)) {
      if (!usuario.medallas?.includes(medalla.nombre)) {
        nuevasMedallas.push(medalla.nombre);
      }
    }
  });

  if (nuevasMedallas.length > 0) {
    const userRef = doc(db, "users", usuario.uid);
    await updateDoc(userRef, {
      medallas: arrayUnion(...nuevasMedallas),
    });
  }
}
