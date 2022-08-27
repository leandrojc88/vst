require('colors')

const { DB_SCHEMAS } = require('../config')
const { DataTypes } = require('sequelize');
const crypto = require('crypto')

//establecer conecxion
const db = require('../database');
const UserModel = require('./models/userSystem')

//Modelos de datos
const history = require('./models/history')
const unidad = require('./models/unidad')
const cargo = require('./models/cargo')

//inicializando base de datos
const init = async function () {
    console.log(`
    **********************************************************************
    ************************** Iniciando VST... **************************
    **********************************************************************\n`.green);
    try {
        const allSchemas = await db.showAllSchemas()

        if (!allSchemas.find((el) => el === DB_SCHEMAS.SECURITY)) {
            await db.createSchema(DB_SCHEMAS.SECURITY)
            console.log(`> Schema ${DB_SCHEMAS.SECURITY} creado!`.green);
        }
        // --------------- Systems ------------------------
        await unidad.sync({ alter: true })
        console.log("> Tabla 'security.unidad' creada! ".green);

        await cargo.sync({ alter: true })
        console.log("> Tabla 'security.cargo' creada! ".green);

        await UserModel.sync({ alter: true });
        console.log("> Tabla 'security.user' creada!".green);

        await history.sync({ alter: true });
        console.log("> Tabla 'security.history' creada!".green);       

        const cargo__admin = await db.query(`SELECT * FROM security.cargo WHERE id = 1`);
        if (cargo__admin[0].length)
            console.log(`cargo existente`.red)
        else {
            await db.query(`INSERT INTO security.cargo(nombre,"createdAt", "updatedAt")
             VALUES ('Administrador del Sistema','${DataTypes.NOW}', '${DataTypes.NOW}' );`)
                .then(result => console.log('insert Cargo Administrador del Sistema'))
                .catch(err => console.log(`cargo existente | ${err.message}`.red))
        }

        const unidad__admin = await db.query(`SELECT * FROM security.unidad WHERE id = 1`);
        if (unidad__admin[0].length)
            console.log(`unidad existente`.red)
        else {
            await db.query(`INSERT INTO security.unidad(siglas,nombre,"createdAt", "updatedAt")
             VALUES ('U-Systema', 'Unidad Inicial del Sistema','${DataTypes.NOW}', '${DataTypes.NOW}' );`)
                .then(result => console.log('insert Unidad U-System'))
                .catch(err => console.log(`unidad existente | ${err.message}`.red))
        }
        
        const user__admin = await db.query(`SELECT * FROM security.users WHERE _id = 1`);
        if (user__admin[0].length)
            console.log(`usuario existente`.red)
        else {
            const cryptoPass = crypto.createHmac('sha256', 'root').digest('hex')
            await db.query(`INSERT INTO security.users("user", full_name, pass, rol, "unidadId", "cargoId", "createdAt", "updatedAt")
            VALUES ('root', 'Administrador Root Sistema','${cryptoPass}', 1, 1, 1, '${DataTypes.NOW}', '${DataTypes.NOW}' );`)
                .then(result => console.log("> Usuario 'root' creado"))
                .catch(err => console.log(`usuario existente | | ${err.message}`.red))
        }       

        db.close()

        console.log(">>> Proceso terminado con exito!... puede utilizar el sistema".green);
        console.log(">>> user: root | pass: root".yellow);
    } catch (error) {
        console.log(`<<< Error >>> ${error.message}`.red)
    }
}

//inicializando base de datos
init()

/*
async function test(){

const qi = db.getQueryInterface()
console.log(await qi.getForeignKeyReferencesForTable('cargo'));
console.log(await qi.getForeignKeyReferencesForTable('users'));
console.log(await qi.getForeignKeysForTables(['users','cargo']));

}
test() */