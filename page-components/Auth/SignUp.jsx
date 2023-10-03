import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import { TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const SignUp = () => {
  // 각 입력 필드에 대한 참조를 생성합니다.
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nameRef = useRef();

  // 현재 사용자의 상태를 갱신하기 위한 mutate 함수를 얻습니다.
  const { mutate } = useCurrentUser();

  // 로딩 상태를 관리하는 state를 정의합니다.
  const [isLoading, setIsLoading] = useState(false);

  // 라우터 인스턴스를 얻습니다.
  const router = useRouter();

  // 폼 제출 핸들러를 정의합니다.
  const onSubmit = useCallback(
    async (e) => {
      // 기본 폼 제출 동작을 막습니다.
      e.preventDefault();
      try {
        // 로딩 상태를 활성화합니다.
        setIsLoading(true);
        // '/api/users' 엔드포인트에 사용자 데이터를 POST하여 계정을 생성합니다.
        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailRef.current.value,
            name: nameRef.current.value,
            password: passwordRef.current.value,
            username: usernameRef.current.value,
          }),
        });
        // 사용자 데이터를 갱신하고, 성공 메시지를 표시합니다.
        mutate({ user: response.user }, false);
        toast.success('Your account has been created');
        // 사용자를 피드 페이지로 리다이렉트합니다.
        router.replace('/feed');
      } catch (e) {
        // 에러 발생 시, 에러 메시지를 표시합니다.
        toast.error(e.message);
      } finally {
        // 로딩 상태를 비활성화합니다.
        setIsLoading(false);
      }
    },
    // 의존성 배열입니다.
    [mutate, router]
  );

  // 컴포넌트 UI를 렌더링합니다.
  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Join Now</h1>
        <form onSubmit={onSubmit}>
          <Container alignItems="center">
            <p className={styles.subtitle}>Your login</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={emailRef}
            htmlType="email"
            autoComplete="email"
            placeholder="Email Address"
            ariaLabel="Email Address"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={passwordRef}
            htmlType="password"
            autoComplete="new-password"
            placeholder="Password"
            ariaLabel="Password"
            size="large"
            required
          />
          <Spacer size={0.75} axis="vertical" />
          <Container alignItems="center">
            <p className={styles.subtitle}>About you</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={usernameRef}
            autoComplete="username"
            placeholder="Username"
            ariaLabel="Username"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={nameRef}
            autoComplete="name"
            placeholder="Your name"
            ariaLabel="Your name"
            size="large"
            required
          />
          <Spacer size={1} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success"
            size="large"
            loading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </div>
      <div className={styles.footer}>
        <Link legacyBehavior href="/login" passHref>
          <TextLink color="link" variant="highlight">
            Already have an account? Log in
          </TextLink>
        </Link>
      </div>
    </Wrapper>
  );
};

export default SignUp;
