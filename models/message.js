import sequelize from "../config/db";

const { Sequelize, Model, DataTypes } = require('sequelize');

const  message = sequelize.define("message",{
    user_id : {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    content : DataTypes.TEXT,
    content_type: DataTypes.STRING,
    conversation_id : {
        type: DataTypes.INTEGER,
        references: {
            model: 'conversations',
            key: 'id',
        }
    },
}, {  tableName: 'messages' });

message.TYPE = {
    P2P:0,
    GRP:1
};

(async () => {
    await sequelize.sync();
})();


export default message;
