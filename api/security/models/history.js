// id, table, action, user, moment, data, data_updated
const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const { DB_SCHEMAS } = require('../../config')

const invalidHooks = (data, options) => ''

const history = sequelize.define('History', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    table: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    moment: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW //Date.now()
    },
    data: {
        type: DataTypes.JSONB
    }
}, {
    schema: DB_SCHEMAS.SECURITY,
    tableName: 'history',
    timestamps: true, // obligatorio para el funcionamiento de Pananoid
    paranoid: true,
    hooks: {
        afterCreate: invalidHooks,
        afterBulkCreate: invalidHooks,
        afterUpdate: invalidHooks,
        afterBulkUpdate: invalidHooks,
        afterDestroy: invalidHooks,
        afterBulkDestroy: invalidHooks
    }
})

module.exports = history