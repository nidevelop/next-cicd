// Spacer 컴포넌트 정의
const Spacer = ({ size, axis }) => {
  // axis 값이 'vertical'이라면 width는 1, 아니라면 size에 24를 곱한 값
  const width = axis === 'vertical' ? 1 : size * 24;
  // axis 값이 'horizontal'이라면 height는 1, 아니라면 size에 24를 곱한 값
  const height = axis === 'horizontal' ? 1 : size * 24;

  // <span> 엘리먼트를 반환하며, 위에서 계산한 width와 height로 스타일링
  return (
    <span
      style={{
        display: 'block', // 항상 블록 레벨로 표시
        width, // 계산한 width 값 적용
        minWidth: width, // 최소 가로 폭도 width로 지정
        height, // 계산한 height 값 적용
        minHeight: height, // 최소 세로 높이도 height로 지정
      }}
      aria-hidden="true" // 스크린 리더에서 숨김 처리
    />
  );
};

// Spacer 컴포넌트를 외부에서 사용할 수 있도록 export
export default Spacer;
