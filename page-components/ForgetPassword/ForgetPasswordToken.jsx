import { Button } from '@/components/Button';
import { ButtonLink } from '@/components/Button/Button';
import { Input } from '@/components/Input';
import { Spacer, Wrapper } from '@/components/Layout';
import { fetcher } from '@/lib/fetch';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './ForgetPassword.module.css';

// 새 비밀번호 설정 컴포넌트
const NewPassword = ({ token }) => {
  const passwordRef = useRef();  // 비밀번호 입력을 참조하기 위한 ref
  // 'loading' | 'success'
  const [status, setStatus] = useState();  // 상태 관리 (로딩, 성공)
  
  // 폼 제출 핸들러
  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();  // 기본 폼 제출을 방지합니다.
      setStatus('loading');  // 로딩 상태를 설정합니다.
      try {
        // 비밀번호 재설정 API 호출
        await fetcher('/api/user/password/reset', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            password: passwordRef.current.value,  // 새 비밀번호 데이터
          }),
        });
        // API 호출 성공 시 상태를 'success'로 설정합니다.
        setStatus('success');
      } catch (e) {
        // 에러 발생 시, 토스트 메시지로 에러 내용을 알립니다.
        toast.error(e.message);
        // 상태를 초기화합니다.
        setStatus(undefined);
      }
    },
    [token]  // 의존성 배열에 token 포함
  );

  // 컴포넌트 렌더링
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Reset Password</h1>
      {status === 'success' ? (
        <>
          <p className={styles.subtitle}>
            Your password has been updated successfully.
          </p>
        </>
      ) : (
        <>
          <p className={styles.subtitle}>
            Enter a new password for your account
          </p>
          <Spacer size={1} />
          <form onSubmit={onSubmit}>
            <Input
              ref={passwordRef}
              htmlType="password"
              autoComplete="new-password"
              placeholder="New Password"
              ariaLabel="New Password"
              size="large"
              required
            />
            <Spacer size={0.5} axis="vertical" />
            <Button
              htmlType="submit"
              className={styles.submit}
              type="success"
              size="large"
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Spacer size={0.25} axis="vertical" />
      <Link legacyBehavior href="/login" passHref>
        <ButtonLink type="success" size="large" variant="ghost">
          Return to login
        </ButtonLink>
      </Link>
    </div>
  );
};

// 잘못된 링크에 대한 컴포넌트
const BadLink = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Invalid Link</h1>
      <p className={styles.subtitle}>
        It looks like you may have clicked on an invalid link. Please close this
        window and try again.
      </p>
      <Spacer size={1} />
      <Link legacyBehavior href="/login" passHref>
        <ButtonLink type="success" size="large" variant="ghost">
          Return to login
        </ButtonLink>
      </Link>
    </div>
  );
};

// 토큰을 사용하여 비밀번호를 재설정하는 컴포넌트
const ForgetPasswordToken = ({ valid, token }) => {
  return (
    <Wrapper className={styles.root}>
      {valid ? <NewPassword token={token} /> : <BadLink />}
    </Wrapper>
  );
};

export default ForgetPasswordToken;
