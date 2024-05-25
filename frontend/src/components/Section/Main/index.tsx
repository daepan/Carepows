import { Link } from 'react-router-dom';
import styles from './Main.module.scss';

export default function MainSection() {
  return (
    <div className={styles.section}>
      <img className={styles.logo} src={process.env.PUBLIC_URL + 'images/carepawsLogo.jpg'} alt="로고" />
      <div className={styles.section__title}>
        CarePaws를 통해 반려견의 피부건강을 지켜주세요
      </div>
      <div className={styles.section__content}>
        AI로 반려견의 피부질환을 간단하게 진단받을 수 있습니다.<br />
        빠른 이미지 분석 모델인 YOLO를 이용하여 피부 질환을 탐지합니다.<br />
        또한 원격 진단이 허가된 수의사를 통해 원격 진료를 받아보세요
      </div>
      <Link to='/detect' className={styles.section__detect}>진단하기</Link>  
    </div>
  )
}