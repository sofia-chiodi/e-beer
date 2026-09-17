// Require's
const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session')
const cookies = require('cookie-parser')

// Express
const app = express()

const cors = require('cors')
app.use(
  cors(
    (corsOptions = {
      origin: '*',
    }),
  ),
)

// Middlewares
const userLogged = require('./middlewares/user-logged')
const ageAnswer = require('./middlewares/age-answer')
const cartLocals = require('./middlewares/cart-locals')

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'e-beer',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  }),
)
app.use(cookies())
app.use(ageAnswer)
app.use(userLogged)
app.use(cartLocals)

// Template engines
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// Route system require and use
const mainRoutes = require('./routes/mainRoutes.js')

app.use('/', mainRoutes)

// PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`El server está corriendo en el puerto ${PORT}`)
})
app.use((req, res, next) => {
  res.status(404).render('not-found')
})
