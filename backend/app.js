const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// 0tYjKNWNJsp8dghL
// 31.202.50.66
const app = express();
const Post = require('./models/post');

mongoose.connect("mongodb+srv://alexZO:0tYjKNWNJsp8dghL@cluster0.ro8r3vz.mongodb.net/mean?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connection to the database successful");
    })
    .catch(() => {
        console.log("Connection to the database failed");
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"); // Options is an implict request sent by the browser
    next();
})

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts',(req, res) => {
    Post.find()
    .then(documents => {
        res.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: documents
        });
    });
});


module.exports = app;