const express = require('express');
const router = express.Router();
const passport = require('passport')
const YandexStrategy = require('passport-yandex').Strategy

function isAthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next()
    }
    res.redirect('/')
};

passport.serializeUser((user, done) => {
    console.log(1);
    done(null, user)
});

passport.deserializeUser((obj, done) => {
    done(null, obj)
});


passport.use(new YandexStrategy({
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/yandex/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(() => {
            return done(null, profile)
        })
    }));

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
        user: req.user
    });
})

router.get('/profile', isAthenticated, (req, res) => {
    res.json({
        user: req.user
    }) 
})

router.get('/login', passport.authenticate('yandex'))

router.get('/auth/yandex/callback', passport.authenticate('yandex', {
    faillureRedirect: '/'
}), (req, res) => {
    res.render('index', {
        title: 'Главная',
        user: req.user
    });
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.render('index', {
            title: 'Главная',
            user: req.user
        });
    });
})




module.exports = router;