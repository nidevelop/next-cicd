// 필요한 CSS 파일과 컴포넌트를 가져옵니다.
import '@/assets/base.css';
import { Layout } from '@/components/Layout';
// 다음 테마 프로바이더(ThemeProvider)와 토스트 메시지를 위한 Toaster를 가져옵니다.
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

// MyApp 함수형 컴포넌트를 정의합니다. 이 컴포넌트는 Next.js의 _app.js 파일의 기본 컴포넌트입니다.
// 이 컴포넌트는 모든 페이지에 공통적으로 적용됩니다.
export default function MyApp({ Component, pageProps }) {
  return (
    // ThemeProvider로 애플리케이션을 감쌉니다. 이를 통해 애플리케이션의 전반에 걸쳐 테마에 접근하거나 변경할 수 있습니다.
    <ThemeProvider>
      {/* Layout 컴포넌트로 애플리케이션의 주요 부분을 감쌉니다. Layout 컴포넌트 내에 공통으로 사용되는 헤더, 푸터 등이 있을 수 있습니다. */}
      <Layout>
        {/* 현재 페이지의 실제 컴포넌트를 렌더링합니다. 이 컴포넌트는 각각의 페이지에 대한 실제 내용을 담고 있습니다. */}
        <Component {...pageProps} />
        {/* Toaster 컴포넌트를 추가합니다. 이 컴포넌트는 페이지에서 토스트 메시지를 표시하기 위해 사용됩니다. */}
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}
