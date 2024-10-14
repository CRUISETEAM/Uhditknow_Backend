const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// user 테이블에 대한 모델 정의
const User = sequelize.define('User', {
  usercode: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doorpermission: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  tableName: 'user',
  timestamps: false // createdAt, updatedAt 사용 여부
});

module.exports = User;