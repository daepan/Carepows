import KakaoMap from "components/Map";
import { Link } from "react-router-dom";
import { useImage } from "components/context/ImageContext";
import { DISEASE_DESCRIPTION } from 'utils/constant';
import styles from "./location.module.scss";

export default function Location() {
  const { selectedImage, diseaseInfo } = useImage();
  console.log(diseaseInfo);
  return (
    <div className={styles.template}>
      <div className={styles.template__location}>
        <div className={styles.location}>
          <div className={styles.location__title}>주변 동물병원 위치</div>
          <div className={styles.location__map}>
            <KakaoMap />
          </div>
          <Link className={styles.location__reserve} to="/reserve">예약하러 가기</Link>
        </div>
      </div>
      <div className={styles.template__result}>
        <div className={styles.result}>
          {selectedImage && (
            <img
              className={styles.result__image}
              src={selectedImage.preview}
              alt="Selected"
            />
          )}
          <br />
          {
            diseaseInfo && (
              diseaseInfo?.map((info) => (
                <div className={styles.result__title} key={info.confidence}>
                  진단 결과: {info.confidence >= 0.5 ? `${DISEASE_DESCRIPTION[info.class].name} (${info.confidence})` : `질병 확률 낮음(${info.confidence})`}
                <div className={styles.result__description}>
                  {
                    info.class ? (
                      DISEASE_DESCRIPTION[info.class].describe
                    ) : (
                      '테스테스ㅌ세ㅡ테스ㅔㅌ슽슷트ㅔㅌ'
                    )
                  }
                </div>
              </div>
              ))
            )
          }
          {
            diseaseInfo?.length === 0 && (
              <div className={styles.result__title}>
                진단 결과: 사진 내 질병 확인 불가 / 병 확률 낮음(0)
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
