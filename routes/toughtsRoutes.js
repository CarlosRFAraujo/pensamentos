const express = require('express')
const ToughtsController = require('../controllers/ToughtsController')
const router = express.Router()
const checkAuth = require('../security/auth').checkAuth

router.get('/add', checkAuth, ToughtsController.addToughts)
router.post('/add', checkAuth, ToughtsController.addToughtsSave)
router.get('/edit/:id', checkAuth, ToughtsController.editToughts)
router.post('/edit', checkAuth, ToughtsController.postEditTought)
router.get('/dashboard', checkAuth, ToughtsController.dashboard)
router.post('/remove', checkAuth, ToughtsController.removeTought)
router.get('/', ToughtsController.showToughts)

module.exports = router