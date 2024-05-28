const express = require('express')
const router = express.Router
const controladoresAut = require('../controladores/controladoresAut')
const loginLimitador = require('../middleware/loginLimitador')

//ruta /auth
router.route('/')
    .post(loginLimitador, controladoresAut.login)

router.route('/recargar')
    .get(controladoresAut.recargar)

router.route('/logout')
    .post(controladoresAut.logout)

module.exports = router