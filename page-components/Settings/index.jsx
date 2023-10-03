import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Settings.module.css';

// 이메일 검증 컴포넌트
const EmailVerify = ({ user }) => {
  const [status, setStatus] = useState();  // 상태 설정 ('loading' 또는 'success')
  
  // 이메일 검증 요청 함수
  const verify = useCallback(async () => {
    try {
      setStatus('loading');  // 로딩 상태로 설정
      // 이메일 검증 API 호출
      await fetcher('/api/user/email/verify', { method: 'POST' });
      // 성공 메시지 표시
      toast.success('An email has been sent to your mailbox. Follow the instruction to verify your email.');
      setStatus('success');  // 성공 상태로 설정
    } catch (e) {
      // 에러 메시지 표시
      toast.error(e.message);
      setStatus('');  // 상태 초기화
    }
  }, []);
  
  // 이메일이 이미 검증되었는지 확인
  if (user.emailVerified) return null;
  return (
    <Container className={styles.note}>
      <Container flex={1}>
        <p>
          <strong>Note:</strong> <span>Your email</span> (
          <span className={styles.link}>{user.email}</span>) is unverified.
        </p>
      </Container>
      <Spacer size={1} axis="horizontal" />
      <Button
        loading={status === 'loading'}
        size="small"
        onClick={verify}
        disabled={status === 'success'}
      >
        Verify
      </Button>
    </Container>
  );
};

// 비밀번호 업데이트 컴포넌트
const Auth = () => {
  // 비밀번호 참조 설정
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 제출 핸들러
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // 로딩 상태로 설정
      // 비밀번호 업데이트 API 호출
      await fetcher('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPasswordRef.current.value,
          newPassword: newPasswordRef.current.value,
        }),
      });
      // 성공 메시지 표시
      toast.success('Your password has been updated');
    } catch (e) {
      // 에러 메시지 표시
      toast.error(e.message);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
      // 비밀번호 필드 초기화
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
    }
  }, []);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Password</h4>
      <form onSubmit={onSubmit}>
        <Input
          htmlType="password"
          autoComplete="current-password"
          ref={oldPasswordRef}
          label="Old Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Input
          htmlType="password"
          autoComplete="new-password"
          ref={newPasswordRef}
          label="New Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};

// 사용자 프로필 업데이트 컴포넌트
const AboutYou = ({ user, mutate }) => {
  // 참조 및 상태 설정
  const usernameRef = useRef();
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();
  const [avatarHref, setAvatarHref] = useState(user.profilePicture);

  // 아바타 변경 핸들러
  const onAvatarChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setAvatarHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // 프로필 제출 핸들러
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('username', usernameRef.current.value);
        formData.append('name', nameRef.current.value);
        formData.append('bio', bioRef.current.value);
        if (profilePictureRef.current.files[0]) {
          formData.append('profilePicture', profilePictureRef.current.files[0]);
        }
        const response = await fetcher('/api/user', {
          method: 'PATCH',
          body: formData,
        });
        mutate({ user: response.user }, false);
        toast.success('Your profile has been updated');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  // 사용자 데이터가 변경될 때 입력값 업데이트
  useEffect(() => {
    usernameRef.current.value = user.username;
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
    profilePictureRef.current.value = '';
    setAvatarHref(user.profilePicture);
  }, [user]);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>About You</h4>
      <form onSubmit={onSubmit}>
        <Input ref={usernameRef} label="Your Username" />
        <Spacer size={0.5} axis="vertical" />
        <Input ref={nameRef} label="Your Name" />
        <Spacer size={0.5} axis="vertical" />
        <Textarea ref={bioRef} label="Your Bio" />
        <Spacer size={0.5} axis="vertical" />
        <span className={styles.label}>Your Avatar</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={user.username} url={avatarHref} />
          <input
            aria-label="Your Avatar"
            type="file"
            accept="image/*"
            ref={profilePictureRef}
            onChange={onAvatarChange}
          />
        </div>
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};

// 메인 설정 컴포넌트
export const Settings = () => {
  // 사용자 데이터 훅
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  // 사용자 데이터가 로드되거나 오류가 발생할 때 처리
  useEffect(() => {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);
  return (
    <Wrapper className={styles.wrapper}>
      <Spacer size={2} axis="vertical" />
      {data?.user ? (
        <>
          <EmailVerify user={data.user} />
          <AboutYou user={data.user} mutate={mutate} />
          <Auth user={data.user} />
        </>
      ) : null}
    </Wrapper>
  );
};
