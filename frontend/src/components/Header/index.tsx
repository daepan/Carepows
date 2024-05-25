import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'components/context/AuthContext';
import styles from './Header.module.scss';

export default function Header() {
  const { isLogin, userType, userId, logout } = useAuth();
  const navigate = useNavigate();

  const onClickMyPageLink = () => {
    if (userType === 'doctor') {
      navigate(`/doctorDetail/${userId}`);
    } else if (userType === 'user' && userId) {
      navigate(`/userDetail/${userId}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.header}>
      <Link className={styles.Logo} to="/">
        CarePaws
      </Link>
      <div className={styles.item}>
        {isLogin ? (
          <>
            <Link className={styles.item__list} to="/detect">
              AI 진단
            </Link>
            <div className={styles.item__list} onClick={onClickMyPageLink}>
              마이 페이지
            </div>
            <div className={styles.item__list} onClick={handleLogout}>
              로그아웃
            </div>
          </>
        ) : (
          <Link className={styles.item__list} to="/login">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
