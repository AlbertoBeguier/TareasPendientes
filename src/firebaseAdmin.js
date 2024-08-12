import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';

// Cargar el archivo de credenciales desde la carpeta src/secrets
const serviceAccountPath = path.join(process.cwd(), 'src/secrets/tareasestudio-d66ad-firebase-adminsdk-bqjxn-b0626d958e.json');
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tareasestudio-d66ad.firebaseio.com" // URL de tu base de datos de Firestore
});

// Inicializar Firestore
const db = admin.firestore();

export { admin, db };
