const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const { DB_SCHEMAS } = require('../../config')
const history = require('./history')

const User = sequelize.define('User', {
    // Model attributes are defined here
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    schema: DB_SCHEMAS.SECURITY,
    tableName: 'users',
    timestamps: true, // obligatorio para el funcionamiento de Pananoid
    paranoid: true,
});

User.beforeCreate((data, opt) => {
    if (data.pass.length < 8 && !opt.root)
        throw new Error('La contraseña debe tener mas de 8 caracteres')
})
User.beforeBulkCreate((data, opt) => {
    if (data.pass.length < 8 && !opt.root)
        throw new Error('La contraseña debe tener mas de 8 caracteres')
})

// relations One - to - Many
User.hasMany(history, { sourceKey: '_id', foreignKey: { name: 'user', allowNull: false } })
history.belongsTo(User, { targetKey: '_id', foreignKey: 'user' })

const Unidad = require('./unidad')
const Cargo = require('./cargo')

Unidad.hasMany(User)
User.belongsTo(Unidad)

Cargo.hasMany(User)
User.belongsTo(Cargo)

module.exports = User