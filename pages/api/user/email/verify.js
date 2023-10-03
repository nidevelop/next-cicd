import { createToken } from '@/api-lib/db';
import { CONFIG as MAIL_CONFIG, sendMail } from '@/api-lib/mail';
import { auths } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

// next-connect 핸들러 초기화
const handler = nc(ncOpts);

// 인증 미들웨어 사용
handler.use(...auths);

// POST 요청 처리 핸들러
handler.post(async (req, res) => {
  // 사용자가 로그인하지 않았다면 401 응답
  if (!req.user) {
    res.json(401).end();
    return;
  }

  // MongoDB에 연결
  const db = await getMongoDb();

  // 이메일 확인을 위한 토큰 생성
  // 토큰은 사용자 ID와 유효 시간을 가지고 있습니다. (24시간)
  const token = await createToken(db, {
    creatorId: req.user._id,
    type: 'emailVerify',
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  // 사용자 이메일로 확인 메일을 보냄
  await sendMail({
    to: req.user.email,
    from: MAIL_CONFIG.from,
    subject: `Verification Email for ${process.env.WEB_URI}`,
    // 이메일의 HTML 본문. 사용자에게 이메일 확인 링크를 보냄.
    html: `
      <div>
        <p>Hello, ${req.user.name}</p>
        <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token._id}">this link</a> to confirm your email.</p>
      </div>
      `,
  });

  // 성공적으로 처리되었음을 알리기 위해 204 상태 코드 응답
  res.status(204).end();
});

export default handler;
