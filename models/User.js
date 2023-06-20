const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                allowNull: false,
            },
            phoneNumber:{
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            modelName: 'User'
        });
    }
}

module.exports = User;