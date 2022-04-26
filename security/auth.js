module.exports.checkAuth = function (req, res, next) {
    const userID = req.session.userid

    if (!userID) {
        res.redirect('/login')

        return
    }

    next()
}