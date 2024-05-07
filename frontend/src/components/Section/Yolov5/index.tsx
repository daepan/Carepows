import styles from "./Yolov5.module.scss";

export default function Yolov5Section() {
  return (
    <div className={styles.section}>
      <div className={styles.section__content}>
        <div className={styles.title}>
          <h2>
            <strong>YOLOv5</strong>
          </h2>
          <h4>You Only Look Once</h4>
        </div>
        <div className={styles.desciprtion}>
          YOLO는 이미지 전체를 한 번만 보고 탐지를 수행하여 다른 탐지모델(Object
          Detection Algorithm)과 비교했을 때, 매우 빠른 처리 속도를 가지고
          있습니다.
        </div>
        <div className={styles.desciprtion}>
          다양한 버전 중 2020년 6월에 출시된 Pytorch 기반의 YOLOv5는 이전 버전과
          비교하여 쉽게 환경 구성이 가능하고 빠르게 구현이 가능한 장점이 있어
          Carepows에서 사용합니다.
        </div>
        🚀{" "}
        <a
          href="https://github.com/ultralytics/yolov5"
          target="_blank"
          rel="noreferrer"
        >
          Yolov5 Github
        </a>
      </div>
      <div>
        <img
          className={styles.section__image}
          src={process.env.PUBLIC_URL + "images/yolov5_logo.png"}
          alt=""
        />
      </div>
    </div>
  );
}
