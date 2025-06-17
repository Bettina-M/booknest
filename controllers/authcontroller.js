
const authModel = require("../models/authmodel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.showLogin = (req, res) => {
    res.render("login", {title:"Login"})
}

exports.showRegister = (req, res) => {
    res.render("register", {title:"Register"})
}

// Handle login
exports.login = async (req, res) => {
 
   const {email, pass} = req.body
  const user = await authModel.findByEmail(email) 

  if (!user) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("login", {
      title: "Login",
      email,
    })
  }

  try {
    const match = await bcrypt.compare(pass, user.pass)

    if (!match) {
      req.flash("notice", "Invalid credentials.")
      return res.status(400).render("login", {
        title: "Login",
        email,
      })
    }

    
    const payload = {
      id: user.id,        
      email: user.email,   
      firstname: user.firstname, 
      lastname: user.lastname    
    };

    
    delete user.pass;

    
    const token = jwt.sign(
      payload,  
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000, 
    })

    return res.redirect("/categories") 
  } catch (err) {
    console.error("Login error:", err)
    req.flash("notice", "Server error during login.")
    return res.status(500).render("login", { title: "Login" })
  }
}

// Handle registration (unchanged)
exports.register = async (req, res) => {
  const { firstname, lastname, email, pass } = req.body

  try {
    const hashedPassword = await bcrypt.hash(pass, 10)
    const regResult = await authModel.createUser(
      firstname,
      lastname,
      email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${firstname}. Please log in.`
      )
      return res.redirect("/login") 
    } else {
      req.flash("notice", "Registration failed.")
      return res.status(500).render("register", { title: "Register" })
    }
  } catch (err) {
    console.error("Registration error:", err)
    req.flash("notice", "Server error during registration.")
    return res.status(500).render("register", { title: "Register" })
  }
}