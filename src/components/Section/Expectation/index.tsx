import styles from './Expectation.module.scss';

export default function ExpectationSection() {
  return (
    <div className={styles.section}>
      <div>
        <img className={styles.section__image} src={process.env.PUBLIC_URL + 'images/dog-skin.jpeg'} alt="" />
      </div>
      <div className={styles.section__content}>
        <div className={styles.title}>
          <h2><strong>기대효과</strong></h2>
        </div>
        <div className={styles.desciprtion}>
          <div className={styles.desciprtion__title}>즉각적인 진단과 치료 접근:</div>
          유기동물이 겪고 있는 피부 질환을 빠르게 탐색하고 위험도를 분석함으로써, 동물이 불필요한 고통에서 벗어나도록 도울 수 있습니다. 이는 질병의 조기 발견과 치료로 이어져 동물 복지를 크게 개선할 수 있습니다.
        </div>
        <div className={styles.desciprtion}>
        <div className={styles.desciprtion__title}>조기 진단을 통한 유기동물 건강 보호:</div>
          조기 진단과 치료를 통해, 유기동물의 피부 질환으로 인한 장기적인 건강 문제와 그에 따른 치료 비용을 절감할 수 있습니다.
        </div>
        <div className={styles.desciprtion}>
        <div className={styles.desciprtion__title}>유기동물에 대한 관심 증대:</div>
          앱을 통해 지역 사회 내에서 유기동물을 돌보고 보호하는 활동에 대한 관심과 참여를 증진시킬 수 있습니다.
        </div>
      </div>
    </div>
  )
}