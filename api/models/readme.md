## Aqui crear los ficheros .js con los modelos **sequelize** de la base de datos
ejemplo: extraido de el modelos de usuarios *api/security/models/userSystem.js*
```js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const User = sequelize.define('User', {
    // Model attributes are defined here
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    } ...
    , {
    schema: 'security',
    tableName:'users',
    timestamps: false
});

module.exports = User
```