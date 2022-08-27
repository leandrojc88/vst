const historyModel = require('../models/history')
const { Op } = require("sequelize");


const historyRouter = {

    getHistorys: async (req, res) => {
        try {
            const historys = await historyModel.findAll()
            res.json(historys)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },

    getPagHistorys: async (req, res) => {
        try {
            const { offset, limit, filters, order } = req.params
            const json_filters = JSON.parse(filters)

            let obj_filter = {}
            if (json_filters.dates.length)
                obj_filter.moment = { [Op.between]: [new Date(json_filters.dates[0]), new Date(json_filters.dates[1] + ' 23:59:00.999-04')] }
            if (json_filters.user)
                obj_filter.user = json_filters.user
            if (json_filters.table)
                obj_filter.table = json_filters.table
            // console.log(json_filters.dates[1] + ' 23:59:00');
            // console.log(obj_filter);
            const userSystema = require('../models/userSystem')
            const historys = await historyModel.findAll({
                offset, limit,
                include: userSystema,
                where: {
                    action: { [Op.or]: json_filters.actions },
                    ...obj_filter
                },
                order: [['id', order]]
            })
            // const historys = await historyModel.findAll({ offset, limit })
            const retorno = historys.map(
                el => ({
                    id: el.id,
                    table: el.table,
                    action: el.action,
                    moment: el.moment,
                    data: el.data,
                    user: { _id: el.User._id, user: el.User.user }
                })
            )
            res.json(retorno)
        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },

    getCountHistorys: async (req, res) => {
        try {
            const { filters } = req.params
            const json_filters = JSON.parse(filters)

            let obj_filter = {}
            if (json_filters.dates.length)
                obj_filter.moment = { [Op.between]: [new Date(json_filters.dates[0]), new Date(json_filters.dates[1] + ' 23:59:00.999-04')] }
            if (json_filters.user)
                obj_filter.user = json_filters.user
            if (json_filters.table)
                obj_filter.table = json_filters.table

            const count_historys = await historyModel.count({
                where: {
                    action: { [Op.or]: json_filters.actions },
                    ...obj_filter
                }
            })
            res.json(count_historys)

        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    },

    getHistorysTables: async (req, res) => {
        try {
            const tables = await historyModel.findAll({ attributes: ['table'], group: 'table' })
            res.json(tables)
        } catch (error) {
            res.status(500).send({ msg: `Error del sistema ${error}` })
        }
    }

}

module.exports = historyRouter