const jwt = require('jsonwebtoken'),
    UserModel = require('../models/userSystem'),
    crypto = require('crypto')

const Unidad = require('../models/unidad')
const Cargo = require('../models/cargo')

const UserHandlerRouter = {

    getUsers: async (req, res) => {
        try {
            const user = await UserModel.findAll({
                include: [{ model: Unidad, attributes: ['id', 'siglas'] }, { model: Cargo, attributes: ['id', 'nombre'] }]
            })

            const retorno = await user.map(el => {
                return {
                    id: el._id,
                    user: el.user,
                    full_name: el.full_name,
                    rol: el.rol,
                    unidad: el.unidad,
                    cargo: el.cargo
                }
            })

            res.json(retorno)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    newUser: async (req, res) => {
        try {
            const { user, full_name, pass, rol, unidad, cargo } = req.body
            const cryptoPass = crypto.createHmac('sha256', pass).digest('hex')
            
            const _obj = await UserModel.create({
                user, full_name, pass: cryptoPass, rol, unidadId: unidad, cargoId: cargo
            })
            const inst__unidad = await Unidad.findOne({ attributes: ['id', 'siglas'], where: { id: unidad } })
            const inst__cargo = await Cargo.findOne({ attributes: ['id', 'nombre'], where: { id: cargo } })

            res.json({
                id: _obj._id, user: _obj.user,
                full_name: _obj.full_name, rol: _obj.rol,
                unidad: inst__unidad,
                cargo: inst__cargo
            })

        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const _id = req.params.id
            const data = req.body
            const cryptoPass = data.change_pass ? crypto.createHmac('sha256', data.pass).digest('hex') : ''

            const inst__unidad = await Unidad.findOne({ attributes: ['id', 'siglas'], where: { id: data.unidad } })
            const inst__cargo = await Cargo.findOne({ attributes: ['id', 'nombre'], where: { id: data.cargo } })

            let inst__user = await UserModel.findByPk(_id, { include: ['unidad', 'cargo'] })
            inst__user.user = data.user
            inst__user.full_name = data.full_name
            inst__user.rol = data.rol
            inst__user.set('unidadId', data.unidad)
            inst__user.set('cargoId', data.cargo)

            if (data.change_pass)
                inst__user.pass = cryptoPass

            inst__user.save()
            res.json(
                {
                    user: inst__user.user, full_name: inst__user.full_name, rol: inst__user.rol,
                    unidad: inst__unidad, cargo: inst__cargo
                })

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const _id = req.params.id
            const user = await UserModel.destroy({ where: { _id } })
            res.json(user)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    }
    ,
    /**
     * buscar si el user y pass coinciden y retpornar el Objeto
     * ```{ user, full_name, pass, rol, id, _token}```
     */
    loggin: async (req, res) => {

        const app = require('../../index')
        const { user, pass } = req.body
        const cryptoPass = crypto.createHmac('sha256', pass).digest('hex')
        let resp = { message: "acceso denegado, credenciales incorrectas!" }

        const logginUser = await UserModel.findOne({ where: { user, pass: cryptoPass } })

        if (logginUser) {
            const payload = {
                user,
                id: logginUser._id,
                check: true
            };
            const _token = jwt.sign(payload, app.get('key_pass'), {
                expiresIn: "1 d" // 1800 s = 30min tiempo de expiracion del _token    1 d - 1 dia
            });
            resp = {
                user: logginUser.user,
                full_name: logginUser.full_name,
                rol: logginUser.rol,
                id: logginUser._id,
                _token
            }
            res.status(200).send(resp)
        }
        else
            res.status(301).send(resp)
    },

    /**
     * retornar los datos del usuario mediante un **_token** y un **idUsuario**
     */
    getDataByToken: async (req, res) => {

        const _id = req.body.id

        const datauser = await UserModel.findByPk(_id)
        if (datauser) {
            res.status(200).send({
                user: req.body.user,
                full_name: datauser.full_name,
                rol: datauser.rol
            })
        } else
            res.status(301).send({ message: "no existe el usuario" })
    }
}

module.exports = UserHandlerRouter