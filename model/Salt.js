const mongoose = require("mongoose");

const SaltSchema = mongoose.Schema({
    salt_key: {
        type: String,
        required: true
    },
    type: {
        type: Integer,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model user with UserSchema
module.exports = mongoose.model("salt", SaltSchema);
