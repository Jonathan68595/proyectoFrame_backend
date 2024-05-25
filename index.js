const app = require("./server.js");
const mongodb = require("mongodb");
const dotenv = require("dotenv");

// para acceder al .env
dotenv.config();

// coneccion a la db
const MongoClient = mongodb.MongoClient;

// referencia al puerto en el archivo .env
const port = process.env.PORT || 8000;

// coneccion de la db usando el uri de mongodb atlas
MongoClient.connect(
    process.env.PROFESORES_DB_URI,
    {
        useNewUrlParser: true,
    }
) // si hay un error el proceso se termina
.catch(err => {
    console.error(err.stack);
    process.exit(1);
}) // si no, se establece la coneccion y se verifica con un mensaje
.then(async client => {
    app.listen(port, () => {
        console.log('escuchando en el puerto: ' + port);
    });
});