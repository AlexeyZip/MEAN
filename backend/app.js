const express = require('express');
const bodyParser = require("body-parser");

// 0tYjKNWNJsp8dghL
// 31.202.50.66
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"); // Options is an implict request sent by the browser
    next();
})

app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts',(req, res) => {
    const posts = [
        {
            id: '1',
            title: 'Title 1',
            content: 'Post number 1'
        },
        {
            id: '2',
            title: 'Title 2',
            content: 'Post number 2'
        },
        {
            id: '3',
            title: 'Title 3',
            content: 'Post number 3'
        },
        {
            id: '4',
            title: 'Title 4',
            content: 'Post number 4'
        },
    ]
    res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: posts
    });
});


module.exports = app;