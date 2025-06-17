const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const static = require("./routes/static")
const env = require("dotenv").config()
const app = express();
const pool = require('./database')
const session = require("express-session")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/base")



/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

//Express Message Middleware//

app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())  //tells the express application to use the body parser to work with JSON data//
app.use(bodyParser.urlencoded({extended: true})) // tells the express application to read and work with data sent via a URL as well as from a form//

//Cookies
app.use(cookieParser())

//utilities middleware
app.use(utilities.checkJWTToken)


/*View Engine and Templates*/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "./layouts/layout")



/*Routes*/

app.use(static)
app.use(express.static("public"))

//index route//
app.get("/", function(req,res){
    res.render("index",{title:"Home"})
})

/*Other route*/
const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/books")

app.use("/", authRoutes)
app.use("/", bookRoutes)

//File Not Found Route
app.use(async(req, res, next) =>{
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use((err, req, res, next) => {
  console.error("Error at:", req.url)
  console.error(err.stack)
  res.status(500).render("error", {
    title: "Server Error",
    message: "Something went wrong. Please try again later.",
  })
})



 /* Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
