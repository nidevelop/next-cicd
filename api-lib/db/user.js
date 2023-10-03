import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import normalizeEmail from 'validator/lib/normalizeEmail';

// 이메일과 비밀번호로 사용자를 찾는 함수
export async function findUserWithEmailAndPassword(db, email, password) {
  // 이메일 정규화 (normalizeEmail 함수를 사용해서)
  email = normalizeEmail(email);
  // 이메일로 사용자를 찾음
  const user = await db.collection('users').findOne({ email });
  // 사용자가 존재하고, bcrypt로 해싱된 비밀번호와 입력된 비밀번호가 일치하면
  if (user && (await bcrypt.compare(password, user.password))) {
    // 비밀번호를 제외한 사용자 정보를 반환
    return { ...user, password: undefined };
  }
  // 사용자를 찾지 못했거나 비밀번호가 일치하지 않는다면 null 반환
  return null;
}

// 인증을 위해 사용자를 찾는 함수
export async function findUserForAuth(db, userId) {
  // 사용자 ID를 기반으로 사용자를 찾아 비밀번호를 제외한 사용자 정보 반환
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null);
}

// ID를 통해 사용자를 찾는 함수
export async function findUserById(db, userId) {
  // 사용자 ID로 사용자를 찾고, 일부 정보를 프로젝션해서 반환
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// 사용자명으로 사용자를 찾는 함수
export async function findUserByUsername(db, username) {
  // 사용자명으로 사용자를 찾고, 일부 정보를 프로젝션해서 반환
  return db
    .collection('users')
    .findOne({ username }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// 이메일로 사용자를 찾는 함수
export async function findUserByEmail(db, email) {
  // 이메일 정규화
  email = normalizeEmail(email);
  // 이메일로 사용자를 찾고, 일부 정보를 프로젝션해서 반환
  return db
    .collection('users')
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// ID로 사용자 정보를 업데이트하는 함수
export async function updateUserById(db, id, data) {
  // 사용자 ID를 기반으로 일부 데이터를 업데이트하고 비밀번호를 제외한 사용자 정보를 반환
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

// 새 사용자를 삽입하는 함수
export async function insertUser(
  db,
  { email, originalPassword, bio = '', name, profilePicture, username }
) {
  // 새 사용자 객체 생성
  const user = {
    emailVerified: false,
    profilePicture,
    email,
    name,
    username,
    bio,
  };
  // 원본 비밀번호를 bcrypt로 해시
  const password = await bcrypt.hash(originalPassword, 10);
  // 사용자를 'users' 컬렉션에 삽입하고 삽입된 ID를 사용자 객체에 추가
  const { insertedId } = await db
    .collection('users')
    .insertOne({ ...user, password });
  user._id = insertedId;
  // 사용자 객체 반환
  return user;
}

// 이전 비밀번호를 이용해 사용자의 비밀번호를 업데이트하는 함수
export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  // 사용자를 ID로 찾음
  const user = await db.collection('users').findOne(new ObjectId(id));
  // 사용자가 없으면 false 반환
  if (!user) return false;
  // 이전 비밀번호가 맞는지 확인
  const matched = await bcrypt.compare(oldPassword, user.password);
  // 비밀번호가 맞지 않으면 false 반환
  if (!matched) return false;
  // 새 비밀번호를 bcrypt로 해시
  const password = await bcrypt.hash(newPassword, 10);
  // 사용자의 비밀번호 업데이트
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  // 업데이트 성공하면 true 반환
  return true;
}

// [비안전] 사용자 비밀번호를 바로 업데이트하는 함수
export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  // 새 비밀번호를 bcrypt로 해시
  const password = await bcrypt.hash(newPassword, 10);
  // 사용자의 비밀번호를 업데이트
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

// 사용자 정보 프로젝션을 위한 함수
export function dbProjectionUsers(prefix = '') {
  // 특정 prefix를 사용해 비밀번호, 이메일, 이메일 검증 상태를 제외한 사용자 정보 프로젝션
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}
