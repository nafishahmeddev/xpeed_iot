const Mongoose = require("mongoose");
const ConversationSchema = new Mongoose.Schema({
    title: {
        type: String,
    },
    type: {},
    adminId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    members: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
});
const Conversations = Mongoose.model("conversations", ConversationSchema);
Conversations.getConversations = (user_id, type = 0) =>{
    return Conversations.aggregate([
        {
            $match:{
                members : { $ne: new Mongoose.Types.ObjectId(user_id)}
            }
        },
        {
            $lookup: {
                from: "users",
                let:{
                    members : "$members"
                },
                pipeline : [
                    {
                        $match: {
                            $expr: {
                                $and: {
                                    $ne: ["$_id", '$$members']
                                }
                            }
                        }
                    },
                    { $project : { _id:1, name:1 } }
                ],
                as: "members",
            }
        },

        { $unwind: "$members" },
        // Group back to arrays
        {
            $group: {
                "_id": "$_id",
                "title": { "$first": "$title"},
                "type": { "$first": "$type"},
                "members": {"$push": "$members"}
            }
        }
    ]);
}
Conversations.createGroup = ( admin_id, title, users=[]) => {
    users = users.push(admin_id);
    return new Promise((resolve, reject)=>{
        Conversations.create({
            adminId: new Mongoose.Types.ObjectId(admin_id),
            members: users.map(ob=>new Mongoose.Types.ObjectId(ob)),
            type:1,
            title
        }, function (err, small) {
            if (err)
                return reject(err);
            resolve({
                success:true
            });
            // saved!
        });
    })
}

// export model user with ConversationSchema
module.exports = Conversations;
