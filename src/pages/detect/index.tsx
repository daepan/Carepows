import styles from './detect.module.scss'

export default function Detect() {
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // 파일 처리 로직을 여기에 추가할 수 있습니다.
      console.log(file);
      // 예를 들어, 파일을 읽거나 업로드할 수 있습니다.
    }
  };

  return (
    <div className={styles.template}>
      <img className={styles.logo} src={process.env.PUBLIC_URL + 'images/carepawsLogo.jpg'} alt="로고" />
      <div>강아지의 피부 질환이 의심되는 부위를 찍어주세요</div>
      <div className={styles.section__upload}>
        <label htmlFor="file-upload">사진 업로드하기</label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} />
      </div>
    </div>
  )
}
