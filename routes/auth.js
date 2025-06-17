const express = require("express")
const router = express.Router()
const authCtrl = require ("../controllers/authcontroller")
const validate = require("../utilities/base")


router.get("/login", validate.handleErrors(authCtrl.showLogin))
router.post("/login",
  validate.loginRules(),
  validate.checkValidation,
  authCtrl.login
)

router.get("/register", validate.handleErrors(authCtrl.showRegister))

router.post("/register", 
validate.registrationRules(),
validate.checkValidation,
authCtrl.register)


router.post("/categories", authCtrl.login)

module.exports = router

