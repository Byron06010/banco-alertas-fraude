const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Bajo', 'Medio', 'Alto'], default: 'Medio' },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pendiente', 'Bloqueada', 'Aprobada'], default: 'Pendiente' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);