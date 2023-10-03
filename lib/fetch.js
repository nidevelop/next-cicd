// fetcher 함수를 정의합니다.
export const fetcher = (...args) => {
  // fetch 함수를 사용해 네트워크 요청을 합니다. then 메소드를 통해 응답(res)을 처리합니다.
  return fetch(...args).then(async (res) => {
    let payload; // 응답 본문(payload)을 저장할 변수를 정의합니다.
    try {
      // 만약 응답의 상태 코드가 204라면 본문이 없다는 뜻이므로 null을 반환합니다.
      if (res.status === 204) return null;
      // 그렇지 않다면 응답 본문을 JSON 형태로 파싱합니다.
      payload = await res.json();
    } catch (e) {
      // 에러가 발생한 경우 에러를 무시합니다(noop: no operation).
      /* noop */
    }
    // 응답이 성공적(상태 코드가 2xx)인 경우, 파싱된 응답 본문(payload)을 반환합니다.
    if (res.ok) {
      return payload;
    } else {
      // 응답이 실패한 경우, payload.error를 거부하거나 새로운 에러를 생성하여 거부합니다.
      return Promise.reject(payload.error || new Error('Something went wrong'));
    }
  });
};
