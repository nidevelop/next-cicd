// api-lib/middlewares/auth.js

import { passport } from '@/api-lib/auth'; // passport 설정이 있는 auth 모듈 가져오기
import session from './session'; // 세션 미들웨어 가져오기

// auths는 세션과 passport 초기화, 세션 미들웨어들의 배열입니다.
const auths = [
  session, // 세션 미들웨어
  passport.initialize(), // passport 초기화 미들웨어
  passport.session(), // passport 세션 미들웨어
];

// 위에서 정의한 미들웨어 배열을 내보냅니다.
export default auths;
