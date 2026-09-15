const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Alert = require('./models/Alert');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Servir la carpeta public automáticamente en la ruta raíz '/'
app.use(express.static('public'));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB Atlas! 🚀'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Ruta para CREAR una nueva alerta de fraude
app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la alerta', details: error.message });
  }
});

// Ruta para OBTENER todas las alertas
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las alertas', details: error.message });
  }
});
// Ruta para ACTUALIZAR el estado de una alerta (ej: cambiar a 'Bloqueada' o 'Aprobada')
app.put('/api/alerts/:id', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updatedAlert);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la alerta', details: error.message });
  }
});

// Ruta para ELIMINAR una alerta
app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alerta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la alerta', details: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});