const Profesor = require('../modelos_datos/profesores')
const Instituciones = require('../modelos_datos/instituciones')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//GET
const getAllProfesores = asyncHandler(async (req, res) => {
    //Indicamos que profesores es igual al select menos la contrasena de profesores
    const profesores = await Profesor.find().select('-contrasena').lean()
    //Si no hay profesores un mensaje de error aparece
    if (!profesores?.length) {
        return res.status(404).json({ message: 'No se encontraron usuarios'})
    }
    //mostramos los profesores (GET)
    res.json(profesores)
})

//POST
const crearNuevoProfesor = asyncHandler(async (req, res) => {
    //Indicamos todos los campos que se necesitan ingresar
    const { nombre, apellidos, telefono, correoElectronico, contrasena, RFC, CURP} = req.body

    //Confirmar datos
    if (!nombre || !apellidos || !telefono || !correoElectronico || !contrasena || !RFC || !CURP) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS


    // Encriptar contrasena con bcrypt, el 10 indica la cantidad de rondas de sal que ayudan a desencriptar luego
    const contraEncriptada = await bcrypt.hash(contrasena, 10) 

    //Indicamos que nuestro nuevo profesor va a tener la contrasena nueva encriptada
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
    const {id, nombre, apellidos, telefono, correoElectronico, contrasena , RFC, CURP} = req.body

    //Confirmar datos
    if (!id || !nombre || !apellidos || !telefono || !correoElectronico || !contrasena || !RFC || !CURP) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    //Buscamos que un profesor exista
    const profesor = await Profesor.findById(id).exec()

    //En todo caso que no exista, un mensaje de error aparece
    if (!profesor) {
        return res.status(400).json({message: 'Profesor no encontrado'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS

    //Se actualizan los campos
    profesor.nombre = nombre
    profesor.apellidos = apellidos
    profesor.telefono = telefono
    profesor.correoElectronico = correoElectronico

    if (contrasena) {
        //Encriptar contrasena
        profesor.contrasena = await bcrypt.hash(contrasena, 10)
    }

    //guardamos el nuevo profesor
    const profesorActualizado = await profesor.save()

    //mensaje de confirmacion
    res.json({message: profesorActualizado.nombre + ' Actualizado'})
})

//DELETE
const borrarProfesor = asyncHandler(async (req, res) => {
    //para borrar se necesita el id de un profesor existente
    const { id } = req.body

    //Si no se tiene el id, mensaje de error aparece
    if (!id) {
        return res.status(400).json({message: 'Id de profesor requerido'})
    }

    //Se verifica la posibilidad de que un profesor ya tenga una institucion creada, se busca una institucion asociada con el id de profesor
    const instituciones = await Instituciones.findOne({profesor: id}).lean().exec()
    if (instituciones) {
        return res.status(400).json({message: 'El usuario tiene una institucion asignada'})
    }

    //se obtiene el profesor de la id ingresada
    const profesor = await Profesor.findById(id).exec()

    //Si no se encontro, mensaje de error aparece
    if (!profesor) {
        return res.status(400).json({message: 'Profesor no encontrado'})
    }
    //Se borra el profesor
    const resultado = await profesor.deleteOne()


    //mensaje de confirmacion
    const respuesta = 'Profesor ' + resultado.nombre + 'con ID ' + resultado.id + 'fue borrado'

    res.json(respuesta)
})
    //Exportamos 
module.exports = {
    getAllProfesores,
    crearNuevoProfesor,
    actualizarProfesor,
    borrarProfesor
}