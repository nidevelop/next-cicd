import slug from 'slug'; // 'slug' 라이브러리를 가져옵니다.

// 사용자 이름을 슬러그 형식으로 변환하는 함수입니다.
export const slugUsername = (username) => {
  // slug 함수는 문자열을 URL 친화적인 슬러그 형식으로 변환합니다.
  // 여기에서, username을 입력으로 받아 '_'(언더스코어)를 구분자로 사용하여 슬러그를 생성합니다.
  return slug(username, '_');
};
