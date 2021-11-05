const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    contacts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }]
});

// export model user with UserSchema
module.exports = mongoose.model("users", UserSchema);
