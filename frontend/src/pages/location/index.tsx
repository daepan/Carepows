import KakaoMap from "components/Map";
import { Link } from "react-router-dom";
import { useImage } from "components/context/ImageContext";
import { DISEASE_DESCRIPTION } from 'utils/constant';
import styles from "./location.module.scss";

export default function Location() {
  const { selectedImage, diseaseInfo } = useImage();

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
              <div className={styles.result__title}>
                진단 결과: {diseaseInfo[0].confidence >= 50 ? `${diseaseInfo[0].name} (${diseaseInfo[0].confidence})` : `특이사항 없음(${diseaseInfo[0].confidence})`}
                <div className={styles.result__description}>
                  {
                    DISEASE_DESCRIPTION[diseaseInfo[0].class].describe
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
