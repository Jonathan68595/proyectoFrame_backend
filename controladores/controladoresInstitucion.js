const Profesor = require('../modelos_datos/profesores')
const Instituciones = require('../modelos_datos/instituciones')
const asyncHandler = require('express-async-handler')


//GET
const getAllInstituciones = asyncHandler(async (req, res) => {
    //Si no hay instituciones mensaje de error
    const instituciones = await Instituciones.find().lean() 
    if (!instituciones?.length) {
        return res.status(404).json({ message: 'No se encontraron instituciones'})
    }
    //Investigar Promise.all map y documentar
    const institucionYProfesorAsignado = await Promise.all(instituciones.map(async(instituciones) => {
        const profesor = await Profesor.findById(instituciones.profesor).lean().exec()
        return {...instituciones, nombre: profesor.nombre}
    }))
    res.json(institucionYProfesorAsignado)
})

//FALTA INDICAR QUE materias ES UN ARRAY
//POST
const crearNuevaInstitucion = asyncHandler(async (req, res) => {
    const { nombre, direccion, telefono, materias} = req.body

    //Confirmar datos
    if (!nombre || !direccion || !telefono || !materias) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS
    
    //Creamos una nueva institucion
    const institucion = await Instituciones.create({ nombre, direccion, telefono, materias})

    if (institucion) { //Fue creada
        res.status(201).json({message: 'Nueva institucion ' + nombre + ' creada'})
    } else {
        res.status(400).json({message: 'Datos invalidos recibidos'})
    }
})

//UPDATE
const actualizarInstitucion = asyncHandler(async (req, res) => {
    const {id, nombre, direccion, telefono, materias} = req.body

    //Confirmar datos
    if (!id || !nombre || !direccion || !telefono || !materias) {
        return res.status(400).json({message: 'Se necesitan ingresar todos los campos'})
    }

    //Verificamos que una institucion existe mediante un id previamente creado
    const institucion = await Instituciones.findById(id).exec()

    if (!institucion) {
        return res.status(400).json({message: 'Institucion no encontrada'})
    }

    //POSIBLE QUE FALTE UN CASO PARA ENCONTRAR DUPLICADOS


    //Actualizamos los datos
    institucion.nombre = nombre
    institucion.direccion = direccion
    institucion.telefono = telefono
    institucion.materias = materias

    //Se guarda esta nueva version de la institucion
    const institucionActualizada = await institucion.save()

    //Un mensaje confirma que se actualizo exitosamente
    res.json({message: institucionActualizada.nombre + ' Actualizada'})
})

//DELETE
const borrarInstitucion = asyncHandler(async (req, res) => {
    //El delete solo se puede realizar ingresando el id de esta institucion
    const { id } = req.body
    //confirmacion de datos
    if (!id) {
        return res.status(400).json({message: 'Id de institucion requerido'})
    }

    //Se confirma que una institucion con el id ingresado exista
    const institucion = await Instituciones.findById(id).exec()

    //En caso de que no se encontro la institucion
    if (!institucion) {
        return res.status(400).json({message: 'Institucion no encontrada'})
    }


    //borramos la institucion
    const resultado = await institucion.deleteOne()

    //Mensaje de borrado exitoso
    const respuesta = 'Institucion ' + resultado.nombre + 'con ID ' + resultado.id + ' fue borrada'

    res.json(respuesta)
})

module.exports = {
    getAllInstituciones,
    crearNuevaInstitucion,
    actualizarInstitucion,
    borrarInstitucion
}