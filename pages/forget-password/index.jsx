// ForgetPasswordIndex 컴포넌트를 불러옵니다.
import { ForgetPasswordIndex } from '@/page-components/ForgetPassword';
// Head 컴포넌트를 불러옵니다.
import Head from 'next/head';

// ForgetPasswordPage 컴포넌트를 정의합니다.
const ForgetPasswordPage = () => {
  return (
    <>
      <Head>
        {/* 웹페이지의 제목을 "Forget password"로 설정합니다. */}
        <title>Forget password</title>
      </Head>
      {/* ForgetPasswordIndex 컴포넌트를 렌더링합니다. */}
      <ForgetPasswordIndex />
    </>
  );
};

// ForgetPasswordPage 컴포넌트를 내보냅니다.
export default ForgetPasswordPage;
