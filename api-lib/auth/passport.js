// 필요한 모듈들을 가져옵니다.
import { findUserForAuth, findUserWithEmailAndPassword } from '@/api-lib/db'; // 사용자 인증을 위한 데이터베이스 관련 함수들
import passport from 'passport'; // 주요 Passport 인증 모듈
import { Strategy as LocalStrategy } from 'passport-local'; // 사용자 이름과 패스워드로 인증하는 Passport 전략
import { getMongoDb } from '../mongodb'; // MongoDB 연결을 가져오는 함수

// 사용자 인스턴스를 세션에 직렬화합니다.
passport.serializeUser((user, done) => {
  // 로그인한 사용자를 식별하기 위해 user._id를 사용합니다.
  done(null, user._id);
});

// 세션에서 사용자 인스턴스를 역직렬화합니다.
passport.deserializeUser((req, id, done) => {
  // MongoDB 인스턴스를 가져옵니다.
  getMongoDb().then((db) => {
    // ID로 사용자를 찾고 결과를 다룹니다.
    findUserForAuth(db, id).then(
      (user) => done(null, user), // 사용자가 발견되면, 사용자 객체로 진행합니다.
      (err) => done(err) // 오류가 있으면, 오류로 진행합니다.
    );
  });
});

// 이메일과 패스워드 인증을 위해 Passport의 로컬 전략을 사용합니다.
passport.use(
  new LocalStrategy(
    // 기본 usernameField를 "email"로 오버라이드하고 요청 콜백을 활성화합니다.
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      // MongoDB 인스턴스를 가져옵니다.
      const db = await getMongoDb();
      // 주어진 이메일과 패스워드로 사용자를 찾습니다.
      const user = await findUserWithEmailAndPassword(db, email, password);
      // 사용자가 발견되면, 해당하는 처리를 합니다.
      if (user)
        done(null, user); // 사용자가 발견되면, 사용자 객체로 진행합니다.
      else
        done(null, false, {
          message: '이메일 혹은 패스워드가 올바르지 않습니다',
        }); // 발견되지 않으면, 오류 메시지와 함께 진행합니다.
    }
  )
);

// 설정된 passport를 기본 export로 내보냅니다.
export default passport;
