const bookModel = require("../models/book_model")
const utilities = require("../utilities/base")

async function showCategories(req, res){
    const categories = await bookModel.getCategories()
    res.render("categories",{
        title: "Book Categories",
        categories
    })
}

async function showBooksByCategory(req, res){
  const categoryId = req.params.categoryId
  const books = await bookModel.getBooksByCategory(categoryId)
  res.render("books",{
    title: "Books",
    books
  })
}

module.exports = { showCategories, showBooksByCategory };