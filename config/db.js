const {Sequelize} = require("sequelize");
const sequelize = new Sequelize('mutex_db', 'mutex_user', 'qwerty12345', {
    host: 'loginmyschool.com',
    dialect: 'mariadb'
});
export  default sequelize;
