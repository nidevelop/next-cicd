import { Button } from '@/components/Button';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './UserPosts.module.css';

// UserPosts 컴포넌트
// 특정 사용자의 모든 게시물을 나열하고, 필요한 경우 추가 게시물을 불러오는 기능을 제공합니다.
const UserPosts = ({ user }) => {
  // usePostPages 훅을 사용하여 게시물 데이터, 페이지 크기,
  // 페이지 크기 설정 함수, 더 많은 로딩 여부, 끝에 도달했는지의 여부를 가져옵니다.
  // creatorId에 현재 사용자의 _id를 전달하여 해당 사용자의 게시물만 불러옵니다.
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages({
    creatorId: user._id,
  });

  // 가져온 데이터를 하나의 게시물 배열로 변환합니다.
  // data가 있는 경우 각 페이지의 게시물을 합쳐 하나의 배열로 만듭니다.
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        {
          // 각 게시물을 순회하며, Link 컴포넌트를 사용하여 게시물로의 링크를 제공합니다.
          posts.map((post) => (
            <Link
              legacyBehavior
              key={post._id}
              href={`/user/${post.creator.username}/post/${post._id}`}
              // legacyBehavior는 속성의 설명이 없어 주석 제외
            >
              <a className={styles.wrap}>
                {/* Post 컴포넌트를 사용하여 각 게시물을 표시합니다. */}
                <Post className={styles.post} post={post} />
              </a>
            </Link>
          ))
        }
        <Container justifyContent="center">
          {
            // 끝에 도달했는지 확인하여, 더 이상 게시물이 없다면 메시지를 표시하고,
            // 그렇지 않다면 "더 불러오기" 버튼을 표시합니다.
            isReachingEnd ? (
              <Text color="secondary">No more posts are found</Text>
            ) : (
              <Button
                variant="ghost"
                type="success"
                // isLoadingMore 상태에 따라 로딩 스피너를 표시하거나 숨깁니다.
                loading={isLoadingMore}
                // 버튼 클릭 시 페이지 크기를 증가시켜 추가 데이터를 불러옵니다.
                onClick={() => setSize(size + 1)}
              >
                Load more
              </Button>
            )
          }
        </Container>
      </Wrapper>
    </div>
  );
};

export default UserPosts;
