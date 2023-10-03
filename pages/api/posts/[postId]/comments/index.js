import { ValidateProps } from '@/api-lib/constants';
import { findPostById } from '@/api-lib/db';
import { findComments, insertComment } from '@/api-lib/db/comment';
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

  // 요청된 post ID를 사용하여 게시물 검색
  const post = await findPostById(db, req.query.postId);

  // 게시물이 없는 경우 404 오류 응답
  if (!post) {
    return res.status(404).json({ error: { message: 'Post is not found.' } });
  }

  // 게시물의 댓글을 검색
  const comments = await findComments(
    db,
    req.query.postId,
    // before 쿼리가 있다면 Date 객체로 변환, 없다면 undefined
    req.query.before ? new Date(req.query.before) : undefined,
    // limit 쿼리가 있다면 숫자로 변환, 없다면 undefined
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  // 댓글을 JSON 형태로 응답
  return res.json({ comments });
});

// HTTP POST 요청 핸들러
handler.post(
  // 인증 미들웨어 사용
  ...auths,
  // 요청 본문의 유효성 검사 미들웨어 사용
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.comment.content,
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

    // 본문에서 내용 추출
    const content = req.body.content;

    // 요청된 post ID를 사용하여 게시물 검색
    const post = await findPostById(db, req.query.postId);

    // 게시물이 없는 경우 404 오류 응답
    if (!post) {
      return res.status(404).json({ error: { message: 'Post is not found.' } });
    }

    // 새 댓글 삽입
    const comment = await insertComment(db, post._id, {
      creatorId: req.user._id,
      content,
    });

    // 새로 생성된 댓글을 JSON 형태로 응답
    return res.json({ comment });
  }
);

export default handler;
