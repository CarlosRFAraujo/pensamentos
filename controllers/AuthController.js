const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const {email, senha} = req.body

        const usuario = await User.findOne({ where: { email: email } })

        if (!usuario) {

            req.flash('mensagem', 'Usuário não cadastrado')
            res.render('auth/login')

            return

        }
        
        const senhaMatch = bcrypt.compareSync(senha, usuario.senha)
        
        if (!senhaMatch) {
            req.flash('mensagem', 'Senha incorreta!')
            res.render('auth/login')

            return
        }

        // inicializando a sessão:
        req.session.userid = usuario.id

        req.flash('mensagem', 'Login realizado com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })

    }

    static register(req, res) {
        res.render('auth/registrar')
    }

    static async registerPost(req, res) {

        const { nome, email, senha, confirmSenha} = req.body

        const checkIfUseExists = await User.findOne({ where: { email: email } })
        
        if (checkIfUseExists) {
            req.flash('mensagem', 'O e-mail já possui cadastro, gentileza ir em login e resgatar usuário ou cadastrar outro e-mail')
            res.render('auth/registrar')

            return
        }

        if (senha != confirmSenha) {
            req.flash('mensagem', 'As senhas não conferem, gentileza digitar novamente')
            res.render('auth/registrar')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedsenha = bcrypt.hashSync(senha, salt)

        const usuario = {
            nome,
            email,
            senha: hashedsenha
        }

        try {
            const createUsuario = await User.create(usuario)
            // inicializando a sessão:
            req.session.userid = createUsuario.id

            req.flash('mensagem', 'Cadastro realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })
            
        } catch (error) {
            console.log(error)
        }
        
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}