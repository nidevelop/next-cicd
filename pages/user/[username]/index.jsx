// 필요한 모듈과 컴포넌트를 불러옵니다.
import { findPostById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { UserPost } from '@/page-components/UserPost';
import Head from 'next/head';

// UserPostPage 함수형 컴포넌트를 정의합니다.
export default function UserPostPage({ post }) {
  // 만약 post.createdAt이 문자열이 아니라면, Date 객체로 변환합니다.
  if (typeof post.createdAt !== 'string') {
    post.createdAt = new Date(post.createdAt);
  }
  return (
    <>
      <Head>
        {/* 페이지 타이틀을 설정합니다. 포스트 생성자의 이름과 유저네임, 그리고 포스트 내용을 표시합니다. */}
        <title>
          {post.creator.name} ({post.creator.username}): {post.content}
        </title>
      </Head>
      {/* UserPost 컴포넌트를 렌더링하고, post prop을 전달합니다. */}
      <UserPost post={post} />
    </>
  );
}

// 서버 사이드의 prop을 가져오는 함수를 정의합니다.
export async function getServerSideProps(context) {
  // MongoDB 인스턴스를 가져옵니다.
  const db = await getMongoDb();

  // 요청받은 postId에 해당하는 포스트를 찾습니다.
  const post = await findPostById(db, context.params.postId);

  // 만약 포스트가 없다면, 404 상태를 반환합니다.
  if (!post) {
    return {
      notFound: true,
    };
  }

  // 요청받은 username과 포스트의 생성자의 username이 다르다면,
  // URL의 username이 잘못된 경우로 판단하고, 올바른 URL로 리다이렉트합니다.
  if (context.params.username !== post.creator.username) {
    return {
      redirect: {
        // 올바른 URL로 리다이렉트합니다.
        destination: `/user/${post.creator.username}/post/${post._id}`,
        permanent: false, // 301 대신 302 상태 코드로 리다이렉트합니다.
      },
    };
  }

  // 일부 객체를 문자열로 변환하고, 날짜를 JSON 형태로 변환합니다.
  post._id = String(post._id);
  post.creatorId = String(post.creatorId);
  post.creator._id = String(post.creator._id);
  post.createdAt = post.createdAt.toJSON();

  // 포스트 데이터를 prop으로 반환합니다.
  return { props: { post } };
}
