const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

const validate = {}

/* Registration Data Validation Rules */
validate.registrationRules = () => {
  return [
    body("firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required."),

    body("password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 5,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 5 characters and include uppercase and a symbol."),
  ]
}

/* Login Validation Rules */
validate.loginRules = () => {
  return [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required."),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* Error Handler Middleware */
validate.checkValidation = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formData = req.body
    const view = req.originalUrl.includes("register") ? "register" : "login"
    const title = req.originalUrl.includes("register") ? "Register" : "Login"
    return res.status(400).render(view, {
      title,
      errors: errors.array(),
      ...formData
    })
  }
  next()
}



validate.checkJWTToken = (req, res, next) => {
  
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}
//error handling middleware//
validate.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)


module.exports = validate