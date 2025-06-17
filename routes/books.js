const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/bookController");
const utilities = require("../utilities/base")

router.get("/categories", utilities.handleErrors(bookCtrl.showCategories))
router.get("/books/category/:categoryId", utilities.handleErrors(bookCtrl.showBooksByCategory));

module.exports = router