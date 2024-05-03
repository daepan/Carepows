import styles from './doctorDetail.module.scss';


export default function DoctorDetail() {
  const onClickCreateRoom = () =>{

  }
  return (
    <div className={styles.template}>
      <div className={styles.template__header}>
        반갑습니다.  수의사님
      </div>
      <div className={styles.template__create}>
        진료실 생성하기
      </div>
    </div>
  )
}