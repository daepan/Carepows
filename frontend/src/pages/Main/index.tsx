import MainSection from '../../components/Section/Main';
import Yolov5Section from '../../components/Section/Yolov5';
import ExpectationSection from '../../components/Section/Expectation';
import styles from './Main.module.scss';

export default function Main() {
  return (
    <div className={styles.template}>
      <MainSection />
      <Yolov5Section />
      <ExpectationSection />
    </div>
  )
}