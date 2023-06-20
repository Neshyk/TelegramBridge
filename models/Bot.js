const { Model, DataTypes } = require('sequelize');

class Bot extends Model {
    static init(sequelize) {
        return super.init({
            token: DataTypes.STRING,
            lastMessageId: DataTypes.BIGINT
        }, { sequelize, modelName: 'Bot' });
    }
}

module.exports = Bot;