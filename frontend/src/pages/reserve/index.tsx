import { setCookie, getCookie } from "utils/ts/cookie";
import { TIME } from "utils/constant";
import cn from "utils/ts/clsssNames";
import { isPastEndTime } from "utils/ts/isPastEndTime";
import styles from "./reserve.module.scss";

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
    </div>
  );
}
