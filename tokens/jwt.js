const jwt = require('jsonwebtoken')
require('dotenv').config()

// 설정
const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION

// 액세스 토큰 발급
const generateAccessToken = (user) => {
    return jwt.sign(
        { usercode: user.usercode, email: user.email }, // 포함할 정보
        JWT_SECRET, // 시크릿
        { expiresIn: ACCESS_TOKEN_EXPIRATION } // 만료 시간
    )
}

module.exports = { generateAccessToken }