import { ValidateProps } from '@/api-lib/constants';
import {
  createToken,
  findAndDeleteTokenByIdAndType,
  findUserByEmail,
  UNSAFE_updateUserPassword,
} from '@/api-lib/db';
import { CONFIG as MAIL_CONFIG, sendMail } from '@/api-lib/mail';
import { validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import normalizeEmail from 'validator/lib/normalizeEmail';

// next-connect 핸들러 초기화
const handler = nc(ncOpts);

// POST 요청 처리 핸들러
handler.post(
  // 요청 본문 유효성 검사 미들웨어
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
    },
    required: ['email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    // MongoDB에 연결
    const db = await getMongoDb();

    // 이메일 정규화 및 사용자 찾기
    const email = normalizeEmail(req.body.email);
    const user = await findUserByEmail(db, email);
    // 사용자가 없다면 400 에러 응답과 메시지 전송
    if (!user) {
      res.status(400).json({
        error: {
          message: '해당 이메일을 찾을 수 없습니다. 다시 시도해 주세요.',
        },
      });
      return;
    }

    // 토큰 생성
    const token = await createToken(db, {
      creatorId: user._id,
      type: 'passwordReset',
      expireAt: new Date(Date.now() + 1000 * 60 * 20), // 20분 후 만료
    });

    // 비밀번호 재설정 이메일 전송
    await sendMail({
      to: email,
      from: MAIL_CONFIG.from,
      subject: '[nextjs-mongodb-app] 비밀번호를 재설정하세요.',
      html: `
      <div>
        <p>안녕하세요, ${user.name}님</p>
        <p>비밀번호를 재설정하려면 <a href="${process.env.WEB_URI}/forget-password/${token._id}">이 링크</a>를 클릭하세요.</p>
      </div>
      `,
    });

    // 204 상태 코드로 응답 (성공적으로 처리됨, 응답 본문 없음)
    res.status(204).end();
  }
);

// PUT 요청 처리 핸들러
handler.put(
  // 요청 본문 유효성 검사 미들웨어
  validateBody({
    type: 'object',
    properties: {
      password: ValidateProps.user.password,
      token: { type: 'string', minLength: 1 },
    },
    required: ['password', 'token'],
    additionalProperties: false,
  }),
  async (req, res) => {
    // MongoDB에 연결
    const db = await getMongoDb();

    // 토큰 찾기 및 삭제
    const deletedToken = await findAndDeleteTokenByIdAndType(
      db,
      req.body.token,
      'passwordReset'
    );
    // 토큰이 없다면 403 에러 응답
    if (!deletedToken) {
      res.status(403).end();
      return;
    }

    // 사용자 비밀번호 업데이트 (UNSAFE 메소드 주의)
    await UNSAFE_updateUserPassword(
      db,
      deletedToken.creatorId,
      req.body.password
    );
    // 204 상태 코드로 응답
    res.status(204).end();
  }
);

export default handler;
