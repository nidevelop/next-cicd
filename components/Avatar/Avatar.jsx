// 스타일 시트를 불러옵니다.
import styles from './Avatar.module.css';

// Avatar는 사용자의 프로필 이미지를 표시하는 컴포넌트입니다.
// props로 size, username, 그리고 url을 받아옵니다.
const Avatar = ({ size, username, url }) => {
  return (
    // img 태그를 사용하여 이미지를 렌더링합니다.
    // src 속성은 url이 제공되면 해당 url을,
    // 그렇지 않을 경우 기본 이미지를 사용합니다.
    // alt 속성은 사용자의 이름(username)을 표시하고,
    // width와 height 속성은 이미지의 크기를 설정합니다.
    <img
      // className은 CSS 모듈 스타일을 적용하기 위함입니다.
      className={styles.avatar}
      // 이미지의 URL. url이 없으면 기본 이미지를 사용합니다.
      src={url || '/images/default_user.jpg'}
      // 이미지의 대체 텍스트로 사용자 이름을 지정합니다.
      alt={username}
      // 이미지의 너비를 지정합니다.
      width={size}
      // 이미지의 높이를 지정합니다.
      height={size}
    />
  );
};

// Avatar 컴포넌트를 내보냅니다.
export default Avatar;
