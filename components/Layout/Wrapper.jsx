// clsx 라이브러리 import
import clsx from 'clsx';
// Wrapper.module.css에서 스타일 import
import styles from './Wrapper.module.css';

// Wrapper 컴포넌트 정의. children과 className을 props로 받습니다.
const Wrapper = ({ children, className }) => {
  // div 요소를 반환하며, 클래스 이름으로는 styles.wrapper와 전달받은 className을 사용합니다.
  // clsx를 사용하여, className이 제공되지 않았을 때에도 에러 없이 스타일을 적용할 수 있습니다.
  return <div className={clsx(styles.wrapper, className)}>{children}</div>;
};

// Wrapper 컴포넌트를 외부에서 사용할 수 있도록 export합니다.
export default Wrapper;
