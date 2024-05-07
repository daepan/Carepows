import React from "react";
import styles from "./doctorDetail.module.scss";

export default function DoctorDetail() {
  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <div className={styles.template}>
      <div className={styles.template__header}>반갑습니다. 수의사님</div>
      <button
        className={styles.template__create}
        onClick={(e) => onClickCreateRoom(e)}
      >
        진료실 생성하기
      </button>
    </div>
  );
}
