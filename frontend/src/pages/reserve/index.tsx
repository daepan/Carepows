import React from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, getCookie, deleteCookie } from "utils/ts/cookie";
import { TIME } from "utils/constant";
import cn from "utils/ts/clsssNames";
import { isPastEndTime } from "utils/ts/isPastEndTime";
import styles from "./reserve.module.scss";

const isReserve = () => {
  console.log(getCookie("reservendTime"));
  if (getCookie("reserveendTime") && getCookie("reservestartTime")) {
    return true;
  }
  return false;
};

export default function Reserve() {
  const [isReserveTime, setIsReserveTime] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const onClickReserve = (e: React.MouseEvent<HTMLButtonElement>, startTime: string, endTime: string) => {
    e.preventDefault();
    if (isPastEndTime(endTime)) {
      alert('예약할 수 있는 시간이 아닙니다.');
    } else if (!isReserve()) {
      setCookie("reservestartTime", startTime, 1);
      setCookie("reserveendTime", endTime, 1);
      setCookie("isReserve", true, 1);
      setIsReserveTime(true);
      alert(`${startTime} ~ ${endTime}시간으로 예약되었습니다.`)
    } else {
      alert('현재 예약하신 상태입니다.')
    }
  };
  const onClickCancleReserve = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteCookie("reservestartTime");
    deleteCookie("reserveendTime");
    deleteCookie("isReserve");
    setIsReserveTime(false);
    alert('예약이 취소되었습니다.');
  };
  const onClickEnterRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/room');
  }

  React.useEffect(() => {
    if (getCookie('isReserve') !== undefined) {
      setIsReserveTime(true);
    }
    return () => {
      if (getCookie('isReserve') !== undefined) {
        setIsReserveTime(true);
      }
    }
  }, [])
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <div className={styles.title}>현재 예약 현황</div>
        {
          isReserveTime ? (
            <div className={styles['content__item--reserve']}>
              <div className={styles.time}>
                {getCookie("reservestartTime")} ~ {getCookie("reserveendTime")}
              </div>
              <div>
              <button
                className={styles.content__enter}
                onClick={(e) => onClickEnterRoom(e)}
              >
                방에 입장하기
              </button>
              <button
                className={styles.content__reserve}
                onClick={(e) => onClickCancleReserve(e)}
              >
                예약 취소하기
              </button>
              </div>
            </div>
          ) : (
            <div className={styles['content__item--reserve']}>예약한 내용이 없습니다.</div>
          )
        }
        <div className={styles.content}>
        <div className={styles.content__list}>
          {TIME.map((time) => (
            <div className={styles.content__item}>
              <div className={styles.time}>
                {time.startTime} ~ {time.endTime}
              </div>
              <button
                className={cn({
                  [styles.content__reserve]: true,
                  [styles['content__reserve--disabled']]: isPastEndTime(time.endTime) || getCookie("isReserve") !== undefined,
                })}
                onClick={(e) => onClickReserve(e, time.startTime, time.endTime)}
              >
                예약하기
              </button>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
