import clsx from 'clsx';
import styles from './Container.module.css';

// 컨테이너 컴포넌트
const Container = ({
  justifyContent, // justify-content CSS 속성을 정의합니다. (예: 'center', 'flex-start' 등)
  flex, // flex CSS 속성을 정의합니다.
  alignItems, // align-items CSS 속성을 정의합니다. (예: 'center', 'flex-start' 등)
  column, // column이 true일 경우, 플렉스박스 방향을 컬럼으로 설정합니다.
  className, // 외부에서 추가로 전달한 클래스명
  children, // 하위 요소 또는 컴포넌트
}) => {
  return (
    // clsx를 사용해 조건부로 클래스명을 결합합니다.
    // column 값이 true일 경우 styles.column 클래스를 추가하며, 외부에서 전달된 className도 추가합니다.
    <div
      className={clsx(styles.container, column && styles.column, className)}
      // 인라인 스타일로 주어진 속성값을 설정합니다.
      style={{
        justifyContent,
        flex,
        alignItems,
      }}
    >
      {children} {/* 하위 요소 또는 컴포넌트를 렌더링합니다. */}
    </div>
  );
};

export default Container;
