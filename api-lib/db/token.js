import { nanoid } from 'nanoid';

// 특정 ID와 타입을 가진 토큰을 찾는 함수
export function findTokenByIdAndType(db, id, type) {
  // 'tokens' 컬렉션에서 _id와 type이 주어진 파라미터와 일치하는 토큰을 찾습니다.
  return db.collection('tokens').findOne({
    _id: id,
    type,
  });
}

// 특정 ID와 타입을 가진 토큰을 찾아서 삭제하는 함수
export function findAndDeleteTokenByIdAndType(db, id, type) {
  // 'tokens' 컬렉션에서 _id와 type이 주어진 파라미터와 일치하는 토큰을 찾고 삭제합니다.
  // 그리고 삭제된 토큰 정보를 반환합니다.
  return db
    .collection('tokens')
    .findOneAndDelete({ _id: id, type })
    .then(({ value }) => value);
}

// 새로운 토큰을 생성하는 함수
export async function createToken(db, { creatorId, type, expireAt }) {
  // nanoid를 사용해 32자리의 안전한 토큰 ID를 생성합니다.
  const securedTokenId = nanoid(32);
  // 새 토큰 객체를 생성합니다.
  const token = {
    _id: securedTokenId, // 생성된 토큰 ID
    creatorId, // 토큰 생성자 ID
    type, // 토큰 타입
    expireAt, // 토큰 만료 시간
  };
  // 'tokens' 컬렉션에 새 토큰을 삽입합니다.
  await db.collection('tokens').insertOne(token);
  // 생성된 토큰을 반환합니다.
  return token;
}
