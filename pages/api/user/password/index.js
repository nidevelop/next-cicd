import { ValidateProps } from '@/api-lib/constants';
import { updateUserPasswordByOldPassword } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

// next-connect 핸들러 초기화
const handler = nc(ncOpts);
// 인증 미들웨어 사용
handler.use(...auths);

// PUT 요청 처리 핸들러
handler.put(
  // 요청 본문 유효성 검사 미들웨어
  validateBody({
    type: 'object',
    properties: {
      oldPassword: ValidateProps.user.password,
      newPassword: ValidateProps.user.password,
    },
    required: ['oldPassword', 'newPassword'],
    additionalProperties: false,
  }),
  async (req, res) => {
    // 사용자가 로그인하지 않았다면 401 응답
    if (!req.user) {
      res.json(401).end();
      return;
    }

    // MongoDB에 연결
    const db = await getMongoDb();

    // 요청 본문에서 비밀번호 정보 추출
    const { oldPassword, newPassword } = req.body;

    // 기존 비밀번호를 사용하여 사용자의 비밀번호 업데이트
    const success = await updateUserPasswordByOldPassword(
      db,
      req.user._id,
      oldPassword,
      newPassword
    );

    // 업데이트가 성공하지 않았다면 401 응답과 에러 메시지 전송
    if (!success) {
      res.status(401).json({
        error: { message: '입력하신 기존 비밀번호가 정확하지 않습니다.' },
      });
      return;
    }

    // 성공적으로 처리되었음을 알리기 위해 204 상태 코드 응답
    res.status(204).end();
  }
);

export default handler;
