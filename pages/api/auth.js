import { passport } from '@/api-lib/auth'; // 인증과 관련된 기능들을 가지고 있는 passport를 불러옵니다.
import { auths } from '@/api-lib/middlewares'; // 미들웨어들을 auths로 불러옵니다.
import { ncOpts } from '@/api-lib/nc'; // nc에 대한 옵션을 ncOpts로 불러옵니다.
import nc from 'next-connect'; // next-connect 라이브러리를 nc로 불러옵니다.

// next-connect 핸들러를 생성하며, ncOpts를 설정으로 사용합니다.
const handler = nc(ncOpts);

// auths 미들웨어를 핸들러에 사용합니다.
handler.use(...auths);

// POST 요청 핸들러를 정의합니다.
handler.post(
  // local 전략을 사용하여 인증을 수행합니다.
  passport.authenticate('local'),
  (req, res) => {
    // 인증이 성공하면, 사용자 정보를 JSON 형태로 응답합니다.
    res.json({ user: req.user });
  }
);

// DELETE 요청 핸들러를 정의합니다.
handler.delete(async (req, res) => {
  // 세션을 파괴합니다.
  await req.session.destroy();
  // 상태 코드 204를 보내고 응답을 종료합니다.
  res.status(204).end();
});

// 핸들러를 내보냅니다. 다른 파일에서 이를 임포트해 사용할 수 있습니다.
export default handler;
