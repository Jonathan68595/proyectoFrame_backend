const mongoose = require('mongoose')

   //Schema para nuestra coleccion profesores
const schemaProfesores = new mongoose.Schema({
   nombre: {
    type: String,
    required: true
   },
   apellidos: {
    type: String,
    required: true
   }, 
   telefono: {
    type: String,
    required: true
   },
   correoElectronico: {
    type: String,
    required: true,
    unique: true
   },
   contrasena: {
    type: String,
    required: true
   },
   RFC: {
    type: String,
    required: true,
    unique: true
   },
   CURP: {
    type: String,
    required: true,
    unique: true
   },
   institucion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'instituciones',
      required: false //No es obligatorio tener una institucion registrada
     }
   }, {
      timestamps: true  
})



module.exports = mongoose.model('profesor', schemaProfesores)