import sequelize from "../config/db";

const { Sequelize, Model, DataTypes } = require('sequelize');

const user = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING
}, { tableName: 'users' });


export default user;
