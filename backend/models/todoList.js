//todoList.js

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    
    gender: {
        type: String,
        required: true,
    },
    occupancy: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
    },
    deadline: {
        type: Date,
    },
    image: {
        type: String,
        required: true,
    },

});


const todoList = mongoose.model("todo", todoSchema);

module.exports = todoList;