import Head from 'next/head'; // next/head 모듈을 import합니다. 이를 이용해 HTML의 <head> 태그 내부를 정의합니다.
import Footer from './Footer'; // Footer 컴포넌트를 import합니다.
import styles from './Layout.module.css'; // 해당 컴포넌트의 스타일을 import합니다.
import Nav from './Nav'; // Nav 컴포넌트를 import합니다.

// Layout 컴포넌트를 정의합니다. 이 컴포넌트는 페이지의 기본 레이아웃을 담당합니다.
const Layout = ({ children }) => {
  // JSX 형식으로 렌더링할 내용을 반환합니다.
  return (
    <>
      {/* Head 컴포넌트를 사용해 HTML 문서의 head 내용을 정의합니다. */}
      <Head>
        {/* 각각의 메타 태그와 타이틀을 정의합니다. */}
        <title>주식회사 엔아이 웹 페이지 틀</title>
        {/* 화면의 너비와 초기 확대 비율을 설정하는 뷰포트 메타태그입니다. */}
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* 웹 페이지의 설명을 나타내는 메타태그입니다. */}
        <meta name="description" content="주식회사 엔아이 웹 페이지 틀" />
        {/* 페이지의 제목을 표시하는 오픈 그래프(Open Graph) 메타태그입니다. */}
        <meta property="og:title" content="주식회사 엔아이 웹 페이지 틀" />
        {/* 페이지의 설명을 표시하는 오픈 그래프 메타태그입니다. */}
        <meta
          property="og:description"
          content="주식회사 엔아이 웹 페이지 틀"
        />
        {/* 페이지의 이미지(썸네일)을 표시하는 오픈 그래프 메타태그입니다. */}
        <meta
          property="og:image"
          content="https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd"
        />
      </Head>
      {/* Nav 컴포넌트를 렌더링합니다. 이는 페이지의 상단 내비게이션 바를 표시합니다. */}
      <Nav />
      {/* 메인 콘텐츠 영역입니다. children은 Layout 컴포넌트를 사용하는 곳에서 넣어주는 컴포넌트들을 가리킵니다. */}
      <main className={styles.main}>{children}</main>
      {/* Footer 컴포넌트를 렌더링합니다. 이는 페이지의 하단 푸터를 표시합니다. */}
      <Footer />
    </>
  );
};

export default Layout; // Layout 컴포넌트를 export합니다. 다른 컴포넌트에서 사용할 수 있게 합니다.
