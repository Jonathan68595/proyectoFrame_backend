const mongoose = require('mongoose')

//Nos conectamos a la bd de mongodb mediante el uri que ya establecimos en el .env
const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.PROFESORES_DB_URI)
    } catch (err) {
        console.log(err)
    }
}

//exportamos
module.exports = conectarBD