const mongoose = require('mongoose')

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
   profesor: {
    type: Schema.Types.ObjectId,
    ref: 'profesor',
    required: true
   }
}, 
   {
    timestamps: true 
})

module.exports = mongoose.model(instituciones, schemaInstituciones)