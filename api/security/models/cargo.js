const sequelize = require('../../database'),
    { DataTypes } = require('sequelize'),
    { DB_SCHEMAS } = require('../../config')

const cargo = sequelize.define('cargo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    schema: DB_SCHEMAS.SECURITY,
    paranoid: true,
    timestamps: true
})

const destroy = async (data, opt) => {
    User = require('./userSystem')
    const one__user = await User.findOne({ where: { cargoId: data.where.id } })
    if (one__user) 
        throw new Error(`No se puede eliminar el Cargo. Por que está en uso.`)    
    
}
cargo.beforeDestroy(destroy)
cargo.beforeBulkDestroy(destroy)

module.exports = cargo