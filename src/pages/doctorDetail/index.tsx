import styles from './doctorDetail.module.scss';

export default function DoctorDetail() {
  return (
    <div className={styles.template}>
      <div>
        반갑습니다. ~~~ 수의사님
      </div>
      <div>
        <div>
          현재 예약 현황
        </div>
        <div>
          <div>예약 리스트</div>
        </div>
      </div>
    </div>
  )
}