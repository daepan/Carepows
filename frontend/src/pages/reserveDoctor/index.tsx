import useParamsHandler from "utils/hooks/useParamsHandler";
import styles from "./reserveDoctor.module.scss";
import { useNavigate } from "react-router-dom";

const doctors = [
  {
    id: 1,
    userId: "qw03011",
    password: "1234",
    name: "김대관",
    number: "042-472-8480",
    describe: "성실하게 임하겠습니다.",
    location: "대전패트릭동물병원",
  },
  {
    id: 2,
    name: "김형진",
    userId: "hy123",
    password: "1234",
    number: "041-422-8610",
    describe: "잘 임하겠습니다.",
    location: "서울진사동물병원",
  },
  {
    id: 3,
    name: "전민서",
    userId: "ms123",
    password: "1234",
    number: "02-725-8508",
    describe: "열심히 임하겠습니다.",
    location: "청주펫케어병원",
  },
];

export default function ReserveDoctor() {
  const { setParams } = useParamsHandler();
  const navigate = useNavigate();
  const onClickDoctorCard = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    setParams("doctorId", id.toString(), { deleteBeforeParam: true, replacePage: false });
    navigate("/reserveDetail");
  }
  return (
    <div className={styles.template}>
      <div className={styles.header}>
        <div className={styles.header__title}>의료진 예약하기</div>
        <div className={styles.header__description}>
          Carepows의 원격 의료진을 소개합니다.
        </div>
      </div>
      <div className={styles.list}>
        {doctors.map((item) => (
          <div className={styles.list__item} key={item.id} onClick={(e) => onClickDoctorCard(e, item.id)}>
            <div className={styles.list__name}>{item.name} 수의사님</div>
            <div className={styles.list__content}>
              <div className={styles.list__describe}>{item.describe}</div>
              <div className={styles.list__location}>{item.location}</div>
              <div className={styles.list__number}>{item.number}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
