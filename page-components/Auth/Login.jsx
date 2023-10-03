import { Button } from '@/components/Button';
import { ButtonLink } from '@/components/Button/Button';
import { Input } from '@/components/Input';
import { Spacer, Wrapper } from '@/components/Layout';
import { TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const Login = () => {
  // 이메일과 패스워드 input 필드를 참조하기 위한 ref를 생성합니다.
  const emailRef = useRef();
  const passwordRef = useRef();

  // 로딩 상태를 표시하기 위한 state입니다.
  const [isLoading, setIsLoading] = useState(false);

  // 현재 사용자의 정보와 데이터를 갱신하기 위한 mutate 함수를 얻습니다.
  const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
  const router = useRouter();

  // 사용자의 로그인 상태를 체크하고, 이미 로그인되어 있다면 '/feed'로 리다이렉트합니다.
  useEffect(() => {
    if (isValidating) return;
    if (user) router.replace('/feed');
  }, [user, router, isValidating]);

  // 로그인 양식 제출 핸들러입니다. 이메일과 패스워드를 사용하여 로그인 요청을 합니다.
  const onSubmit = useCallback(
    async (event) => {
      // 폼 기본 제출 동작을 방지합니다.
      event.preventDefault();
      // 로딩 상태를 활성화합니다.
      setIsLoading(true);
      try {
        // '/api/auth' 엔드포인트에 POST 요청을 보내 로그인을 시도합니다.
        const response = await fetcher('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
        });
        // 로그인 성공 시, 사용자 데이터를 로컬 상태로 업데이트하고, 성공 토스트 메시지를 표시합니다.
        mutate({ user: response.user }, false);
        toast.success('You have been logged in.');
      } catch (e) {
        // 에러가 발생하면, 에러 토스트 메시지를 표시합니다.
        toast.error('Incorrect email or password.');
      } finally {
        // 최종적으로 로딩 상태를 비활성화합니다.
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Login to App</h1>
        <form onSubmit={onSubmit}>
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
            autoComplete="current-password"
            placeholder="Password"
            ariaLabel="Password"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success"
            size="large"
            loading={isLoading}
          >
            Log in
          </Button>
          <Spacer size={0.25} axis="vertical" />
          <Link legacyBehavior href="/forget-password" passHref>
            <ButtonLink type="success" size="large" variant="ghost">
              Forget password
            </ButtonLink>
          </Link>
        </form>
      </div>
      <div className={styles.footer}>
        <Link legacyBehavior href="/sign-up" passHref>
          <TextLink color="link" variant="highlight">
            Don&apos;t have an account? Sign Up
          </TextLink>
        </Link>
      </div>
    </Wrapper>
  );
};

export default Login;
