const express = require("express");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
const router = express.Router();
const Auth = require("../models/auth");

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const auth = new Auth({
                email: req.body.email,
                password: hash
            });
            auth.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});


router.post("/login", (req, res, next) => {
    Auth.findOne({ email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            const token = jwt.sign(
                { email: user.email,userId: user._id },
                "secret_this_shoud_be_longer",
                {expiresIn: "1h"}
                );
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed'
            })
        })
});

module.exports = router;