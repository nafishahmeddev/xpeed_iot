
// Filename : user.js

const express = require("express");
const { check, validationResult} = require("express-validator");
const router = express.Router();
const auth = require("../middleware/auth");
import models from "../models";
router.get("/", auth, async (req, res) => {
    try {
        let conversations = await models.conversation.getConversations(req.user.id);

        res.json(conversations);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});
router.get("/messages/:id", auth, async (req, res) => {
    try {
        const messages= await message.getMessages(req.params.id)
        res.json(messages);
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
        const res = await conversation_member.createGroup(req.user._id, users);
        res.json(res);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});


module.exports = router;
