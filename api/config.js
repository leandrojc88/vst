/**
 * Configuracion de la Base de Datos
 */

module.exports = {
    DB_NAME: 'VST-database',
    DB_USER: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_HOST: 'localhost',
    DB_DIALECT: 'postgres',
    DB_SCHEMAS : {
        SECURITY: 'security' //NO BORRAR --> esquema obligatorio para el Sistema
    }
}