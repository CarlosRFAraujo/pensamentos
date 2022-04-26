const { DataTypes } = require('sequelize')
const db = require('../db/conexao')
const User = require('./User')

const Tought = db.define('Tought', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    pensamento: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
})

Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought