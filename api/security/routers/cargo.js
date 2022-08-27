const cargoModel = require('../models/cargo')

module.exports = {
    getAll: async (req, res) => {
        try {
            const cargo = await cargoModel.findAll({order:[['nombre','asc']]})
            res.json(cargo)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }

    },
    create: async (req, res) => {
        try {
            const newu = await cargoModel.create(req.body)
            res.json(newu)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params
            const un = await cargoModel.update(req.body, { where: { id } })
            res.json(un)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const un = await cargoModel.destroy({ where: { id } })
            res.json(un)

        } catch (error) {
            res.status(500).send({ msg: `${error}` })
        }
    },

}