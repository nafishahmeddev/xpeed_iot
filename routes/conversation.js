
// Filename : user.js

const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Users = require("../model/Users");
const Conversations = require("../model/Conversations");
const Messages = require("../model/Messages");
const Mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
    try {
        let conversations= await Conversations.getConversations(req.user._id);
        conversations = conversations.map(conversation =>{
            if(conversation.type === Conversations.TYPE.P2P){
                let member =  conversation.members.find(member=>member._id!=req.user.id);
                conversation.title = member.name;
            }
            return conversation;
        })
        res.json(conversations);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});
router.get("/message/:id", auth, async (req, res) => {
    try {
        const messages= await Messages.getMessages(req.params.id)
        res.json(conversations);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});

//conversations
router.post("/create", auth,
    [check("users", "Please select users").isArray()],
    async (req, res) => {
    try {
        const {users} = req.body;
        const res = await Conversations.createGroup(req.user._id, users);
        res.json(res);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});


module.exports = router;
