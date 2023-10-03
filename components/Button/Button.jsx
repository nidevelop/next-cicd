import { LoadingDots } from '@/components/LoadingDots';
import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Button.module.css';

// `Button` 컴포넌트는 버튼 엘리먼트를 렌더링합니다.
// 다양한 스타일과 상태(로딩, 비활성화 등)를 props로 받아 처리합니다.
export const Button = forwardRef(function Button(
  {
    children, // 버튼의 내용
    type, // 버튼의 타입
    className, // 추가적인 CSS 클래스 이름
    onClick, // 클릭 이벤트 핸들러
    size, // 버튼의 크기
    variant = 'invert', // 버튼의 스타일 변형
    loading, // 로딩 상태 여부
    disabled, // 비활성화 상태 여부
  },
  ref // React ref
) {
  return (
    // `button` 엘리먼트를 렌더링합니다.
    <button
      // `clsx`를 사용하여 클래스 이름을 동적으로 결합합니다.
      className={clsx(
        styles.button,
        type && styles[type], // 타입에 따른 스타일 적용
        size && styles[size], // 크기에 따른 스타일 적용
        styles[variant], // 변형에 따른 스타일 적용
        className // 추가적인 클래스 적용
      )}
      ref={ref} // ref 전달
      onClick={onClick} // 클릭 이벤트 핸들러 연결
      // 로딩 또는 비활성화 상태일 경우, 버튼을 비활성화합니다.
      disabled={loading || disabled}
    >
      {/* 로딩 상태라면 로딩 인디케이터를 표시합니다. */}
      {loading && <LoadingDots className={styles.loading} />}
      {/* 버튼의 내용을 렌더링합니다. */}
      <span>{children}</span>
    </button>
  );
});

// `ButtonLink` 컴포넌트는 외부 링크를 위한 버튼 스타일의 `a` 엘리먼트를 렌더링합니다.
export const ButtonLink = forwardRef(function Button(
  {
    children, // 버튼 내용
    type, // 버튼 타입
    className, // 추가적인 CSS 클래스 이름
    href, // 링크 URL
    onClick, // 클릭 이벤트 핸들러
    size, // 버튼의 크기
    variant = 'invert', // 버튼의 스타일 변형
  },
  ref // React ref
) {
  return (
    // `a` 엘리먼트를 렌더링합니다.
    <a
      // 동적으로 클래스 이름을 결합하여 적용합니다.
      className={clsx(
        styles.button,
        type && styles[type],
        size && styles[size],
        variant && styles[variant],
        className
      )}
      ref={ref} // ref 전달
      href={href} // href 속성 설정
      onClick={onClick} // 클릭 이벤트 핸들러 연결
    >
      {/* 버튼의 내용을 렌더링합니다. */}
      <span>{children}</span>
    </a>
  );
});
