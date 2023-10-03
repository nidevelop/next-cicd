import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { useCommentPages } from '@/lib/comment';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Commenter.module.css';

// CommenterInner 컴포넌트: 댓글을 작성하고 제출하는 기능을 담당
const CommenterInner = ({ user, post }) => {
  // contentRef를 사용하여 입력 필드의 값을 추적
  const contentRef = useRef();
  // 로딩 상태를 추적하는 로컬 상태
  const [isLoading, setIsLoading] = useState(false);

  // 댓글 페이지 데이터를 변경(mutation)하고 새 데이터를 가져오는 함수를 가져옴
  const { mutate } = useCommentPages({ postId: post._id });

  // onSubmit: 댓글을 제출할 때 호출되는 함수
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        // 로딩 상태를 true로 설정
        setIsLoading(true);
        // 서버에 POST 요청을 보내 댓글을 추가
        await fetcher(`/api/posts/${post._id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentRef.current.value }),
        });
        // 성공 토스트 메시지를 표시
        toast.success('You have added a comment');
        // 입력 필드를 초기화
        contentRef.current.value = '';
        // 댓글 데이터를 업데이트
        mutate();
      } catch (e) {
        // 에러 토스트 메시지를 표시
        toast.error(e.message);
      } finally {
        // 로딩 상태를 false로 설정
        setIsLoading(false);
      }
    },
    [mutate, post._id]
  );

  return (
    <form onSubmit={onSubmit}>
      <Container className={styles.poster}>
        {/* 사용자 아바타, 입력 필드, 'Comment' 버튼을 표시 */}
        <Avatar size={40} username={user.username} url={user.profilePicture} />
        <Input
          ref={contentRef}
          className={styles.input}
          placeholder="Add your comment"
          ariaLabel="Add your comment"
        />
        <Button type="success" loading={isLoading}>
          Comment
        </Button>
      </Container>
    </form>
  );
};

// Commenter 컴포넌트: 현재 사용자에 따라 CommenterInner 컴포넌트를 렌더링하거나 로그인 링크를 표시
const Commenter = ({ post }) => {
  // 현재 사용자 데이터와 에러를 가져옴
  const { data, error } = useCurrentUser();
  // 로딩 상태를 결정 (data와 error 모두 없는 경우 로딩 중으로 판단)
  const loading = !data && !error;

  return (
    <div className={styles.root}>
      {/* 답글이 가리키는 사용자 이름을 표시 */}
      <h3 className={styles.heading}>
        Replying to{' '}
        <Link legacyBehavior href={`/user/${post.creator.username}`} passHref>
          <TextLink color="link">@{post.creator.username}</TextLink>
        </Link>
      </h3>
      {/* 로딩 중이면 로딩 컴포넌트, 로그인한 사용자면 CommenterInner 컴포넌트, 그렇지 않으면 로그인 링크를 표시 */}
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : data?.user ? (
        <CommenterInner post={post} user={data.user} />
      ) : (
        <Text color="secondary">
          Please{' '}
          <Link legacyBehavior href="/login" passHref>
            <TextLink color="link" variant="highlight">
              sign in
            </TextLink>
          </Link>{' '}
          to comment
        </Text>
      )}
    </div>
  );
};

export default Commenter;