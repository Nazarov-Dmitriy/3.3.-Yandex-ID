const express = require('express')
require('dotenv').config()
var methodOverride = require('method-override')
const error404 = require('./middleware/err-404')
const indexRouter = require('./routes/index')
const booksRouter = require('./routes/books')
const passport = require('passport')
let session = require('express-session')
const cors = require('cors');

const app = express();
app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(cors());
app.use(require('cookie-parser')());
app.use(session({
    secret: process.env.COOKIE_SECRET || "COOKIE_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.set('view engine', 'ejs');
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter)
app.use('/', booksRouter)
app.use(error404)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => [
    console.log(`server started ${PORT}`)
])