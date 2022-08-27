const sequelize = require('../../database'),
    { DataTypes } = require('sequelize'),
    { DB_SCHEMAS } = require('../../config')

const Unidad = sequelize.define('unidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siglas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    schema: DB_SCHEMAS.SECURITY,
    timestamps: true, // obligatorio para el funcionamiento de Pananoid
    paranoid: true,
})

const destroy = async (data, opt) => {
    const userModel = require('./userSystem')
    const one__user = await userModel.findOne({ where: { unidadId: data.where.id } })
    console.log(one__user);
    if (one__user)
        throw new Error('La unidad no puede ser eliminada. Por que está en uso')
}

Unidad.beforeDestroy(destroy)
Unidad.beforeBulkDestroy(destroy)

module.exports = Unidad