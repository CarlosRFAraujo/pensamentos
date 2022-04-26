const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thoughts', 'dev', 'dev123456', {
    host: 'localhost',
    dialect: 'mysql'
})

try {

    sequelize.authenticate()
    console.log('Authenticado com sucesso')
} catch (error) {
    console.log(`Não foi possível conectar ao banco: ${error}`)    
}

module.exports = sequelize