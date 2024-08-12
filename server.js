import express from 'express';
import { admin, db } from './src/firebaseAdmin.js'; // Asegúrate de usar la extensión .js

const app = express();
app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.json({ message: 'Usuario registrado exitosamente', userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error });
  }
});

// Ruta para agregar una tarea en Firestore
app.post('/tasks', async (req, res) => {
  const { userId, task } = req.body;

  try {
    await db.collection('users').doc(userId).collection('tasks').add(task);
    res.json({ message: 'Tarea creada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la tarea', error });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

