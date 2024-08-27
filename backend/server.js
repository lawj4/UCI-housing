//server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require("./models/todoList")
const puppeteer = require('puppeteer');

var app = express();
app.use(cors());
app.use(express.json());




// Connect to your MongoDB database (replace with your database URL)
var connectionString = "mongodb+srv://lawj0430:Mongo84436%402@cluster0.u5zpeeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(connectionString);

// Check for database connection errors
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Get saved tasks from the database
app.get("/getTodoList", (req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => res.json(err))
});

// Add new task to the database
app.post("/addTodoList", (req, res) => {
    TodoModel.create({
        gender: req.body.gender,
        occupancy: req.body.occupancy,
        distance: req.body.distance,
        rent: req.body.rent,
        start: req.body.start,
        deadline: req.body.deadline, 
        image: req.body.image,
        
    })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Update task fields (including deadline)
app.post("/updateTodoList/:id", (req, res) => {
    const id = req.params.id;
    const updateData = {
        gender: req.body.gender,
        occupancy: req.body.occupancy,
        distance: req.body.distance,
        rent: req.body.rent,
        start: req.body.start,
        deadline: req.body.deadline, 
        image: req.body.image,
        
    };
    TodoModel.findByIdAndUpdate(id, updateData)
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Delete task from the database
app.delete("/deleteTodoList/:id", (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete({ _id: id })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});



app.post('/verify-content', async (req, res) => {
    const { url, selector, expectedText } = req.body;

    if (!url || !selector || !expectedText) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const wordsToCheck = ["This content isn't available right now", 'Go to News Feed', 'Go back',"Visit Help Center"];
    try {
      // Navigate to the page and wait for the content to be fully loaded
      await page.goto(url, { waitUntil: 'networkidle0' }); // Wait until there are no more than 0 network connections for at least 500ms
      // Optionally, you can wait for a specific selector to ensure the page is fully rendered
      // await page.waitForSelector('#specificElement');
      // Get the page content
      const pageContent = await page.evaluate(() => document.body.innerText);
      // Check each word and log the result
      for (const word of wordsToCheck) {
          if (pageContent.includes(word)) {
            // If condition is true, exit the loop
            let data = {
                isContentValid: false,
            }
            console.log(`**IS GONE** "${url}"`);
            res.json(data);
            break;
          }
        }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the browser
      await browser.close();
    }
});



app.listen(3001, () => {
    console.log('Server running on 3001');
});
