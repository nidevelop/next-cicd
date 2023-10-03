import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '.';

// 게시글의 댓글들을 조회하는 함수
export async function findComments(db, postId, before, limit = 10) {
  // MongoDB에서 댓글들을 가져오는 로직:
  return db
    .collection('comments') // 'comments' 컬렉션에서
    .aggregate([
      // 아래의 집계 파이프라인을 실행
      {
        // $match 단계: 주어진 조건에 맞는 문서들만 고릅니다.
        $match: {
          // postId가 주어진 postId와 일치하고
          postId: new ObjectId(postId),
          // before 값이 있으면 createdAt이 그보다 작은 것만 필터링합니다.
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } }, // _id 기준으로 내림차순 정렬합니다.
      { $limit: limit }, // 주어진 limit 값만큼만 문서를 가져옵니다.
      {
        // $lookup 단계: 'users' 컬렉션과 조인하여 'creator' 필드를 가져옵니다.
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' }, // 'creator' 배열을 언패킹합니다.
      // $project 단계: dbProjectionUsers 함수로부터 얻은 프로젝션을 사용하여
      // 'creator' 필드의 서브필드를 선택합니다.
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray(); // 결과를 배열로 변환합니다.
}

// 새로운 댓글을 삽입하는 함수
export async function insertComment(db, postId, { content, creatorId }) {
  // 새 댓글 객체를 생성합니다.
  const comment = {
    content, // 댓글 내용
    postId: new ObjectId(postId), // ObjectId 형태로 변환된 postId
    creatorId, // 댓글 작성자 ID
    createdAt: new Date(), // 현재 날짜/시간
  };
  // 'comments' 컬렉션에 댓글을 삽입하고
  const { insertedId } = await db.collection('comments').insertOne(comment);
  comment._id = insertedId; // 삽입된 댓글의 ID를 댓글 객체에 추가합니다.
  return comment; // 새로 삽입된 댓글 객체를 반환합니다.
}
