export const ncOpts = {
  // onError는 Next Connect의 에러 핸들러입니다.
  // 이 함수는 모든 미들웨어에서 발생한 에러를 처리합니다.
  onError(err, req, res) {
    // 에러를 콘솔에 기록합니다.
    console.error(err);

    // 에러 객체에 status 프로퍼티가 존재하고, 그 값이 100에서 599 사이인 경우,
    // 그 값을 HTTP 상태 코드로 사용합니다.
    // 그렇지 않으면 기본적으로 500 (서버 내부 에러) 상태 코드를 사용합니다.
    res.statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;

    // 응답 본문에 에러 메시지를 JSON 형태로 반환합니다.
    res.json({ message: err.message });
  },
};
