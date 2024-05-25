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

app.use(cors(opcionesCors));
// indica que nuestro server va a aceptar datos json
app.use(express.json());

app.use(cookieParser())

//el url depende de el controlador de las rutas
app.use('/', require('./rutas/root'));

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

app.get('^/$|/inicio(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'inicio.html'));
});

// rutas
// El url de el sitio
//app.use("/api/v1/profesores", profesores);
// En caso de que se vayan a otra url mandar un 404 status, el * indica el wildcard
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