const Profesor = require('../modelos_datos/profesores')
const Instituciones = require('../modelos_datos/instituciones')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//GET
const getAllProfesores = asyncHandler(async (req, res) => {
    const profesores = await Profesor.find().select('-contrasena').lean()
    if (!profesores?.length) {
        return res.status(404).json({ message: 'No se encontraron usuarios'})
    }
    res.json(profesores)
})

//POST
const crearNuevoProfesor = asyncHandler(async (req, res) => {
    const { nombre, apellidos, telefono, correoElectronico, contrasena, RFC, CURP} = req.body

    //Confirmar datos
    if (!nombre || !apellidos || !telefono || !correoElectronico || !contrasena || !RFC || !CURP) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS


    // Encriptar contrasena
    const contraEncriptada = await bcrypt.hash(contrasena, 10) //rondas de sal

    const objetoProfesor = { nombre, apellidos, telefono, correoElectronico, "contrasena": contraEncriptada, RFC, CURP}

    //Crear y guardar nuevo profesor
    const profesor = await Profesor.create(objetoProfesor)

    if (profesor) { //Fue creado
        res.status(201).json({message: 'Nuevo profesor ' + nombre + ' ' + apellidos + ' creado'})
    } else {
        res.status(400).json({message: 'Datos invalidos recibidos'})
    }
})

//UPDATE
const actualizarProfesor = asyncHandler(async (req, res) => {
    const {id, nombre, apellidos, telefono, correoElectronico, /*contrasena ,*/ RFC, CURP} = req.body

    //Confirmar datos
    if (!id || !nombre || !apellidos || !telefono || !correoElectronico || /*!contrasena ||*/ !RFC || !CURP) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    const profesor = await Profesor.findById(id).exec()

    if (!profesor) {
        return res.status(400).json({message: 'Profesor no encontrado'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS

    profesor.nombre = nombre
    profesor.apellidos = apellidos
    profesor.telefono = telefono
    profesor.correoElectronico = correoElectronico

    /*if (contrasena) {
        //Encriptar contrasena
        profesor.contrasena = await bcrypt.hash(contrasena, 10)
    }*/

    const profesorActualizado = await profesor.save()

    res.json({message: profesorActualizado.nombre + ' Actualizado'})
})

//DELETE
const borrarProfesor = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({message: 'Id de profesor requerido'})
    }

    const instituciones = await Instituciones.findOne({profesor: id}).lean().exec()
    if (instituciones) {
        return res.status(400).json({message: 'El usuario tiene una institucion asignada'})
    }

    const profesor = await Profesor.findById(id).exec()

    if (!profesor) {
        return res.status(400).json({message: 'Profesor no encontrado'})
    }

    const resultado = await profesor.deleteOne()

    const respuesta = 'Profesor ' + resultado.nombre + 'con ID ' + resultado.id + 'fue borrado'

    res.json(respuesta)
})

module.exports = {
    getAllProfesores,
    crearNuevoProfesor,
    actualizarProfesor,
    borrarProfesor
}