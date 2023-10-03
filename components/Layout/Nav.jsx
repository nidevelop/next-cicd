import { Avatar } from '@/components/Avatar'; // Avatar 컴포넌트를 import합니다.
import { Button, ButtonLink } from '@/components/Button'; // Button 및 ButtonLink 컴포넌트를 import합니다.
import { ThemeSwitcher } from '@/components/ThemeSwitcher'; // 테마 전환 컴포넌트를 import합니다.
import { fetcher } from '@/lib/fetch'; // fetcher 함수를 import합니다. (서버 통신을 위함)
import { useCurrentUser } from '@/lib/user'; // 현재 사용자의 상태를 가져오는 훅을 import합니다.
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 import합니다.
import { useRouter } from 'next/router'; // Next.js의 라우터 훅을 import합니다.
import { useCallback, useEffect, useRef, useState } from 'react'; // React의 훅들을 import합니다.
import toast from 'react-hot-toast'; // toast 메시지를 출력하기 위한 라이브러리를 import합니다.
import Container from './Container'; // Container 컴포넌트를 import합니다.
import styles from './Nav.module.css'; // Nav 컴포넌트의 스타일을 import합니다.
import Spacer from './Spacer'; // Spacer 컴포넌트를 import합니다.
import Wrapper from './Wrapper'; // Wrapper 컴포넌트를 import합니다.

// 사용자 메뉴 컴포넌트를 정의합니다. 사용자의 정보와 데이터 변화를 감지하고 처리하는 mutate 함수를 props로 받습니다.

const UserMenu = ({ user, mutate }) => {
 const menuRef = useRef(); // 메뉴 참조 객체를 생성합니다.
 const avatarRef = useRef(); // 아바타 참조 객체를 생성합니다.

 const [visible, setVisible] = useState(false); // 메뉴의 표시 상태를 관리하는 상태 변수입니다.

 const router = useRouter(); // 라우터 객체를 생성합니다.
 // 라우터 변화에 따른 이벤트 핸들링을 위한 useEffect 훅입니다.
 useEffect(() => {
   const onRouteChangeComplete = () => setVisible(false); // 라우터 변경 완료 시 메뉴를 숨깁니다.
   router.events.on('routeChangeComplete', onRouteChangeComplete); // 라우터 변경 완료 이벤트에 핸들러를 바인딩합니다.
   return () => router.events.off('routeChangeComplete', onRouteChangeComplete); // 컴포넌트 언마운트 시 이벤트 핸들러를 제거합니다.
 });

 // 외부 클릭을 감지하여 메뉴를 닫는 useEffect 훅입니다.
 useEffect(() => {
   const onMouseDown = (event) => {
     if (
       !menuRef.current.contains(event.target) &&
       !avatarRef.current.contains(event.target)
     ) {
       setVisible(false); // 메뉴 밖 클릭 시 메뉴를 숨깁니다.
     }
   };
   document.addEventListener('mousedown', onMouseDown); // mousedown 이벤트에 핸들러를 바인딩합니다.
   return () => {
     document.removeEventListener('mousedown', onMouseDown); // 컴포넌트 언마운트 시 이벤트 핸들러를 제거합니다.
   };
 }, []);

 // 로그아웃 처리를 위한 함수입니다. 비동기로 서버와 통신하여 로그아웃 처리를 수행합니다.
 const onSignOut = useCallback(async () => {
   try {
     await fetcher('/api/auth', {
       method: 'DELETE', // DELETE 메서드를 사용하여 로그아웃 요청을 보냅니다.
     });
     toast.success('You have been signed out'); // 로그아웃 성공 메시지를 표시합니다.
     mutate({ user: null }); // 사용자 상태를 null로 업데이트합니다.
   } catch (e) {
     toast.error(e.message); // 에러 메시지를 표시합니다.
   }
 }, [mutate]);

  return (
    <div className={styles.user}>
      <button
        className={styles.trigger}
        ref={avatarRef}
        onClick={() => setVisible(!visible)}
      >
        <Avatar size={32} username={user.username} url={user.profilePicture} />
      </button>
      <div
        ref={menuRef}
        role="menu"
        aria-hidden={visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link legacyBehavior passHref href={`/user/${user.username}`}>
              <a className={styles.item}>Profile</a>
            </Link>
            <Link legacyBehavior passHref href="/settings">
              <a className={styles.item}>Settngs</a>
            </Link>
            <div className={styles.item} style={{ cursor: 'auto' }}>
              <Container alignItems="center">
                <span>Theme</span>
                <Spacer size={0.5} axis="horizontal" />
                <ThemeSwitcher />
              </Container>
            </div>
            <button onClick={onSignOut} className={styles.item}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Nav 컴포넌트 정의합니다. 웹사이트의 상단 네비게이션 바를 담당합니다.
const Nav = () => {
  // 현재 사용자의 데이터(user)와 데이터를 조작하는 함수(mutate)를 가져옵니다.
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link legacyBehavior href="/">
            <a className={styles.logo}>NI marketing</a>
          </Link>
          <Container>
            {user ? (
              <>
                <UserMenu user={user} mutate={mutate} />
              </>
            ) : (
              <>
                <Link legacyBehavior passHref href="/login">
                  <ButtonLink
                    size="small"
                    type="success"
                    variant="ghost"
                    color="link"
                  >
                    Log in
                  </ButtonLink>
                </Link>
                <Spacer axis="horizontal" size={0.25} />
                <Link legacyBehavior passHref href="/sign-up">
                  <Button size="small" type="success">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Container>
        </Container>
      </Wrapper>
    </nav>
  );
};

export default Nav;
