const express = require ('express');
const router = express.Router();
const controladoresProfesores = require('../controladores/controladoresProfesores');

//Indicamos que cuando la direccion sea /profesores se van a manejar las operaciones CRUD sobre las instituciones
//Esto va a cambiar despues
router.route('/')
    .get(controladoresProfesores.getAllProfesores)
    .post(controladoresProfesores.crearNuevoProfesor)
    .patch(controladoresProfesores.actualizarProfesor)
    .delete(controladoresProfesores.borrarProfesor)

module.exports = router 