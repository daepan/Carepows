import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <Link className={styles.Logo} to="/">
        CarePows
      </Link>
      <div className={styles.item}>
        <Link className={styles.item__list} to="/detect">
          AI 진단
        </Link>
        <Link className={styles.item__list} to="/doctor">
          수의사 등록하기
        </Link>
      </div>
    </div>
  )
}