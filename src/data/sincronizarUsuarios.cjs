const admin = require("firebase-admin");

// Ruta al archivo de clave privada
const serviceAccount = require("C:/Users/Usuario/Desktop/Proyectos/shinobi-legacy-51247-firebase-adminsdk-fbsvc-0f5153ef7c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const medallasPorDefecto = [
  { nombre: "Fundador", visible: true },
  { nombre: "Administrador", visible: true },
];

async function migrarMedallasPersonalizadas() {
  const usuarios = [];

  async function listarUsuarios(nextPageToken) {
    const result = await auth.listUsers(1000, nextPageToken);
    usuarios.push(...result.users);

    if (result.pageToken) {
      return listarUsuarios(result.pageToken);
    }
  }

  await listarUsuarios();

  console.log(`🔎 Total de usuarios encontrados: ${usuarios.length}`);

  for (const user of usuarios) {
    const uid = user.uid;
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.log(`⚠️ Usuario ${uid} no tiene documento. Saltando.`);
      continue;
    }

    const data = userSnap.data();

    if (!data.medallasPersonalizadas) {
      await userRef.update({
        medallasPersonalizadas: medallasPorDefecto,
      });
      console.log(`✅ Usuario ${uid} actualizado con medallas por defecto.`);
    } else {
      console.log(`— Usuario ${uid} ya tiene medallas.`);
    }
  }

  console.log("🎉 Migración finalizada correctamente.");
}

migrarMedallasPersonalizadas().catch((err) => {
  console.error("❌ Error durante la migración:", err);
});
