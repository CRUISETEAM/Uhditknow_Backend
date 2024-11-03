const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')

// 설정
const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION

// 액세스 토큰 발급
const generateAccessToken = async (user) => {
    const userData = await User.findByUserCode(user.usercode)
    return jwt.sign(
        { usercode: user.usercode, email: userData.email, role: userData.role }, // 포함할 정보
        JWT_SECRET, // 시크릿
        { expiresIn: ACCESS_TOKEN_EXPIRATION } // 만료 시간
    )
}

// 리프레시 토큰 발급
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { usercode: user.usercode },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
    )
    
    // 리프레시 토큰 저장
    await RefreshToken.create({
        usercode: user.usercode,
        refreshtoken: refreshToken,
        expires_at: new Date(Date.now() + 1209600000), // 만료 시간
        created_at: new Date(),
        revoked: false
    })
 
    return refreshToken
}

module.exports = { generateAccessToken, generateRefreshToken }