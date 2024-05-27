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
  console.log(typeof diseaseInfos);
  if (diseaseInfos === null || diseaseInfos.length === 0) return {
    xmin: 0,
    ymin: 0,
    xmax: 0,
    ymax: 0,
    confidence: 0,
    class: 7,
    name: "해당 사항 없음",
  };
  console.log(diseaseInfos.find(info => info.confidence >= 0.5));
  return diseaseInfos.find(info => info.confidence >= 0.5);
}

const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

export default function Location() {
  const { selectedImage, diseaseInfo } = useImage();
  console.log(typeof diseaseInfo);
  const highConfidenceDiseaseInfo = getHighConfidenceDiseaseInfo(diseaseInfo);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedImage && highConfidenceDiseaseInfo) {
      const img = new Image();
      img.src = selectedImage.preview;
      img.onload = () => {
        console.log("Image loaded");
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw the box with a thicker line
            ctx.strokeStyle = "red";
            ctx.lineWidth = 10; // Increase the line width to 5
            const { xmin, ymin, xmax, ymax } = highConfidenceDiseaseInfo;
            console.log(`Drawing rect: xmin=${xmin}, ymin=${ymin}, xmax=${xmax}, ymax=${ymax}`);
            ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
          }
        }
      };
    }
  }, [selectedImage, highConfidenceDiseaseInfo]);

  return (
    <div className={styles.template}>
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
                진단 결과: {highConfidenceDiseaseInfo.confidence >= 0.5 ? `${DISEASE_DESCRIPTION[Number(highConfidenceDiseaseInfo.name)].name} (${formatConfidence(highConfidenceDiseaseInfo.confidence)})` : `질병 확률 낮음(${formatConfidence(highConfidenceDiseaseInfo.confidence)})`}
                <div className={styles.result__description}>
                  {
                    highConfidenceDiseaseInfo.name ? (
                      DISEASE_DESCRIPTION[Number(highConfidenceDiseaseInfo.name)].describe
                    ) : (
                      '테스트 설명'
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
      <div className={styles.template__location}>
        <div className={styles.location}>
          <div className={styles.location__title}>주변 동물병원 위치</div>
          <div className={styles.location__map}>
            <KakaoMap />
          </div>
          {
            (highConfidenceDiseaseInfo && highConfidenceDiseaseInfo.confidence >= 0.5) && (
              <>
                <h3>불안하시다면, 지금 당장 원격 진료를 예약해보세요!</h3>
                <Link className={styles.location__reserve} to="/reserve">원격 진료 바로 가기</Link>
              </>
            )
         
          }
        </div>
      </div>
    </div>
  );
}
