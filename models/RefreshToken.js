const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

//refreshtoken 테이블에 대한 모델 정의
const refreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usercode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'usercode'
        }
    },
    refreshtoken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    }, {
      tableName: 'refresh_token',
      timestamps: false
});

module.exports = RefreshToken;