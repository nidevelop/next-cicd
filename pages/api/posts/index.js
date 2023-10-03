import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

// API 핸들러 초기화
const handler = nc(ncOpts);

// HTTP GET 요청 핸들러
handler.get(async (req, res) => {
  // MongoDB에 연결
  const db = await getMongoDb();

  // findPosts 함수를 사용하여 데이터베이스로부터 게시물을 가져옴
  const posts = await findPosts(
    db,
    // before 쿼리가 있다면 Date 객체로 변환, 없다면 undefined
    req.query.before ? new Date(req.query.before) : undefined,
    // 작성자 ID
    req.query.by,
    // 제한이 있다면 숫자로 변환, 없다면 undefined
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  // 결과를 JSON 형태로 응답
  res.json({ posts });
});

// HTTP POST 요청 핸들러
handler.post(
  // 인증 미들웨어 사용
  ...auths,
  // 요청 본문의 유효성 검사 미들웨어 사용
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.post.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    // 인증되지 않은 사용자의 경우 401 응답 반환
    if (!req.user) {
      return res.status(401).end();
    }

    // MongoDB에 연결
    const db = await getMongoDb();

    // insertPost 함수를 사용하여 새 게시물을 데이터베이스에 삽입
    const post = await insertPost(db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    // 새로 생성된 게시물을 JSON 형태로 응답
    return res.json({ post });
  }
);

export default handler;
