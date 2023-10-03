// clsx 라이브러리를 임포트합니다. clsx는 여러 클래스 이름을 조건부로 결합할 때 유용합니다.
import clsx from 'clsx';
// LoadingDots.module.css 파일로부터 스타일을 임포트합니다.
import styles from './LoadingDots.module.css';

// LoadingDots 컴포넌트를 정의합니다. 이 컴포넌트는 로딩 표시용 도트 애니메이션을 생성합니다.
// children 및 className 프롭스(props)를 파라미터로 받습니다.
const LoadingDots = ({ children, className }) => {
  return (
    // span 요소를 리턴합니다. 이 span 요소의 className은 clsx를 사용하여 결합됩니다.
    // styles.loading은 항상 적용되고, className이 제공되면 추가로 적용됩니다.
    <span className={clsx(styles.loading, className)}>
      {/* 
        children 프롭스가 제공되면,
        div 요소를 생성하고, 그 안에 children을 넣습니다.
        이 div 요소의 클래스 이름은 styles.child로 설정됩니다.
      */}
      {children && <div className={styles.child}>{children}</div>}

      {/* 
        세 개의 빈 span 요소는 로딩 도트를 표현합니다.
        CSS에서 애니메이션이 설정되어 있을 것으로 예상합니다.
      */}
      <span />
      <span />
      <span />
    </span>
  );
};

// LoadingDots 컴포넌트를 export하여 다른 파일에서 임포트할 수 있게 합니다.
export default LoadingDots;
