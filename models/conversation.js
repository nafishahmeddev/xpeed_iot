import sequelize from "../config/db";

const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');


const conversation = sequelize.define("conversation",{
    title: DataTypes.STRING,
    picture: DataTypes.STRING,
    type : DataTypes.INTEGER,
    admin_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
}, {  tableName: 'conversations' });

conversation.TYPE = {
    P2P:0,
    GRP:1
};


conversation.getConversations = (user_id) =>{
    return new Promise(async (resolve, reject) => {
            try {
                let sql = `SELECT DISTINCT 
                cm.conversation_id as id, 
                IF(c.type=${conversation.TYPE.GRP}, c.title, (SELECT u.name FROM users u WHERE u.id = (SELECT cm2.user_id FROM conversation_members cm2 WHERE cm2.conversation_id=c.id AND cm2.user_id!=${user_id}))) as title,
                IF(c.type=${conversation.TYPE.GRP}, c.picture, (SELECT u.name FROM users u WHERE u.id = (SELECT cm3.user_id FROM conversation_members cm3 WHERE cm3.conversation_id=c.id AND cm3.user_id!=${user_id}))) as picture,
                (SELECT m.content FROM messages m WHERE m.conversation_id=c.id LIMIT 1) as last_message
                
                FROM conversation_members cm
                    INNER JOIN conversations c on cm.conversation_id = c.id
                    WHERE cm.user_id=?`;
                let query = sequelize.query(sql, {
                    replacements: [user_id],
                    type: QueryTypes.SELECT,
                    raw: true,
                });

                resolve(query);
            } catch (e) {
                reject(e);
            }
        }
    )
}
(async () => {
    await sequelize.sync();
})();

export default conversation;
