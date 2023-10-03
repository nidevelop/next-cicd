// 필요한 라이브러리와 스타일 모듈을 가져옵니다.
import clsx from 'clsx'; // 클래스 네임을 동적으로 관리할 수 있는 유틸리티 라이브러리
import styles from './Skeleton.module.css'; // CSS 모듈

// Skeleton 컴포넌트를 정의합니다. width, height, className, children, 그리고 hide 프로퍼티를 props로 받습니다.
const Skeleton = ({ width, height, className, children, hide }) => {
  return (
    // 스팬 엘리먼트를 반환합니다.
    <span
      // 클래스 네임은 동적으로 결정되며, 'hide'가 false이면 styles.skeleton을, true면 적용되지 않도록 하고, 추가적으로 외부에서 전달받은 className을 적용합니다.
      className={clsx(!hide && styles.skeleton, className)}
      // 인라인 스타일로 width와 height를 적용합니다.
      style={{ width, height }}
    >
      {/* children props를 렌더링하여 자식 엘리먼트들을 표시합니다. */}
      {children}
    </span>
  );
};

// Skeleton 컴포넌트를 export하여 외부에서 사용할 수 있게 합니다.
export default Skeleton;
