// 필요한 모듈과 스타일 시트를 가져옴
import clsx from 'clsx'; // 클래스 이름을 조건부로 결합하기 위한 라이브러리
import { forwardRef } from 'react'; // React의 forwardRef 함수를 가져옴
import styles from './Input.module.css'; // CSS 모듈 스타일을 가져옴

// forwardRef를 사용하여 Input 컴포넌트를 정의
// 이를 통해 이 컴포넌트는 ref를 받을 수 있게 된다.
const Input = forwardRef(function Input(
  {
    label, // input의 라벨 텍스트
    placeholder, // placeholder 텍스트
    className, // 외부에서 추가로 주어질 className
    htmlType, // input의 type 속성 값
    autoComplete, // 자동 완성 기능의 설정 값
    size, // 크기 관련 스타일 클래스 결정
    ariaLabel, // 접근성을 위한 aria-label 속성 값
    required, // 필수 입력 항목인지 여부
  },
  ref // forwardRef를 통해 전달받은 ref
) {
  return (
    // 루트 div 요소에 대한 스타일을 적용하고, 외부에서 받은 className도 추가적으로 적용
    <div className={clsx(styles.root, className)}>
      {/* label 요소를 사용하여 input을 라벨링 */}
      <label>
        {/* label prop이 주어진 경우, 라벨 텍스트를 표시 */}
        {label && <div className={styles.label}>{label}</div>}
        {/* input 요소를 렌더링하며, 필요한 속성들을 적용 */}
        <input
          type={htmlType} // input의 type을 지정
          autoComplete={autoComplete} // 자동완성 기능 설정
          placeholder={placeholder} // placeholder 텍스트 설정
          ref={ref} // 전달받은 ref를 input에 연결
          // input 요소에 대한 기본 스타일과, size prop에 따른 추가 스타일을 적용
          className={clsx(styles.input, size && styles[size])}
          aria-label={ariaLabel} // 접근성을 위한 라벨 제공
          required={required} // 필수 입력 항목 설정
        />
      </label>
    </div>
  );
});

// Input 컴포넌트를 export하여 외부에서 사용 가능하게 함
export default Input;
