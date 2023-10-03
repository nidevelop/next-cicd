import { Button } from '@/components/Button';
import { Comment } from '@/components/Comment';
import { Container, Spacer } from '@/components/Layout';
import { Text } from '@/components/Text';
import { useCommentPages } from '@/lib/comment';
import styles from './CommentList.module.css';

// CommentList 컴포넌트: 게시물에 대한 댓글 목록을 보여줍니다.
const CommentList = ({ post }) => {
  // useCommentPages 훅을 사용하여 댓글 데이터, 페이지 크기,
  // 페이지 크기 설정 함수, 로딩 상태, 끝에 도달했는지의 여부를 가져옵니다.
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useCommentPages(
    { postId: post._id }
  );

  // data가 있는 경우 댓글을 추출하고, 없는 경우 빈 배열을 사용합니다.
  const comments = data
    ? data.reduce((acc, val) => [...acc, ...val.comments], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      {/* 댓글을 순회하면서 각 댓글을 Comment 컴포넌트로 렌더링합니다. */}
      {comments.map((comment) => (
        <div key={comment._id} className={styles.wrap}>
          <Comment className={styles.comment} comment={comment} />
        </div>
      ))}
      <Container justifyContent="center">
        {/* 더 이상 로드할 댓글이 없는 경우 메시지를 표시하고, */}
        {/* 그렇지 않은 경우 "Load more" 버튼을 표시합니다. */}
        {isReachingEnd ? (
          <Text color="secondary">No more comments are found</Text>
        ) : (
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
    </div>
  );
};

export default CommentList;
