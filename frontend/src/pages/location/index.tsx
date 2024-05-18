import React, { useEffect, useRef } from "react";
import KakaoMap from "components/Map";
import { Link } from "react-router-dom";
import cn from "utils/ts/clsssNames";
import { useImage } from "components/context/ImageContext";
import { DISEASE_DESCRIPTION } from 'utils/constant';
import styles from "./location.module.scss";

interface DiseaseInfo {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
}

function getHighConfidenceDiseaseInfo(diseaseInfos: DiseaseInfo[] | null): DiseaseInfo | undefined {
  if (diseaseInfos === null) return;
  return diseaseInfos.find(info => info.confidence >= 0.5);
}

export default function Location() {
  const { selectedImage, diseaseInfo } = useImage();
  const highConfidenceDiseaseInfo = getHighConfidenceDiseaseInfo(diseaseInfo);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedImage && highConfidenceDiseaseInfo) {
      const img = new Image();
      img.src = selectedImage.preview;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw the box
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            const { xmin, ymin, xmax, ymax } = highConfidenceDiseaseInfo;
            ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
          }
        }
      };
    }
  }, [selectedImage, highConfidenceDiseaseInfo]);

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
            <canvas
              className={styles.result__image}
              ref={canvasRef}
            />
          )}
          <br />
          {
            highConfidenceDiseaseInfo && (
              <div className={cn({
                [styles.result__title]: true,
              })} key={highConfidenceDiseaseInfo.confidence}>
                진단 결과: {highConfidenceDiseaseInfo.confidence >= 0.5 ? `${DISEASE_DESCRIPTION[highConfidenceDiseaseInfo.class].name} (${highConfidenceDiseaseInfo.confidence})` : `질병 확률 낮음(${highConfidenceDiseaseInfo.confidence})`}
                <div className={styles.result__description}>
                  {
                    highConfidenceDiseaseInfo.class ? (
                      DISEASE_DESCRIPTION[highConfidenceDiseaseInfo.class].describe
                    ) : (
                      '테스테스ㅌ세ㅡ테스ㅔㅌ슽슷트ㅔㅌ'
                    )
                  }
                </div>
              </div>
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
