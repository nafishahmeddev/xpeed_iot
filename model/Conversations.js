const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
    members: {
        type : Array,
        default: []
    },
    contacts: {
        type : Array,
        default: []
    }
});

// export model user with ConversationSchema
module.exports = mongoose.model("conversations", ConversationSchema);
