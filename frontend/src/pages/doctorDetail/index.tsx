import React from "react";
import { getCookie } from "utils/ts/cookie";
import { useNavigate } from "react-router-dom";
import styles from "./doctorDetail.module.scss";

export default function DoctorDetail() {
  const navigate = useNavigate();
  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/socketRoom');
  };
  return (
    <div className={styles.template}>
      <div className={styles.template__header}>반갑습니다. {getCookie('name') ? `${getCookie('name')}`:'' } 수의사님</div>
      <button
        className={styles.template__create}
        onClick={(e) => onClickCreateRoom(e)}
      >
        진료실 생성하기
      </button>
    </div>
  );
}
