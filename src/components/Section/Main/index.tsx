import styles from './Main.module.scss';

export default function MainSection() {
  return (
    <div className={styles.section}>
      <img className={styles.logo} src={process.env.PUBLIC_URL + 'images/carepawsLogo.jpg'} alt="로고" />
      <div className={styles.section__title}>
        CarePows를 통해 반려견의 피부건강을 지켜주세요
      </div>
      <div className={styles.section__content}>
        AI로 유기동물의 피부질환을 간단하게 진단받을 수 있습니다.<br />
        빠른 이미지 분석 모델인 YOLOv5를 이용하여 미란/궤양, 결정/종괴 증상을 탐지합니다.
      </div>  
    </div>
  )
}