const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        author: req.userData.userId
    });
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
}

exports.getPosts = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count()
    }).then(count => {
        res.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
}

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const updatedPost = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        author: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, author: req.userData.userId}, updatedPost).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({
                message: "Update successful!"
            })
        } else {
            res.status(401).json({
                message: "Not authorized!"
            })
        }
        
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, author: req.userData.userId}).then((result) => {
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: 'Post deleted'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized!'
            });
        }
        
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
    
}