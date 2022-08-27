const jwt = require('jsonwebtoken')

/**
 * lista de rutas que no seran tenida en cuanta para verificar la autenticacion via _token
 */
const NOT_LOGGIN = [
    '/', '/loggin', '/adduser'
]

/**
 * Middleware para verificar la validez del _token y permitir el acceso al resto de las funcionalidades de la API
 * o retornar un mensaje de aviso dependiendo del tipo de error   
 */
const verifyTokenAccess = (req, res, next) => {

    if (NOT_LOGGIN.some(el => el === req.path)) {
        next();
    } else {
        const app = require('../../index')
        const token = req.headers['access-token'];

        if (token) {
            jwt.verify(token, app.get('key_pass'), (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválido!' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                mensaje: 'Token no proveído!'
            });
        }
    }
}

/**
 * @todo guarda en la variable global `user` el usuario autenticado en el Sistema mediente el _token
 * para utilizarlo en los trigger generados por *Sequelize* , se ejecuta este middleware cuando es solicitada
 * alguna accion de tipo `POST`, `PUT` o `DELETE`
 * 
 */
const triggerMiddleware = (req, res, next) => {
    const token = req.headers['access-token'];
    const app = require('../../index')
    if (token) {
        jwt.verify(token, app.get('key_pass'), (err, decoded) => {
            if (!err) {
                app.set('user', decoded.id)
                next();
            } else
                next()
        });
    } else
        next();
}


module.exports = {
    verifyTokenAccess,
    NOT_LOGGIN,
    triggerMiddleware
}