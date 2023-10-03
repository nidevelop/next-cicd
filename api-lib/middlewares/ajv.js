import Ajv from 'ajv';

// validateBody는 Request Body를 검증하는 미들웨어 생성 함수입니다.
export function validateBody(schema) {
  // Ajv 인스턴스를 생성합니다.
  const ajv = new Ajv();
  // 스키마를 컴파일하여 validate 함수를 생성합니다.
  const validate = ajv.compile(schema);

  // 생성된 미들웨어 함수입니다.
  return (req, res, next) => {
    // validate 함수를 사용하여 요청 본문(req.body)를 검증합니다.
    const valid = validate(req.body);

    // 검증이 성공하면 다음 미들웨어로 넘어갑니다.
    if (valid) {
      return next();
    } else {
      // 검증이 실패하면 첫 번째 에러를 가져옵니다.
      const error = validate.errors[0];
      // 응답으로 400 상태 코드와 에러 메시지를 전송합니다.
      return res.status(400).json({
        error: {
          // 에러 메시지를 생성합니다. 예: "password 필드는 최소 8자여야 합니다."
          message: `"${error.instancePath.substring(1)}" ${error.message}`,
        },
      });
    }
  };
}
