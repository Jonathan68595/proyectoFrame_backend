const express = require ('express');
const router = express.Router();
const controladoresProfesores = require('../controladores/controladoresProfesores');

router.route('/')
    .get(controladoresProfesores.getAllProfesores)
    .post(controladoresProfesores.crearNuevoProfesor)
    .patch(controladoresProfesores.actualizarProfesor)
    .delete(controladoresProfesores.borrarProfesor)

module.exports = router 