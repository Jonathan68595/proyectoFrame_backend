const origenesPermitidos = require('./origenesPermitidos')

const opcionesCors = {
    origin: (origin, callback) => {
        if (origenesPermitidos.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    },
    credentials: true,
    optionSuccesStatus: 200
}

module.exports = opcionesCors