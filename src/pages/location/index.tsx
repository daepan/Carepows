import KakaoMap from '../../components/Map'
import styles from './location.module.scss'

export default function Location() {

  return (
    <div className={styles.template}>
      <div className={styles.template__location}>
      <KakaoMap />
      </div>
      <div className={styles.template__result}>
        <div>진단 결과: 종괴 / 결절로 의심됩니다.</div>
        <div>
          견종별 대처 방법
          <div>소형견 : ~~</div>
          <div>중형견 : ~~</div>
          <div>대형견 : ~~</div>
        </div>
      </div>
    </div>
  )
}
