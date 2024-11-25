const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// looking_for 테이블에 대한 모델 정의
const LookingFor = sequelize.define('LookingFor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  writer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  detail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'looking_for',
  timestamps: false // createdAt, updatedAt 사용 여부
});

module.exports = LookingFor;
