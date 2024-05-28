require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const { logger } = require('./middleware/logger')
const manejadorError = require('./middleware/manejadorErrores')
const cookieParser = require('cookie-parser')
const opcionesCors = require('./config/opcionesCors')
const conectarBD = require('./config/bdConn')
const mongoose = require('mongoose')
const { logEventos } = require('./middleware/logger')
const PORT = process.env.PORT;
// app de express
const app = express();

//conectar a la bd
conectarBD();

//aplicamos el logger
app.use(logger)

//Aplicamos a la app nuestra configuracion para los origenes
app.use(cors(opcionesCors));

// indica que nuestro server va a aceptar datos json
app.use(express.json());

//USO DESPUES NO OLVIDAR
app.use(cookieParser())

//el url depende de el controlador de las rutas en este caso solo es el index
app.use('/', require('./rutas/root'));

//ruta para autentificacion
app.use('/aut', require('./rutas/rutasAut'))
//Url donde ocurren los CRUD de nuestras colecciones
app.use('/profesores', require('./rutas/rutasProfesor'))

app.use('/instituciones', require('./rutas/rutasInstitucion'))

//IMPORTANTE LUEGO USAR app.use PARA LOS CSS ARCHIVOS ESTATICOS


//Si se intenta a acceder a una ruta incorrecta, primero se le va
//a mandar a el html del error, si es por json, un json con el 
//mensaje aparece
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'vistas', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 no encontrado'})
    } else {
        res.type('txt').send('404 no encontrado')
    }
})

//prueba para que se mande a un html de inicio
app.get('^/$|/inicio(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'index.html'));
});

//Aqui se activa el manejador de errores que va a hacer logs de estos mismos
//La razon por la que esta abajo es para que pueda revisar la mayoria del proceso 
app.use(manejadorError)

//Verificamos que la coneccion a la bd fue exitosa con un listen a la app
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => {
        console.log('Server corriendo en el puerto: ' + PORT);
    });
})

//Checamos en la consola y registramos en el logger si hay un error
mongoose.connection.on('error', err => {
    console.log(err)
    logEventos(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        'mongoErrLog.log')
})

// exportamos la app en modulo
module.exports = app;