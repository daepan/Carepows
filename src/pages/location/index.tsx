import KakaoMap from "../../components/Map";
import { useImage } from "../../components/context/ImageContext";
import styles from "./location.module.scss";

export default function Location() {
  const { selectedImage } = useImage();

  return (
    <div className={styles.template}>
      <div className={styles.template__location}>
        <div className={styles.location}>
          <div className={styles.location__title}>주변 동물병원 위치</div>
          <div className={styles.location__map}>
            <KakaoMap />
          </div>
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
          <div className={styles.result__title}>
            진단 결과: 종괴 / 결절로 의심됩니다.{"(73%)"}
            <div className={styles.result__description}></div>
          </div>
          <br />
          <div className={styles.result__content}>
            <div className={styles.result__subject}>견종별 대처 방법</div>
            <br />
            <div className={styles.species}>
              <div className={styles.species__small}>
                소형견 :
                <li>
                  정기적인 건강 검진과 촉진을 통해 종괴의 변화를 주시하세요.
                </li>
                <li>종괴가 발견되면 바로 수의사에게 진료를 받으세요.</li>
                <li>
                  작은 종괴도 큰 문제를 일으킬 수 있으므로, 초기 발견과 치료가
                  중요합니다.
                </li>
              </div>
              <br />
              <div className={styles.species__middle}>
                중형견 :
                <li>
                  종괴 발견 시, 바로 수의사에게 상담을 받으세요. 비침습적
                  검사(예: 초음파, X-ray)를 고려하세요.
                </li>
                <li>
                  정기적인 운동과 균형 잡힌 식단을 유지하여 면역 체계를
                  강화하세요.
                </li>
                <li>종괴의 성장 속도, 색상, 모양 변화에 주의를 기울이세요.</li>
              </div>
              <br />
              <div className={styles.species__large}>
                대형견
                <li>
                  대형견은 종괴로 인한 건강 문제가 더욱 심각해질 수 있으므로,
                  조기 발견이 중요합니다.
                </li>
                <li>
                  수의사와 상의하여 정기적인 초음파 검사 및 조직 검사를
                  받으세요.
                </li>
                <li>
                  건강한 체중 유지, 규칙적인 운동, 영양가 있는 식사가
                  중요합니다.
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
