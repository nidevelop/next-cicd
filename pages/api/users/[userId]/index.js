import { findUserById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

// next-connect 핸들러를 초기화합니다.
const handler = nc(ncOpts);

// GET 요청을 처리하는 핸들러를 정의합니다.
handler.get(async (req, res) => {
  // MongoDB에 연결합니다.
  const db = await getMongoDb();

  // 쿼리로부터 userId를 받아와서 해당 유저를 데이터베이스에서 찾습니다.
  const user = await findUserById(db, req.query.userId);

  // 찾은 유저 정보를 JSON 형식으로 응답합니다.
  res.json({ user });
});

// 외부에서 핸들러를 사용할 수 있도록 export합니다.
export default handler;
