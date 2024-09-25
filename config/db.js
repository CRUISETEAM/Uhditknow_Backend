const { Sequelize } = require('sequelize');

// Sequelize 인스턴스 생성 (DB 연결 설정)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mariadb',
});

// DB 연결 테스트
sequelize.authenticate()
  .then(() => {
    console.log('MySQL 데이터베이스에 성공적으로 연결되었습니다.');
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류:', err);
  });

module.exports = sequelize;