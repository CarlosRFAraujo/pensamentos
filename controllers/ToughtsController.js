const Tought = require('../models/Tought')
const User = require('../models/User')
const { Op } = require('sequelize')

module.exports = class ToughtsController {
    static async showToughts(req, res) {

        let buscar = ''

        if (req.query.buscar) {
            buscar = req.query.buscar
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC';
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: { 
                titulo: { [Op.like]: `%${buscar}%` },
            },
            order: [['createdAt', order]],
           
        })
        const toughts = toughtsData.map((result) => result.get({ plain: true }))

        let toughtsQtd = toughts.length

        if (toughtsQtd === 0) {
            toughtsQtd = false
        }

        
        res.render('toughts/home', { toughts, buscar, toughtsQtd })
    }

    static async dashboard (req, res) {
        const userId = req.session.userid

        if (!userId) {
            res.redirect('/login')

            return
        }

        const user = await User.findOne({
            where: { id: userId },
            include: Tought,
            plain: true
        })
        
        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }
        
        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static async removeTought (req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        if (!UserId) {
            res.redirect('/login')

            return
        }
        
        try {
            await Tought.destroy({ where: { id: id, UserId: UserId } })

            req.flash('mensagem', 'Pensamento removido com sucesso')

            req.session.save(() => res.redirect('/toughts/dashboard'))

        } catch (error) {
            console.log(error)
        }

        

    }

    static async editToughts (req, res) {
        const id = req.params.id

        const tought = await Tought.findOne({ where: { id: id }, raw: true })

        console.log(tought)


        res.render('toughts/edit', { tought })
    }

    static async addToughts (req, res) {
        res.render('toughts/add')
    }

    static async postEditTought (req, res) {

        const id = req.body.id
        const tought = {            
            titulo: req.body.titulo,
            pensamento: req.body.pensamento
        }

        try {
            await Tought.update(tought, { where: {id: id } } )

            req.flash('mensagem', 'Pensamento atualizado com sucesso')

            req.session.save( () => res.redirect('/toughts/dashboard'))

        } catch (error) {
            console.log(error)            
        }
    }

    static async addToughtsSave (req, res) {
        const tought = {
            titulo: req.body.titulo,
            pensamento: req.body.pensamento,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought)
        
            req.flash('mensagem', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
        })
        } catch (error) {
            console.log(error   )
        }
    }
}