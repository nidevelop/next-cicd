// 필요한 훅과 라이브러리를 가져옵니다.
import { useTheme } from 'next-themes'; // 테마에 대한 정보와 함수들을 제공하는 훅
import { useCallback } from 'react'; // 메모이즈된 콜백 함수를 생성하는 훅
import styles from './ThemeSwitcher.module.css'; // CSS 모듈 스타일

// ThemeSwitcher 컴포넌트를 정의합니다.
const ThemeSwitcher = () => {
  // useTheme 훅을 사용하여 현재 테마 정보와 테마를 변경하는 함수를 가져옵니다.
  const { theme, setTheme } = useTheme();

  // onChange 이벤트 핸들러를 메모이즈합니다.
  // 이 함수는 select 엘리먼트의 값이 변경되었을 때 호출되며, 선택된 테마를 설정합니다.
  const onChange = useCallback(
    (e) => {
      // 현재 선택된 옵션의 값을 가져와 테마를 설정합니다.
      setTheme(e.currentTarget.value);
    },
    [setTheme] // setTheme가 변경되면 이 함수를 새로 생성합니다.
  );

  // select 엘리먼트를 렌더링합니다.
  // 이 엘리먼트는 사용자가 테마를 선택할 수 있게 해줍니다.
  return (
    <select
      value={theme} // 현재 테마를 select 엘리먼트의 값으로 설정합니다.
      onChange={onChange} // 값이 변경되었을 때 onChange 함수를 호출합니다.
      className={styles.select} // 스타일을 적용합니다.
    >
      {/* 세 가지 테마 옵션을 제공합니다: System, Dark, Light */}
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

// ThemeSwitcher 컴포넌트를 export 합니다.
export default ThemeSwitcher;
