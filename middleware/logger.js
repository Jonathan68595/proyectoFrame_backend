const {format} = require('date-fns')
const { v4: uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEventos = async (message, logFileName) => {
    //esta variable es la que va a contener la fecha y tiempo formateada a nuestro gusto
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    //uuid sirve para dar un unico id al log, esto es lo que va a aparecer en el log
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    //este try va a verificar que exista un folder logs y si no lo va a crear
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }
        const logFilePath = path.join(logsDir, logFileName);
        await fsPromises.appendFile(logFilePath, logItem);
    } catch (err) {
        console.log(err);
    }        
}

const logger = (req, res, next) => {
    logEventos(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEventos, logger}