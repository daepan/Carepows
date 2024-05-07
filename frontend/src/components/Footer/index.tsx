import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <ul className={styles.sitemap__content}>
          <li className={styles.sitemap__link}>
            <a
              href="https://github.com/daepan/Carepows"
              target="_blank"
              rel="noreferrer"
            >
              Github 바로가기
            </a>
          </li>
          <li className={styles.sitemap__link}>
            <a href="mailto:qw04011@gmail.com" target="_blank" rel="noreferrer">
              메일 문의하기
            </a>
          </li>
          <li className={styles.sitemap__link}>
            <a
              href="https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=data&dataSetSn=561"
              target="_blank"
              rel="noreferrer"
            >
              AI Hub
            </a>
          </li>
          <li className={styles.sitemap__link}>
            <a
              href="https://www.instagram.com/murpan_kim/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
        </ul>
      </div>
      <span className={styles.sitemap__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {new Date().getFullYear()}
        &nbsp;BY Team ASAP ALL RIGHTS RESERVED.
      </span>
    </div>
  )
}
