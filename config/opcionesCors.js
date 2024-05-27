const origenesPermitidos = require('./origenesPermitidos') //importamos nuestra lista de origenes permitidos

//Aqui se verifica si el origen que se esta interactuando con nuestra app esta en la lista es permitido
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
//Investigar mas sobre Cors!!
//exportamos
module.exports = opcionesCors