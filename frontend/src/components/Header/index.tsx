import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from 'utils/ts/cookie';
import styles from './Header.module.scss';

export default function Header() {
  const [isLogin, setIsLogin] = React.useState(false);

  React.useEffect(() => {
    const isLogine = getCookie('isLogine');
    if (isLogine !== undefined) {
      setIsLogin(true);
    }
  },[]);
  return (
    <div className={styles.header}>
      <Link className={styles.Logo} to="/">
        CarePaws
      </Link>
      <div className={styles.item}>
        {
          isLogin ? (
            <Link className={styles.item__list} to="/detect">
              AI 진단
            </Link>
          ) : (
            <Link className={styles.item__list} to="/login">
              로그인
            </Link>
          )
        }
      </div>
    </div>
  )
}