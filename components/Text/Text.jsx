// 필요한 라이브러리와 스타일 모듈을 가져옵니다.
import clsx from 'clsx'; // 클래스 이름을 동적으로 관리할 수 있는 유틸리티 라이브러리
import { forwardRef } from 'react'; // React의 forwardRef 함수를 가져옵니다.
import styles from './Text.module.css'; // CSS 모듈

// Text 컴포넌트를 정의합니다. forwardRef를 사용하여 ref를 내부 컴포넌트로 전달할 수 있게 합니다.
export const Text = forwardRef(function Text(
  // color, children, className, as 그리고 나머지 props를 매개변수로 받습니다.
  { color, children, className, as, ...props },
  ref // forwardRef를 사용하여 받은 ref 매개변수
) {
  // Component는 'as' prop으로 받은 컴포넌트 타입이거나, 기본적으로 'p' 태그입니다.
  const Component = as || 'p';
  return (
    // 동적으로 컴포넌트를 생성하고, 주어진 props와 ref를 전달합니다.
    <Component
      // color prop이 주어진 경우, CSS 변수 '--color'를 설정합니다.
      style={color ? { '--color': `var(--${color})` } : undefined}
      // 동적으로 클래스 이름을 결정하고 추가적으로 외부에서 전달받은 className을 적용합니다.
      className={clsx(styles.text, className)}
      // 나머지 props를 컴포넌트에 전달합니다.
      {...props}
      // ref를 컴포넌트에 전달합니다.
      ref={ref}
    >
      {/* children을 렌더링합니다. */}
      {children}
    </Component>
  );
});

// TextLink 컴포넌트를 정의합니다. 이 컴포넌트도 forwardRef를 사용합니다.
export const TextLink = forwardRef(function Text(
  // color, children, className, href, onClick, variant를 매개변수로 받습니다.
  { color, children, className, href, onClick, variant },
  ref // forwardRef를 사용하여 받은 ref 매개변수
) {
  return (
    // 'a' 태그를 생성하고 주어진 props와 ref를 전달합니다.
    <a
      // color prop이 주어진 경우, CSS 변수 '--color'를 설정합니다.
      style={color ? { '--color': `var(--${color})` } : undefined}
      // 동적으로 클래스 이름을 결정하며, variant가 주어진 경우 관련 스타일도 적용합니다. 추가적으로 외부에서 전달받은 className도 적용합니다.
      className={clsx(
        styles.text,
        styles.link,
        variant && styles[variant],
        className
      )}
      // href, ref, onClick을 'a' 태그에 전달합니다.
      href={href}
      ref={ref}
      onClick={onClick}
    >
      {/* children을 렌더링합니다. */}
      {children}
    </a>
  );
});
