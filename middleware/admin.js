

module.exports = function admin(req, res, next){
    // The auth middleware creates req.user
    // We read req.user.isAdmin
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}