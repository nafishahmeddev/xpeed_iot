import sequelize from "../config/db";

const { Sequelize, Model, DataTypes } = require('sequelize');


const conversation_member = sequelize.define("conversation_member",{
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'conversations',
            key: 'id',
        }
    },
}, { tableName: 'conversation_members' });

export default  conversation_member;
