import { Button } from '@/components/Button';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';

const PostList = () => {
  // usePostPages 훅을 사용하여 포스트 데이터와 페이지 관련 상태를 불러옵니다.
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages();

  // 모든 페이지의 포스트를 하나의 배열로 펼칩니다.
  // data가 없으면 빈 배열을 사용합니다.
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        {/* 모든 포스트를 맵핑하여 렌더링합니다. */}
        {posts.map((post) => (
          <Link
            // 각 링크에 유니크한 key를 제공합니다.
            key={post._id}
            // 포스트의 상세 페이지로 이동하는 링크를 생성합니다.
            href={`/user/${post.creator.username}/post/${post._id}`}
            passHref
          >
            <div className={styles.wrap}>
              {/* Post 컴포넌트를 사용하여 각 포스트를 렌더링합니다. */}
              <Post className={styles.post} post={post} />
            </div>
          </Link>
        ))}
        <Container justifyContent="center">
          {isReachingEnd ? (
            // 더 이상 불러올 포스트가 없을 경우 메시지를 표시합니다.
            <Text color="secondary">No more posts are found</Text>
          ) : (
            // 더 많은 포스트를 불러올 수 있는 버튼을 표시합니다.
            // 버튼 클릭 시, setSize를 사용하여 다음 페이지를 로드합니다.
            <Button
              variant="ghost"
              type="success"
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container>
      </Wrapper>
    </div>
  );
};

export default PostList;
