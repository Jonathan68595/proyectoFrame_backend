const mongoose = require('mongoose')

   //Schema para nuestra coleccion instituciones
const schemaInstituciones = new mongoose.Schema({
   nombre: {
    type: String,
    required: true
   },
   direccion: {
    type: String,
    required: true
   }, 
   telefono: {
    type: String,
    required: true
   },
   materias: {
    type: String,
    required: true,
    unique: true
   },
   //Este profesor ya es creado y esta asociado con su id 
   profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profesor',
    required: true
   }
}, 
   {
    timestamps: true 
})


module.exports = mongoose.model('instituciones', schemaInstituciones)

//LUEGO CAMBIAR MATERIAS A ARRAY Y QUE SE REFLEJE EN EL CONTROLADOR[{}]