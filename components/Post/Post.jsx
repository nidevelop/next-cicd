// 필요한 컴포넌트와 라이브러리를 임포트합니다.
import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms'; // 시간을 포맷팅하기 위한 라이브러리
import clsx from 'clsx'; // 클래스 이름을 동적으로 결합하기 위한 라이브러리
import Link from 'next/link'; // Next.js의 Link 컴포넌트
import { useMemo } from 'react'; // React의 useMemo 훅
import styles from './Post.module.css'; // 스타일

// Post 컴포넌트를 정의합니다. post와 className을 프롭으로 받습니다.
const Post = ({ post, className }) => {
  // useMemo를 사용하여 post의 생성 시간을 기반으로 텍스트 표현의 타임스탬프를 메모이징합니다.
  const timestampTxt = useMemo(() => {
    // 현재 시간과 post 생성 시간의 차이를 계산합니다.
    const diff = Date.now() - new Date(post.createdAt).getTime();
    // 차이가 1분 미만이라면 'Just now'를 반환합니다.
    if (diff < 1 * 60 * 1000) return 'Just now';
    // 그렇지 않다면, format 함수를 사용하여 차이를 문자열로 포맷팅하여 반환합니다.
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);

  // Post 컴포넌트의 JSX를 반환합니다.
  return (
    <div className={clsx(styles.root, className)}>
      {' '}
      {/* root 스타일과 추가로 받은 className을 결합합니다. */}
      {/* 사용자의 프로필로의 링크를 생성합니다. */}
      <Link legacyBehavior href={`/user/${post.creator.username}`}>
        <a>
          {' '}
          {/* anchor 요소 */}
          {/* creator에 관련된 정보를 포함하는 컨테이너 */}
          <Container className={styles.creator}>
            {/* Avatar 컴포넌트로 사용자의 아바타를 표시합니다. */}
            <Avatar
              size={36}
              url={post.creator.profilePicture}
              username={post.creator.username}
            />
            {/* 메타데이터 (이름, 사용자명)를 포함하는 컨테이너 */}
            <Container column className={styles.meta}>
              <p className={styles.name}>{post.creator.name}</p> {/* 이름 */}
              <p className={styles.username}>{post.creator.username}</p>{' '}
              {/* 사용자명 */}
            </Container>
          </Container>
        </a>
      </Link>
      {/* post의 내용을 포함하는 wrap */}
      <div className={styles.wrap}>
        <p className={styles.content}>{post.content}</p>
      </div>
      {/* 타임스탬프를 포함하는 wrap */}
      <div className={styles.wrap}>
        {/* 시간을 ISO 문자열로 변환하여 dateTime 프로퍼티로 제공하고, */}
        {/* 사람이 읽을 수 있는 형태의 시간 표시를 내용으로 갖는 time 요소 */}
        <time dateTime={String(post.createdAt)} className={styles.timestamp}>
          {timestampTxt}
        </time>
      </div>
    </div>
  );
};

// Post 컴포넌트를 export하여 다른 파일에서 사용할 수 있게 합니다.
export default Post;
