
import sequelize from "../config/db";
import user from "./user";
import conversation from "./conversation";
import conversation_member from "./conversation_member";
import message from "./message";

const models  = {
    user,
    conversation,
    conversation_member,
    message,
};
(async () => {
    //await sequelize.sync();
})();


export default models;
