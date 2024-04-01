import React, { useState } from 'react';
import cn from '../../utils/ts/clsssNames';
import styles from './detect.module.scss';

interface SelectedImage {
  preview: string;
  file: File;
}

const Detect: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

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
    const file = event.dataTransfer.files[0]; // Assuming single file drop
    if (file) {
      handleUpload(file);
    }
  };

  const clearImage = (): void => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview); // Clean up
      setSelectedImage(null);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.section__context}>
        <img className={styles.logo} src={process.env.PUBLIC_URL + 'images/carepawsLogo.jpg'} alt="로고" />
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
          style={{ display: 'none' }}
        />
        {selectedImage ? (
          <div className={styles.preview}>
            <img className={styles.preview__image} src={selectedImage.preview} alt="Preview" />
            <button className={styles.preview__remove} onClick={clearImage}>제거</button>
          </div>
        ) : (
          <div className={styles.file}>파일을 드래그하거나 업로드해주세요</div>
        )}
        
        <button className={cn({
          [styles.submit]: true,
          [styles['submit--able']]: !!selectedImage,
        })} disabled={!selectedImage} onClick={() => console.log('Submit logic here')}>
          진단해보기
        </button>
      </div>
    </div>
  );
};

export default Detect;
