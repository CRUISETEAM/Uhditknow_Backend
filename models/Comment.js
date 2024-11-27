const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const LookingFor = require('./LookingFor');
// comment 테이블에 대한 모델 정의
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  writer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lookingforid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: LookingFor,
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
}, {
  tableName: 'comment',
  timestamps: false // createdAt, updatedAt 사용 여부
});

module.exports = Comment;
