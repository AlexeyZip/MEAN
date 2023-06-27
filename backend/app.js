const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

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
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS"); // Options is an implict request sent by the browser
    next();
});
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);


module.exports = app;