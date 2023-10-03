// 필요한 모듈과 컴포넌트를 불러옵니다.
import { findAndDeleteTokenByIdAndType, updateUserById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { VerifyEmail } from '@/page-components/VerifyEmail';
import Head from 'next/head';

// EmailVerifyPage 함수형 컴포넌트를 정의합니다.
export default function EmailVerifyPage({ valid }) {
  return (
    <>
      <Head>
        {/* 페이지의 타이틀을 설정합니다. */}
        <title>Email verification</title>
      </Head>
      {/* VerifyEmail 컴포넌트를 렌더링하고, valid prop을 전달합니다. */}
      <VerifyEmail valid={valid} />
    </>
  );
}

// 서버 사이드에서 prop을 생성하고 반환하는 함수를 정의합니다.
export async function getServerSideProps(context) {
  // MongoDB 인스턴스를 가져옵니다.
  const db = await getMongoDb();

  // context.params에서 token 값을 가져옵니다.
  const { token } = context.params;

  // 토큰을 찾아서 삭제하는 작업을 수행합니다.
  // 토큰은 'emailVerify' 타입이어야 합니다.
  const deletedToken = await findAndDeleteTokenByIdAndType(
    db,
    token,
    'emailVerify'
  );

  // 만약 삭제된 토큰이 없다면, valid를 false로 설정하여 prop을 반환합니다.
  if (!deletedToken) return { props: { valid: false } };

  // 토큰의 creatorId를 사용하여 사용자의 emailVerified 필드를 true로 업데이트합니다.
  await updateUserById(db, deletedToken.creatorId, {
    emailVerified: true,
  });

  // valid를 true로 설정하여 prop을 반환합니다.
  return { props: { valid: true } };
}
