import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.mongodb}>마케팅 광고</span>
          <span className={styles.nextjs}>엔아이</span>
          <span>최고의 효과</span>
        </h1>
       
      </div>
    </Wrapper>
  );
};

export default Hero;
