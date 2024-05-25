const mongoose = require('mongoose')

const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.PROFESORES_DB_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = conectarBD