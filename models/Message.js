const { Model, DataTypes } = require('sequelize');

class Message extends Model {
    static init(sequelize) {
        return super.init({
            message_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
            },
            chat_id: DataTypes.BIGINT,
            message: DataTypes.TEXT,
            text: DataTypes.STRING,
        }, { sequelize, modelName: 'Message' });
    }
}

module.exports = Message;