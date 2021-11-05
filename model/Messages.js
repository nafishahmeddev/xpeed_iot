const Mongoose = require("mongoose");

const MessageSchema = new Mongoose.Schema({
    conversationId : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : "conversations"
    },
    author : {
        type : Mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        //default: Date.now()
    },
});

// export model user with MessageSchema
module.exports = Mongoose.model("messages", MessageSchema);
