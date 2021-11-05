const Mongoose = require("mongoose");
const Conversations = Mongoose.model("conversations", new Mongoose.Schema({
    title: {
        type: String,
    },
    type: {},
    members: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
}));;
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
Conversations.createGroup = ( title, users=[]) => {
    return new Promise((resolve, reject)=>{
        Conversations.create({
            //members: users.map(ob=>Mongoose.)
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
