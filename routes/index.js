const passport = require('passport');
const router = require('express').Router();
router.use('/', require('./swagger'));
router.use('/vehicles', require('./vehicles'));

// GitHub Login Route
router.get('/login', (req, res, next) => {
    //#swagger.tags=['Login']
    try {
        passport.authenticate('github')(req, res, next);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error during login." });
    }
});

// Logout Route
router.get('/logout', (req, res, next) => {
    //#swagger.tags=['Logged Out']
    try {
        req.logout(err => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({ message: "Error during logout." });
            }
            res.redirect('/');
        });
    } catch (err) {
        console.error("Unexpected error during logout:", err);
        res.status(500).json({ message: "Internal server error during logout." });
    }
});

module.exports = router;
