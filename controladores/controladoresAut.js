const Profesor = require('../modelos_datos/profesores')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

//ruta POST /aut
//acceso publico
//Login
const login = asyncHandler(async (req, res) => {
    const {correoElectronico, contrasena} = req.body

    if (!correoElectronico || !contrasena) {
        return res.status(400).json({ message: 'Se necesita ingresar todos los campos'})
    }

    const profesorEncontrado = await Profesor.findOne({correoElectronico}).exec()

    if (!profesorEncontrado) {
        return res.status(401).json({message: 'No se encontro la cuenta asociada'})
    }

    const comparar = await bcrypt.compare(contrasena, profesorEncontrado.contrasena)

    if (!comparar) {
        return res.status(401).json({message: 'No autorizado'})
    }

    //PARA FRONT MUY IMPORTANTE
    const tokenAcceso = jwt.sign(
        {
            "InformacionProfesor": {
                "nombre": profesorEncontrado.nombre,
                "apellidos": profesorEncontrado.apellidos,
                "instituciones": profesorEncontrado.institucion,
                "correoElectronico": profesorEncontrado.correoElectronico,
                "telefono":profesorEncontrado.telefono,
                "RFC": profesorEncontrado.RFC,
                "CURP": profesorEncontrado.CURP
            }
        },
        process.env.ACCESO_TOKEN_SECRETO,
        { expiresIn: '10s'} //SOLO PARA DESARROLLO LUEGO CAMBIAR A EJEM 15 MIN
    )

    const tokenRecarga = jwt.sign(
        {"correoElectronico": profesorEncontrado.correoElectronico,
         "nombre": profesorEncontrado.nombre
        },
        process.env.RECARGAR_TOKEN_SECRETO,
        { expiresIn: '1d'} //1 dia pero luego podemos cambiar
    )

    res.cookie('jwt', tokenRecarga, {
        httpOnly: true, //solo se puede acceder por un servidor web
        secure: true, //https
        sameSite: 'None', //cookies compartidos NO
        maxAge: 7 * 24 * 60 * 60 * 1000 //Se expira en una semana (va de dia a hora a minuto a seg a ms)
    })

    //Mandamos el token de acceso con los datos del profesor REACT NICE
    res.json({tokenAcceso})
})

//ruta GET /aut/recargar
//publico (jwt expira)
//recargar (refresh)
const recargar = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({message: 'No autorizado'}) //Si no contamos con cookie.jwt no se autoriza

    const tokenRecarga = cookies.jwt

    jwt.verify(
        tokenRecarga,
        process.env.RECARGAR_TOKEN_SECRETO,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({message: 'Prohibido'})
            
            const profesorEncontrado = await Profesor.findOne({correoElectronico: decoded.correoElectronico}).exec()

            if (!profesorEncontrado) return res.status(401).json({message: 'No autorizado'})

            const tokenAcceso = jwt.sign(
                {
                    "InformacionProfesor": {
                        "nombre": profesorEncontrado.nombre,
                        "apellidos": profesorEncontrado.apellidos,
                        "instituciones": profesorEncontrado.institucion,
                        "correoElectronico": profesorEncontrado.correoElectronico,
                        "telefono":profesorEncontrado.telefono,
                        "RFC": profesorEncontrado.RFC,
                        "CURP": profesorEncontrado.CURP
                    }
                },
                process.env.ACCESO_TOKEN_SECRETO,
                {expiresIn: '10s'} //SE VA A CAMBIAR
            )

            res.json({tokenAcceso})
        })
    )
}

//ruta POST /aut/logout
//Publica (eliminar cookies si existen)
//Logout
const logout = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204) //No hay contenido por que no tenemos cookies

    //Borramos los cookies cuando el usuario se logea afuera
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })

    res.json({message: 'Cookie borrada'})
}

module.exports = {
    login,
    recargar,
    logout
}