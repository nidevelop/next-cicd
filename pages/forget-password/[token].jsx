// 데이터베이스와 관련된 기능을 findTokenByIdAndType로 불러옵니다.
import { findTokenByIdAndType } from '@/api-lib/db';
// MongoDB에 연결하는 함수를 불러옵니다.
import { getMongoDb } from '@/api-lib/mongodb';
// ForgetPasswordToken 컴포넌트를 불러옵니다.
import { ForgetPasswordToken } from '@/page-components/ForgetPassword';
// Head 컴포넌트를 불러옵니다.
import Head from 'next/head';

// ResetPasswordTokenPage 컴포넌트를 정의합니다.
const ResetPasswordTokenPage = ({ valid, token }) => {
  return (
    <>
      <Head>
        {/* 페이지의 제목을 설정합니다. */}
        <title>Forget password</title>
      </Head>
      {/* ForgetPasswordToken 컴포넌트를 렌더링하고 valid 및 token prop을 전달합니다. */}
      <ForgetPasswordToken valid={valid} token={token} />
    </>
  );
};

// getServerSideProps 함수를 정의하여 서버 사이드 렌더링 시 필요한 prop을 생성합니다.
export async function getServerSideProps(context) {
  // MongoDB에 연결합니다.
  const db = await getMongoDb();

  // 토큰을 데이터베이스에서 찾습니다.
  const tokenDoc = await findTokenByIdAndType(
    db,
    context.params.token,
    'passwordReset'
  );

  // 찾아낸 토큰의 유효성과 토큰 값을 prop으로 반환합니다.
  return { props: { token: context.params.token, valid: !!tokenDoc } };
}

// ResetPasswordTokenPage 컴포넌트를 내보냅니다.
export default ResetPasswordTokenPage;
