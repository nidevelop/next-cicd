import { ValidateProps } from '@/api-lib/constants';
import { findUserByEmail, findUserByUsername, insertUser } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { slugUsername } from '@/lib/user';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

// next-connect 핸들러를 생성합니다.
const handler = nc(ncOpts);

// POST 요청을 처리하는 핸들러를 정의합니다.
handler.post(
  // 요청 본문을 검증하는 미들웨어를 사용합니다.
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['username', 'name', 'password', 'email'],
    additionalProperties: false,
  }),
  // 인증 관련 미들웨어를 사용합니다.
  ...auths,
  // 비동기 요청 핸들러 함수를 정의합니다.
  async (req, res) => {
    // MongoDB에 연결합니다.
    const db = await getMongoDb();

    // 요청 본문에서 정보를 추출합니다.
    let { username, name, email, password } = req.body;

    // 유저네임과 이메일을 정규화합니다.
    username = slugUsername(req.body.username);
    email = normalizeEmail(req.body.email);

    // 이메일 유효성을 검사합니다.
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }

    // 이메일이 이미 사용되고 있는지 확인합니다.
    if (await findUserByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }

    // 유저네임이 이미 사용되고 있는지 확인합니다.
    if (await findUserByUsername(db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
      return;
    }

    // 새로운 사용자를 데이터베이스에 추가합니다.
    const user = await insertUser(db, {
      email,
      originalPassword: password,
      bio: '',
      name,
      username,
    });

    // 사용자를 로그인 상태로 만들고, 유저 정보를 응답합니다.
    req.logIn(user, (err) => {
      if (err) throw err;
      res.status(201).json({
        user,
      });
    });
  }
);

// 핸들러를 export하여 다른 파일에서 사용할 수 있게 합니다.
export default handler;
