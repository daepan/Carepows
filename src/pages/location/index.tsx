import KakaoMap from '../../components/Map'
import styles from './location.module.scss'

export default function Location() {

  return (
    <div className={styles.template}>
      <KakaoMap />
    </div>
  )
}
