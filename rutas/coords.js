// rutas/coords.js
const express = require('express');
const router = express.Router();
const Instituciones = require('../modelos_datos/instituciones');

// Endpoint para obtener coordenadas
router.get('/', async (req, res) => {
  const { direccion } = req.query;
  if (!direccion) {
    return res.status(400).send('Se requiere la dirección de la institución');
  }

  try {
    const institucion = await Instituciones.findOne({ direccion });
    if (!institucion) {
      return res.status(404).send('Institución no encontrada');
    }
    res.json({ lat: institucion.lat, lng: institucion.lng });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;