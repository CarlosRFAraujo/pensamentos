const express = require('express')
const exhdb = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
// import db
const conexao = require('./db/conexao')
// import models
const Tought = require('./models/Tought')
const User = require('./models/User')
// import routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')
// import controllers
const ToughtsController = require('./controllers/ToughtsController')
const AuthController = require('./controllers/AuthController')

const app = express()

app.engine('handlebars', exhdb.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.static('public'))

app.use(express.json())

//session middleware para salvar as seções:
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }

    })
)

// Configurando a flash messagem:
app.use(flash())

// configurando session res:
app.use(function (req, res, next) {

    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.use('/', ToughtsController.showToughts)


/* na primeira implantação deve ser forçada a criação das concexões conexao.sync({ force: true })*/
conexao.sync()
.then(() => app.listen(3000))
.catch((erro) => console.log(erro))


