const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the user is valid
const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

// Check if the user is authenticated
const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.username;
  if (!user) {
    return res.status(404).json({ message: "Body Empty" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign({
    data: user
  }, 'access', { expiresIn: 60 * 60 });

  // Store access token in session
  req.session.authorization = {
    accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  let book = books[isbn];

  if (book) {  // Check if book exists
    const review = req.body.review;
    book.reviews[username] = review;
    books[isbn] = book;  // Replace with updated book
    res.send(`Review posted for book with the ISBN ${isbn}.`);
  } else {
    // Respond if friend with specified email is not found
    res.send("Unable to find book!");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  let book = books[isbn];

  if (book) {  // Check if book exists
    const review = req.body.review;
    delete book.reviews[username];
    books[isbn] = book;  // Replace with updated book
    res.send(`Review deleted for book with the ISBN ${isbn}.`);
  } else {
    // Respond if friend with specified email is not found
    res.send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
