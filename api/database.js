/**
 * Conexion con SQL - Sequelize -> para postgres en este caso
 */
const configs = require('./config')
const { Sequelize, ConnectionError } = require('sequelize');
let toChangeData = {}
let toDeleteData = {}

// instancia Sequelize para establecer la conexion mediante los parametros definidos en `config.js`
const sequelize = new Sequelize(
    configs.DB_NAME,
    configs.DB_USER,
    configs.DB_PASSWORD,
    {
        host: configs.DB_HOST,
        dialect: configs.DB_DIALECT,
        logging: false,
        define: {
            //stop the auto-pluralization performed by Sequelize
            freezeTableName: true,
            /**
             * Creando *Historial* del sistema con los hooks genericos de la instancia Sequelize
             */
            hooks: {
                /**
                 * *Historial de INSERT* 
                 * utilizar el hook `afterCreate` para crear el historial despues de creado los modelos en la BD 
                 */
                afterCreate: (data, options) => {
                    const history = require('./security/models/history')
                    const app = require('./index')
                    const model = Object.values(sequelize.models).find(el => data instanceof el)

                    history.create({
                        table: typeof model.getTableName() === 'string'
                            ? model.getTableName()
                            : model.getTableName().schema + '.' + model.getTableName().tableName,
                        action: 'Insert',
                        user: app.get('user') || 1,
                        data: data.toJSON()
                    })
                },

                /**
                 * *Historial de UPDATE* 
                 * utilizar el hook `beforeBulkUpdate` para recuperar los datos antes de actualizar el modelo en BD
                 */
                beforeBulkUpdate: async (data, options) => {
                    const model = data.model
                    toChangeData = await model.findOne({ where: data.where })
                },
                beforeUpdate: async (data, options) => {
                    console.log(data);
                    toChangeData = data.toJSON()
                },
                //utilizar el hook `afterBulkUpdate` para crear el historial despues de actualizado los modelos en la BD 
                afterBulkUpdate: async (data, options) => {
                    const model = data.model
                    const history = require('./security/models/history')
                    const app = require('./index')
                    const changeData = data.attributes
                    await history.create({
                        table: typeof model.getTableName() === 'string'
                            ? model.getTableName()
                            : model.getTableName().schema + '.' + model.getTableName().tableName,
                        action: 'Update',
                        user: app.get('user') || 1,
                        data: { toChangeData: toChangeData || { condiciones: data.where, msg: 'No se encontraros los datos para la consulta de Actualización' }, changeData }
                    })
                    toChangeData = {}
                },
                async afterUpdate(data, options) {
                    // console.log('afterUpdate--'.red, data._modelOptions.schema);
                    //const model = data.model
                    const history = require('./security/models/history')
                    const app = require('./index')
                    const changeData = data.toJSON()
                    await history.create({
                        table: typeof this.getTableName() === 'string'
                            ? this.getTableName()
                            : this.getTableName().schema + '.' + this.getTableName().tableName,
                        action: 'Update',
                        user: app.get('user') || 1,
                        data: { toChangeData: toChangeData || { condiciones: data.where, msg: 'No se encontraros los datos para la consulta de Actualización' }, changeData }
                    })
                    toChangeData = {}
                },

                /**
                 * *Historial de DELETE* 
                 * utilizar el hook `beforeBulkDestroy` para recuperar los datos antes de eliminar el modelo en BD
                 */
                beforeBulkDestroy: async (data, options) => {
                    const model = data.model
                    toDeleteData = await model.findOne({ where: data.where })
                    // Object.assign(options, toChangeData )
                },
                //utilizar el hook `afterBulkDestroy` para crear el historial despues de eliminado los modelos en la BD 
                afterBulkDestroy: async (data, optio) => {
                    const history = require('./security/models/history')
                    const app = require('./index')
                    const model = data.model

                    await history.create({
                        table: typeof model.getTableName() === 'string'
                            ? model.getTableName()
                            : model.getTableName().schema + '.' + model.getTableName().tableName,
                        action: 'Delete',
                        user: app.get('user') || 1,
                        data: toDeleteData || { condiciones: data.where, msg: 'No se encontraros los datos para la consulta de Eliminación' }
                    })
                    toDeleteData = {}
                }
            }
        }
    }
);

// probando la conexion a la base de datos
const toConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('> Conexion a la Base de Datos... Exitosa!'.yellow);
    } catch (err) {
        if (err instanceof ConnectionError)
            console.error(`<<<< ERROR >>>> ${err.message}. Verifique los siguientes casos
    1) Asegurece que la base de datos '${configs.DB_NAME}' existe 
    2) Verifique que los parametros de conexion del archivo 'config.js' sean correctos  
         ------------| config.js |-----------
            DB_NAME: '${configs.DB_NAME}',           
            DB_USER: '${configs.DB_USER}',           
            DB_PASSWORD: '${configs.DB_PASSWORD}',   
            DB_HOST: '${configs.DB_HOST}',           
            DB_DIALECT: '${configs.DB_DIALECT}'      
         -----------------------------------`.red)
        else
            console.error('Unable to connect to the database:')
    }
}
toConnect()

module.exports = sequelize