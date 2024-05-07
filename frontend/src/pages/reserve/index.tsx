import { setCookie, getCookie } from "../../utils/ts/cookie";
import styles from "./reserve.module.scss";

const TIME = [
  {
    startTime: "9:00",
    endTime: "10:00",
  },
  {
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    startTime: "15:00",
    endTime: "16:00",
  },
  {
    startTime: "16:00",
    endTime: "17:00",
  },
  {
    startTime: "17:00",
    endTime: "18:00",
  },
];

const isReserve = () => {
  if (getCookie("endTime") && getCookie("startTime")) {
    return true;
  }
  return false;
};

export default function Reserve() {
  const onClickReserve = (startTime: string, endTime: string) => {
    if (isReserve()) {
      setCookie("startTime", startTime, 1);
      setCookie("endTime", endTime, 1);
    }
  };
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <div className={styles.title}>현재 예약 현황</div>
        <div className={styles.content__list}>
          {TIME.map((time) => (
            <div className={styles.content__item}>
              <div className={styles.time}>
                {time.startTime} ~ {time.endTime}
              </div>
              <button
                className={styles.reserve}
                disabled={isReserve()}
                onClick={() => onClickReserve(time.startTime, time.endTime)}
              >
                예약하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
