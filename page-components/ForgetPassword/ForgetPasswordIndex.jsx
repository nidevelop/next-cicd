// 필요한 컴포넌트와 라이브러리를 import합니다.
import { Button } from '@/components/Button';
// ... [다른 import 문]

const ForgetPasswordIndex = () => {
  // useRef와 useState를 사용하여 상태와 참조를 생성합니다.
  const emailRef = useRef(); // 이메일 입력을 참조하기 위한 ref
  // 'loading' || 'success'
  const [status, setStatus] = useState(); // 상태 관리 (로딩, 성공)
  const [email, setEmail] = useState(''); // 이메일 상태 관리

  // onSubmit 이벤트 핸들러를 정의합니다.
  const onSubmit = useCallback(async (e) => {
    // 기본 폼 제출을 방지합니다.
    e.preventDefault();
    try {
      // 로딩 상태를 설정합니다.
      setStatus('loading');
      // 패스워드 재설정 이메일을 보내는 API를 호출합니다.
      await fetcher('/api/user/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRef.current.value,
        }),
      });
      // 성공적으로 이메일이 보내졌으면, 이메일 상태를 업데이트하고
      // 상태를 'success'로 설정합니다.
      setEmail(emailRef.current.value);
      setStatus('success');
    } catch (e) {
      // 에러가 발생하면, 토스트 메시지로 에러를 알리고 상태를 초기화합니다.
      toast.error(e.message);
      setStatus(undefined);
    }
  }, []);

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        {status === 'success' ? (
          // 성공 상태일 때 보여질 UI를 렌더링합니다.
          <>
            <h1 className={styles.title}>Check your inbox</h1>
            <p className={styles.subtitle}>
              An email has been sent{' '}
              <Text as="span" color="link">
                {email}
              </Text>
              . Please follow the link in that email to reset your password.
            </p>
          </>
        ) : (
          // 기본 상태(이메일 입력 폼)를 렌더링합니다.
          <>
            <h1 className={styles.title}>Forget Password</h1>
            <p className={styles.subtitle}>
              Enter the email address associated with your account, and
              we&apos;ll send you a link to reset your password.
            </p>
            <Spacer size={1} />
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
              <Button
                htmlType="submit"
                className={styles.submit}
                type="success"
                size="large"
                loading={status === 'loading'}
              >
                Continue
              </Button>
            </form>
          </>
        )}
        <Spacer size={0.25} axis="vertical" />
        // 로그인 페이지로 돌아가는 링크를 제공합니다.
        <Link legacyBehavior href="/login" passHref>
          <ButtonLink type="success" size="large" variant="ghost">
            Return to login
          </ButtonLink>
        </Link>
      </div>
    </Wrapper>
  );
};

// ForgetPasswordIndex 컴포넌트를 export합니다.
export default ForgetPasswordIndex;
