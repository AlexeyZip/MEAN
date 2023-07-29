const express = require("express");

const router = express.Router();
const PostsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

router.post("", checkAuth, extractFile, PostsController.createPost);

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;


// Also, for lecture 135, in the updateOne method, you should use result.matchedCount instead of result.n.