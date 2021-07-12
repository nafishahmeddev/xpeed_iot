const mongoose = require("mongoose");

const DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type:String,
        required: true
    },
    status:{
        type: Integer,
        required: true,
    }
});

// export model user with UserSchema
module.exports = mongoose.model("device", DeviceSchema);
