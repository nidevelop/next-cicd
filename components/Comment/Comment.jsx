import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms'; // 시간 형식화를 위한 라이브러리
import clsx from 'clsx'; // className을 동적으로 조작하기 위한 라이브러리
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Comment.module.css';

// Comment 컴포넌트 정의
const Comment = ({ comment, className }) => {
  // 메모이제이션을 사용하여 댓글의 생성 시간을 사용자 친화적인 형식으로 변환
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now'; // 1분 미만이면 'Just now' 반환
    return `${format(diff, true)} ago`; // 그렇지 않으면 지난 시간을 문자열로 반환
  }, [comment.createdAt]);

  // 컴포넌트 렌더링
  return (
    <div className={clsx(styles.root, className)}>
      {/* 사용자 프로필로의 링크 생성 */}
      <Link legacyBehavior href={`/user/${comment.creator.username}`}>
        <a>
          {/* 댓글 작성자의 정보 및 아바타를 표시하는 컨테이너 */}
          <Container className={styles.creator}>
            <Avatar
              size={36}
              url={comment.creator.profilePicture}
              username={comment.creator.username}
            />
            {/* 댓글 작성자의 이름 및 사용자명을 표시하는 컨테이너 */}
            <Container column className={styles.meta}>
              <p className={styles.name}>{comment.creator.name}</p>
              <p className={styles.username}>{comment.creator.username}</p>
            </Container>
          </Container>
        </a>
      </Link>
      {/* 댓글 내용을 표시 */}
      <div className={styles.wrap}>
        <p className={styles.content}>{comment.content}</p>
      </div>
      {/* 댓글의 타임스탬프를 표시 */}
      <div className={styles.wrap}>
        <time dateTime={String(comment.createdAt)} className={styles.timestamp}>
          {timestampTxt}
        </time>
      </div>
    </div>
  );
};

export default Comment;
