import { Text, TextLink } from '@/components/Text'; // Text와 TextLink 컴포넌트를 가져옵니다.
import { ThemeSwitcher } from '@/components/ThemeSwitcher'; // ThemeSwitcher 컴포넌트를 가져옵니다.
import styles from './Footer.module.css'; // 해당 컴포넌트의 스타일을 가져옵니다.
import Spacer from './Spacer'; // Spacer 컴포넌트를 가져옵니다.
import Wrapper from './Wrapper'; // Wrapper 컴포넌트를 가져옵니다.

// Footer 컴포넌트 정의
const Footer = () => {
  // Footer 컴포넌트가 반환(렌더링)하는 JSX 부분
  return (
    // footer HTML 엘리먼트에 CSS 클래스를 적용합니다.
    <footer className={styles.footer}>
      {/* Wrapper 컴포넌트를 사용해 내부 요소들을 감쌉니다. */}
      <Wrapper>
        {/* Text 컴포넌트를 사용해 텍스트를 표시하며, color 속성으로 텍스트 색상을 accents-7로 설정합니다. */}
        <Text color="accents-7">
          주식회사 엔아이 | 대표자: 이나단 | 사업자등록번호: 453-81-02837
        </Text>
        {/* Spacer 컴포넌트를 사용해 vertical 방향으로 크기 1의 공간을 만듭니다. */}
        <Spacer size={1} axis="vertical" />
        {/* ThemeSwitcher 컴포넌트를 렌더링합니다. */}
        <ThemeSwitcher />
      </Wrapper>
    </footer>
  );
};

export default Footer; // Footer 컴포넌트를 내보냅니다.
