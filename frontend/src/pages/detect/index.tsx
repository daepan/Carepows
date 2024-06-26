import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../components/context/ImageContext";
import cn from "../../utils/ts/clsssNames";
import styles from "./detect.module.scss";

const Detect: React.FC = () => {
  const { selectedImage, setSelectedImage, setDiseaseInfo } = useImage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUpload = (file: File): void => {
    setSelectedImage({
      preview: URL.createObjectURL(file),
      file,
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
  };

  const onClickSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작

    try {
      if (selectedImage === null) {
        setIsLoading(false); // 로딩 종료
        alert("이미지가 없습니다.");
        return;
      }
      console.log(selectedImage);

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("image", selectedImage.file);

      const response = await fetch("https://carepaws-server.n-e.kr/v1/object-detection", {
        method: "POST",
        body: formData, // FormData를 body로 설정
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setDiseaseInfo(data.result);
      setIsLoading(false); // 로딩 종료
      navigate("/location"); // 페이지 이동
    } catch (e) {
      console.error(e);
      setIsLoading(false); // 로딩 종료
      alert("예상치 못한 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.section__context}>
        <img
          className={styles.logo}
          src={process.env.PUBLIC_URL + "images/carepawsLogo.jpg"}
          alt="로고"
        />
        <div>강아지의 피부 질환이 의심되는 부위를 찍어주세요</div>
      </div>
      <div
        className={styles.section__upload}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <label htmlFor="file-upload">사진 업로드하기</label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        {selectedImage ? (
          <div className={styles.preview}>
            <img
              className={styles.preview__image}
              src={selectedImage.preview}
              alt="Preview"
            />
            <button className={styles.preview__remove} onClick={clearImage}>
              제거
            </button>
          </div>
        ) : (
          <div className={styles.file} aria-hidden>
            파일을 드래그하거나 업로드해주세요
          </div>
        )}

        <button
          className={cn({
            [styles.submit]: true,
            [styles["submit--able"]]: !!selectedImage,
          })}
          disabled={!selectedImage}
          onClick={(e) => onClickSubmit(e)}
        >
          진단해보기
        </button>
      </div>
      {isLoading && (
        <div className={styles.background}>
          <img src="/images/loading.svg" alt="로딩 중" />
          <div>CarePaws가 피부 병변을 분석 중 입니다!(최대 1분가량 소요)</div>
        </div>
      )}
    </div>
  );
};

export default Detect;
