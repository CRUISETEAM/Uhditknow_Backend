const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT
const sequelize = require('./config/db') // Sequelize 설정 가져오기
const LookingFor = require('./models/LookingFor') // Model 가져오기
const Got = require('./models/Got')
const User = require('./models/User')
const JWT = require('./tokens/jwt')
const authenticateToken = require('./middlewares/authMiddleware')

const clientId = process.env.CLIENT_ID; // 클라이언트 ID
const clientSecret = process.env.CLIENT_SECRET; // 클라이언트 시크릿
const { BsmOauth } = require('bsm-oauth');
const bsmOauth = new BsmOauth(clientId, clientSecret);

app.use(express.json()) // 미들웨어
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
		withCredentials: true,
		optionsSuccessStatus: 200,
	}) 
)

sequelize.sync().then(() => {
    console.log('모델이 동기화되었습니다.')
}).catch(err => {
    console.error('동기화 실패:', err)
}); // DB 동기화 (모델 기준으로 테이블을 자동으로 생성)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

app.get('/lookingfor', authenticateToken, async (req, res) => {
    try {
        // looking_for 테이블의 모든 데이터를 조회
        const data = await LookingFor.findAll({raw: true});
        console.log('조회된 데이터:', data);
        res.json(data);  // 조회된 데이터를 JSON 형태로 반환
    } catch (err) {
        console.error('쿼리 실행 오류:', err);
        res.status(500).send('서버 오류');
    }
})

app.get('/got', authenticateToken, async (req, res) => {
    try {
        // got 테이블의 모든 데이터를 조회
        const data = await Got.findAll({raw: true});
        console.log('조회된 데이터:', data);
        res.json(data);  // 조회된 데이터를 JSON 형태로 반환
    } catch (err) {
        console.error('쿼리 실행 오류:', err);
        res.status(500).send('서버 오류');
    }
})

app.get('/lookingfor/:id', authenticateToken, async (req, res) => {
    try {
        // looking_for 테이블의 id를 통해 세부조회
        const data = await LookingFor.findAll({
            where: {
                id: req.params.id,
            },
            raw: true
        })
        console.log(data)
        res.json(data)
    } catch (err) {
        console.error('쿼리 실행 오류:', err)
        res.status(500).send('서버 오류')
    }
})

app.get('/got/:id', authenticateToken, async (req, res) => {
    try {
        // got 테이블의 id를 통해 세부조회
        const data = await Got.findAll({
            where: {
                id: req.params.id,
            },
            raw: true
        })
        console.log(data)
        res.json(data)
    } catch (err) {
        console.error('쿼리 실행 오류:', err)
        res.status(500).send('서버 오류')
    }
})

app.post('/lookingfor/add', authenticateToken, async (req, res) => {
    try {
        // 요청 본문에서 데이터 가져오기
        const { title, location, detail } = req.body;

        // 요청 데이터가 올바르게 입력되었는지 확인
        if (!title) {
            return res.status(400).json({ error: 'title 필드는 필수입니다.' });
        }

        // 데이터베이스에 새 레코드 생성
        const newLookingFor = await LookingFor.create({
            title: title,
            location: location,
            detail: detail
        })

        // 생성된 레코드를 클라이언트에게 응답으로 보내기
        res.status(201).json({
            message: '새 데이터가 성공적으로 추가되었습니다.',
            data: newLookingFor
        })
    } catch (err) {
        console.error('데이터 추가 오류:', err);
        res.status(500).json({ error: '서버 오류. 데이터를 추가할 수 없습니다.' });
    }
})

app.post('/got/add', authenticateToken, async (req, res) => {
    try {
        // 요청 본문에서 데이터 가져오기
        const { title, location, time, detail } = req.body;

        // 요청 데이터가 올바르게 입력되었는지 확인
        if (!title) {
            return res.status(400).json({ error: 'title 필드는 필수입니다.' });
        }

        // 데이터베이스에 새 레코드 생성
        const newGot = await Got.create({
            title: title,
            location: location,
            time: time,
            detail: detail
        })
        // 생성된 레코드를 클라이언트에게 응답으로 보내기
        res.status(201).json({
            message: '새 데이터가 성공적으로 추가되었습니다.',
            data: newGot
        })
    } catch (err) {
        console.error('데이터 추가 오류:', err);
        res.status(500).json({ error: '서버 오류. 데이터를 추가할 수 없습니다.' });
    }
})

app.get('/oauth', async (req, res) => {
    try {
        const authCode = req.query.code;
        const token = await bsmOauth.getToken(authCode); // 임시 인증코드를 유저 토큰으로 교환
        const resource = await bsmOauth.getResource(token); // 토큰으로 유저의 정보를 가져옴
        const doorpermission = false;
        const data = await User.findByUserCode(resource.userCode)
        if (data) {
            console.log('User found:', data);
        } else {
            console.log('User not found');
            await User.create({
                usercode: resource.userCode,
                email: resource.email,
                role: resource.role,
                name: resource.student.name,
                grade: resource.student.grade,
                classno: resource.student.classNo,
                studentno: resource.student.studentNo,
                doorpermission: doorpermission,
            })
        }
        const AccessToken = await JWT.generateAccessToken(data)
        const RefreshToken = await JWT.generateRefreshToken(data)
        console.log(AccessToken)
        console.log(RefreshToken)
        res.json({
            AccessToken,
            RefreshToken
        })
    } catch (err) {
        console.error('OAuth 처리 중 오류 발생:', err)
        res.status(500).send('서버 오류가 발생했습니다.')
    }
    
})