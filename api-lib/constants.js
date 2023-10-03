// api-lib\constants.js 파일 내용

// ValidateProps 객체는 사용자, 게시글, 댓글 등의 데이터 유효성 검사를 위한 속성을 정의합니다.
export const ValidateProps = {
  // user 객체는 사용자 데이터의 유효성 검사 규칙을 정의합니다.
  user: {
    // 사용자명(username)은 문자열 타입이며, 최소 4자, 최대 20자로 제한됩니다.
    username: { type: 'string', minLength: 4, maxLength: 20 },

    // 이름(name)은 문자열 타입이며, 최소 1자, 최대 50자로 제한됩니다.
    name: { type: 'string', minLength: 1, maxLength: 50 },

    // 비밀번호(password)는 문자열 타입이며, 최소 8자로 제한됩니다.
    password: { type: 'string', minLength: 8 },

    // 이메일(email)은 문자열 타입이며, 최소 1자로 제한됩니다.
    email: { type: 'string', minLength: 1 },

    // 소개글(bio)은 문자열 타입이며, 최소 0자, 최대 160자로 제한됩니다.
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },

  // post 객체는 게시글 데이터의 유효성 검사 규칙을 정의합니다.
  post: {
    // 게시글 내용(content)은 문자열 타입이며, 최소 1자, 최대 280자로 제한됩니다.
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },

  // comment 객체는 댓글 데이터의 유효성 검사 규칙을 정의합니다.
  comment: {
    // 댓글 내용(content)은 문자열 타입이며, 최소 1자, 최대 280자로 제한됩니다.
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
};
