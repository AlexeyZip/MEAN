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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS"); // Options is an implict request sent by the browser
    next();
})

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
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

app.get("/api/posts/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
})

app.put("/api/posts/:id", (req, res, next) => {
    const updatedPost = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, updatedPost).then(result => {
        res.status(200).json({
            message: "Update successful!"
        })
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then((result) => {
        res.status(200).json({
            message: 'Post deleted'
        });
    })
    
});


module.exports = app;