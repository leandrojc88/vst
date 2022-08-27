const unidadModel = require('../models/unidad')

module.exports = {
    getAll: async (req, res) => {
        try {
            const unidades = await unidadModel.findAll({order:[['siglas','asc']]})
            res.json(unidades)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }

    },
    create: async (req, res) => {
        try {
            const newu = await unidadModel.create(req.body)
            res.json(newu)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params
            const un = await unidadModel.update(req.body, { where: { id } })
            res.json(un)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const un = await unidadModel.destroy({ where: { id } })
            res.json(un)

        } catch (error) {
            res.status(500).send({ msg: `${error}`})
        }
    },

}