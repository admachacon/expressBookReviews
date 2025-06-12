const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length == 0) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered."});
    } else {
      return res.status(404).json({message: "User already exists."});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
async function getBooks() {
    return new Promise((resolve) => {
      resolve(books);
    });
  }
public_users.get('/', async (req, res) => {
    try {
      const data = await getBooks();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

// Get book details based on ISBN
async function getBookByIsbn(req) {
    return new Promise((resolve) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    });
  }
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const data = await getBookByIsbn(req);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
// Get book details based on author
async function getBookByAuthor(req) {
    return new Promise((resolve) => {
        const author = req.params.author;
        let filtered_books = []
        Object.keys(books).forEach(key => {
          filtered_books.push(books[key]);
        });
        filtered_books = filtered_books.filter(book=>book.author.toLowerCase() === author.toLowerCase());
        resolve(filtered_books);
    });
  }
public_users.get('/author/:author', async (req, res) => {
    try {
      const data = await getBookByAuthor(req);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Get all books based on title
async function getBookByTitle(req) {
    return new Promise((resolve) => {
        const title = req.params.title.toLowerCase();
        const regex = new RegExp("^" + title.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
        let filtered_books = []
        Object.keys(books).forEach(key => {
          filtered_books.push(books[key]);
        });
        filtered_books = filtered_books.filter(book=>regex.test(book.title.toLowerCase()));
        resolve(filtered_books);
    });
  }
public_users.get('/title/:title', async (req, res) => {
    try {
      const data = await getBookByTitle(req);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
});

//  Get book review
async function getBookReviews(req) {
    return new Promise((resolve) => {
        const isbn = req.params.isbn;
        resolve(books[isbn].reviews);
    });
  }
public_users.get('/review/:isbn', async (req, res) => {
    try {
      const data = await getBookReviews(req);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports.general = public_users;
