const rateLimit = require('express-rate-limit')
const { logEventos } = require('./logger')

//Limitador de logins por ventanas en una ip

const loginLimitador = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, //Limita cada IP a 5 solicitudes de login por ventana por minuto (windowMs)
    message: //Mensaje que vamos a dar cuando se exceda el maximo intento de logins
        {
            message: 'Demasiados intentos de login de esta IP, intentar otra vez en 1 minuto'
        },
        //Parametros recomendados por la documentacion de express rate limit
    standardHeaders: true, //soporte a headers estandarizados
    legacyHeaders: false, //indicamos false por que default es true y solo sirve para info inecesaria
})

module.exports = loginLimitador