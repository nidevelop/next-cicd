import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

// 주어진 ID로 하나의 포스트를 찾는 함수
export async function findPostById(db, id) {
  // MongoDB로부터 포스트를 검색하는 쿼리:
  const posts = await db
    .collection('posts') // 'posts' 컬렉션에서
    .aggregate([
      // 아래의 집계 파이프라인을 실행
      { $match: { _id: new ObjectId(id) } }, // _id가 주어진 id와 일치하는 문서를 선택
      { $limit: 1 }, // 한 개의 문서만 가져옵니다.
      {
        // 'users' 컬렉션과 조인하여 'creator' 필드를 가져옵니다.
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' }, // 'creator' 배열을 언패킹합니다.
      { $project: dbProjectionUsers('creator.') }, // 'creator' 필드의 서브필드를 선택합니다.
    ])
    .toArray(); // 결과를 배열로 변환합니다.
  if (!posts[0]) return null; // 검색된 포스트가 없으면 null을 반환합니다.
  return posts[0]; // 검색된 포스트를 반환합니다.
}

// 여러 포스트를 조회하는 함수
export async function findPosts(db, before, by, limit = 10) {
  // MongoDB로부터 여러 포스트를 검색하는 쿼리:
  return db
    .collection('posts') // 'posts' 컬렉션에서
    .aggregate([
      // 아래의 집계 파이프라인을 실행
      {
        // $match 단계: 주어진 조건에 맞는 문서들만 선택합니다.
        $match: {
          // 'by' 값이 있으면 creatorId가 그와 일치하고
          ...(by && { creatorId: new ObjectId(by) }),
          // 'before' 값이 있으면 createdAt이 그보다 작은 것만 필터링합니다.
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } }, // _id 기준으로 내림차순 정렬합니다.
      { $limit: limit }, // 주어진 limit 값만큼만 문서를 가져옵니다.
      {
        // 'users' 컬렉션과 조인하여 'creator' 필드를 가져옵니다.
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' }, // 'creator' 배열을 언패킹합니다.
      { $project: dbProjectionUsers('creator.') }, // 'creator' 필드의 서브필드를 선택합니다.
    ])
    .toArray(); // 결과를 배열로 변환합니다.
}

// 새로운 포스트를 삽입하는 함수
export async function insertPost(db, { content, creatorId }) {
  // 새 포스트 객체를 생성합니다.
  const post = {
    content, // 포스트 내용
    creatorId, // 포스트 작성자 ID
    createdAt: new Date(), // 현재 날짜/시간
  };
  // 'posts' 컬렉션에 포스트를 삽입하고
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId; // 삽입된 포스트의 ID를 포스트 객체에 추가합니다.
  return post; // 새로 삽입된 포스트 객체를 반환합니다.
}
