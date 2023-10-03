// 이 프로젝트는 이메일을 보내기 위해 nodemailer 라이브러리를 사용합니다.
// 그러나 Mailgun, AWS SES 등의 전용 이메일 서비스로 전환하는 것이 권장됩니다.
import nodemailer from 'nodemailer';

// 환경 변수에서 nodemailer 설정을 가져옵니다.
// 환경 변수가 설정되지 않았다면 기본값으로 빈 객체를 사용합니다.
const nodemailerConfig = process.env.NODEMAILER_CONFIG
  ? JSON.parse(process.env.NODEMAILER_CONFIG)
  : {};

// nodemailerConfig를 사용하여 이메일 전송 객체를 생성합니다.
const transporter = nodemailer.createTransport(nodemailerConfig);

// 이메일을 보내는 함수
export async function sendMail({ from, to, subject, html }) {
  try {
    // transporter를 사용하여 이메일을 보냅니다.
    await transporter.sendMail({
      from, // 보내는 사람의 이메일 주소
      to, // 받는 사람의 이메일 주소
      subject, // 이메일 제목
      html, // 이메일 본문 (HTML 형식)
    });
  } catch (e) {
    // 이메일 전송 중 오류가 발생하면 에러를 던집니다.
    throw new Error(`Could not send email: ${e.message}`);
  }
}

export const CONFIG = {
  // TODO: 이메일을 보내는 데 사용하려는 이메일로 교체하세요.
  from: nodemailerConfig?.auth?.user,
};
