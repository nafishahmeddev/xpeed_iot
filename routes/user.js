
// Filename : user.js

const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Users = require("../model/Users");
const Conversations = require("../model/Conversations");
const Mongoose = require("mongoose");


router.post(
    "/signup",
    [
        check("name", "Please Enter a Valid Username").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 3
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            password
        } = req.body;
        try {
            let user = await Users.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "Users Already Exists"
                });
            }

            user = new Users({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);


router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        try {
            let user = await Users.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "Users Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

router.get("/me", auth, async (req, res) => {
    try {
        const user = await Users.findOne( {_id : req.user.id});
        res.json(user);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});

router.get("/conversation", auth, async (req, res) => {
    try {
        const conversations= await Conversations.getConversations(req.user._id);
        res.json(conversations);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});

router.post("/conversation/group/create", auth,
    [check("users", "Please select users").isArray()],
    async (req, res) => {
    try {
        const {users} = req.body;
        const conversations= await Conversations.getConversations(req.user._id);
        res.json(conversations);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});


module.exports = router;
