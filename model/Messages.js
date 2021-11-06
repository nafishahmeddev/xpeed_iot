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
    content: {
        type: Mongoose.Schema.Types.String
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
const Messages = Mongoose.model("messages", MessageSchema);
Messages.getMessages = (conversation_id) =>{
    return Messages.aggregate([
        {
            $match: {
                conversationId: Mongoose.Types.ObjectId(conversation_id)
            },

        },
        {
            $project : {
                _id:1,
                author:1,
                createdAt: 1,

            }
        }
    ])
}
// export model user with MessageSchema
module.exports = Messages;
