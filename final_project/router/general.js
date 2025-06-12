const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn],null,4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = []
  Object.keys(books).forEach(key => {
    filtered_books.push(books[key]);
  });
  filtered_books = filtered_books.filter(book=>book.author.toLowerCase() === author.toLowerCase());
  res.send(JSON.stringify(filtered_books,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const regex = new RegExp("^" + title.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
  let filtered_books = []
  Object.keys(books).forEach(key => {
    filtered_books.push(books[key]);
  });
  filtered_books = filtered_books.filter(book=>regex.test(book.title.toLowerCase()));
  res.send(JSON.stringify(filtered_books,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let review = {};
//   book = JSON.parse(books[isbn]);
  const obj = JSON.parse(text, function (key, value) {
  Object.keys(books[isbn]).forEach(key => {
  if (key == "review") {
    review = value;
  } else {
    return value;
  }
  res.send(JSON.stringify(books[isbn],null,4));
});

module.exports.general = public_users;
