// next/document 모듈에서 필요한 항목들을 가져옵니다.
import Document, { Head, Html, Main, NextScript } from 'next/document';

// MyDocument 클래스를 정의하며, 이는 Document 클래스를 확장(extend)합니다.
class MyDocument extends Document {
  // getInitialProps는 페이지의 초기 속성을 가져오는 정적 메서드입니다.
  static async getInitialProps(ctx) {
    // Document 클래스의 getInitialProps 메서드를 호출하여 초기 속성을 가져옵니다.
    const initialProps = await Document.getInitialProps(ctx);
    // 초기 속성을 반환합니다.
    return { ...initialProps };
  }

  // render 메서드를 정의하여, 페이지를 렌더링합니다.
  render() {
    return (
      // Html 컴포넌트를 렌더링하며, lang 속성을 "en"으로 설정하여 페이지가 영어로 작성되었음을 명시합니다.
      <Html lang="en">
        <Head>
          {/* Google Fonts 서버에 미리 연결하기 위해 rel="preconnect"를 사용하는 link 태그를 추가합니다.
              이렇게 함으로써 페이지의 로딩 성능을 약간 향상시킬 수 있습니다. */}
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          {/* Google Fonts에서 'Inter' 글꼴을 가져오기 위한 link 태그를 추가합니다. */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&amp;display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* Main 컴포넌트는 페이지의 주요 콘텐츠를 렌더링합니다. */}
          <Main />
          {/* NextScript 컴포넌트는 필요한 JavaScript 파일들을 렌더링합니다. */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

// MyDocument 클래스를 내보냅니다. 이 컴포넌트는 모든 문서에서 사용되며,
// 일반적으로 애플리케이션에 글꼴, 메타 태그 등을 추가할 때 사용됩니다.
export default MyDocument;
