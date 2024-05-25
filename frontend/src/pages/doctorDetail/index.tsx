import React from "react";
import { getCookie } from "utils/ts/cookie";
import cn from "utils/ts/clsssNames";
import { TIME } from "utils/constant";
import { useNavigate } from "react-router-dom";
import styles from "./doctorDetail.module.scss";

export default function DoctorDetail() {
  const navigate = useNavigate();
  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/room');
  };
  const isPastEndTime = (endTime: string) => {
    const currentTime = new Date();
    const [hours, minutes] = endTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes, 0, 0);
    return endDate < currentTime;
  };

  return (
    <div className={styles.template}>
      <div className={styles.template__header}>반갑습니다. {getCookie('name') ? `${getCookie('name')}`: '김대관' } 수의사님</div>
      <div className={styles.template__content}>
        <div className={styles.create}>
          <button
            className={styles.template__create}
            onClick={(e) => onClickCreateRoom(e)}
          >
            진료실 생성하기
          </button>
        </div>
        <div className={styles.timeline}>
          <div className={styles.timeline__title}>진료 예약 시간</div>
          <div className={styles.timeline__list}>
          {
            TIME.map((time, index) => (
              <div
                key={time.startTime} 
                className={cn({
                  [styles.timeline__item]: true,
                  [styles['timeline__item--disabled']]: isPastEndTime(time.endTime),
                })}
              >
                <div className={styles.timeline__index}>
                  {`${index + 1} 차시`} &nbsp;
                </div>
                <div className={styles.timeline__time}>
                  {time.startTime} ~ {time.endTime}
                </div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
}
