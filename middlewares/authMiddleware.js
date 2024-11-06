const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT = require('../tokens/jwt')
const RefreshToken = require('../models/RefreshToken')

const JWT_SECRET = process.env.JWT_SECRET

// 엑세스 토큰 검증
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'] // 헤더 Authorization 추출
    const accessToken = authHeader && authHeader.split(' ')[1] // Bearer 토큰 추출

    if (!accessToken) return res.sendStatus(401) // 토큰이 없으면 401 Unauthorized 응답

    jwt.verify(accessToken, JWT_SECRET, async (err, user) => {
        if (err) {
            const refreshToken = req.headers['x-refresh-token']
            if (!refreshToken) return res.sendStatus(401)

            try {
                const decoded = jwt.verify(refreshToken, JWT_SECRET)
                const refreshTokenDB = await RefreshToken.findOne({where: {usercode: decoded.usercode, refreshtoken: refreshToken}})

                if(!refreshTokenDB) return res.sendStatus(403) // 토큰이 없음

                const newAccessToken = await JWT.generateAccessToken(decoded)
                req.user = { usercode: decoded.usercode }
                console.log(newAccessToken)
                return res.json({ accessToken: newAccessToken })
            } catch (refreshError) {
                return res.sendStatus(403) // 토큰이 유효하지 않으면 403 Forbidden 응답
            }
        } else {
            req.user = user
            next()
        }
    })
}

module.exports = authenticateToken