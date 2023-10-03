// api-lib\mongodb.js 파일 내용

import { MongoClient } from 'mongodb';

// 인덱스 생성 상태를 추적하기 위한 변수입니다. 이미 인덱스가 생성되었는지 확인하는데 사용됩니다.
let indexesCreated = false;

// MongoDB 클라이언트를 인자로 받아서 각 컬렉션에 인덱스를 생성하는 함수입니다.
async function createIndexes(client) {
  // 인덱스가 이미 생성된 경우, client를 그대로 반환합니다.
  if (indexesCreated) return client;

  // 데이터베이스 인스턴스를 가져옵니다.
  const db = client.db();

  // 다양한 컬렉션에 대해 인덱스를 생성합니다.
  // 모든 인덱스 생성 작업은 비동기로 실행되므로, Promise.all을 사용해 모든 프로미스가 완료될 때까지 기다립니다.
  await Promise.all([
    // 'tokens' 컬렉션에 만료 시간(expireAt)을 기준으로 인덱스를 생성합니다.
    db
      .collection('tokens')
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),

    // 'posts' 컬렉션에 생성 시간(createdAt)과 생성자 ID(creatorId)를 기준으로 인덱스를 생성합니다.
    db
      .collection('posts')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { creatorId: -1 } }]),

    // 'comments' 컬렉션에 생성 시간(createdAt)과 게시글 ID(postId)를 기준으로 인덱스를 생성합니다.
    db
      .collection('comments')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),

    // 'users' 컬렉션에 이메일(email)과 사용자명(username)을 기준으로 인덱스를 생성하며, 각각은 고유해야 합니다.
    db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
    ]),
  ]);

  // 인덱스 생성이 완료되었음을 표시합니다.
  indexesCreated = true;

  return client;
}

// MongoDB 클라이언트를 반환하는 함수입니다.
// 전역 변수 global.mongoClientPromise를 사용하여 한 번 생성된 클라이언트 인스턴스를 재사용합니다.
export async function getMongoClient() {
  /**
   * global은 여기서 개발 중에 핫 리로드를 거쳐 캐시된 연결을 유지하기 위해 사용됩니다.
   * 이것은 API 루트 사용 중에 연결이 지수 함수적으로 증가하는 것을 방지합니다.
   * https://github.com/vercel/next.js/pull/17666
   */
  // 연결이 아직 없는 경우 새로운 클라이언트 인스턴스를 생성하고 연결합니다.
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    // client.connect()는 이행될 때 MongoClient 인스턴스를 반환합니다.
    global.mongoClientPromise = client
      .connect()
      .then((client) => createIndexes(client));
  }

  return global.mongoClientPromise;
}

// MongoDB 데이터베이스 인스턴스를 반환하는 함수입니다.
export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}
