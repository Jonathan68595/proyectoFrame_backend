const mongoose = require('mongoose')

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
   }
})



module.exports = mongoose.model('profesor', schemaProfesores)