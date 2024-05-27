const express = require ('express');
const router = express.Router();
const controladoresInstitucion = require('../controladores/controladoresInstitucion');
//Indicamos que cuando el url sea /institucion, aqui se van a manejar las operacion CRUD con las instituciones
router.route('/')
    .get(controladoresInstitucion.getAllInstituciones)
    .post(controladoresInstitucion.crearNuevaInstitucion)
    .patch(controladoresInstitucion.actualizarInstitucion)
    .delete(controladoresInstitucion.borrarInstitucion)

module.exports = router 