import { 
  FormControl,
  Input,
  InputLabel,
  FormHelperText
} from '@mui/material';
import Button from '@mui/material/Button';
import styles from './doctor.module.scss';
import { useNavigate } from 'react-router-dom';

export default function Doctor() {
  const navigate = useNavigate();
  const onSubmit = (e: any) => {
    e.preventDefault();
    navigate("/room");
  }
  return (
    <div className={styles.template}>
      <div className={styles.title}>
        CarePows 등록 <br /> 
        수의사 로그인
      </div>
      <div className={styles.content}>
        <FormControl className={styles.input}>
          <InputLabel htmlFor="id-input">ID</InputLabel>
          <Input id="id-input" aria-describedby="id-helper-text" />
          <FormHelperText id="id-helper-text">ID를 입력하세요</FormHelperText>
        </FormControl>
        <FormControl className={styles.input}>
          <InputLabel htmlFor="password-input">PASSWORD</InputLabel>
          <Input id="password-input" aria-describedby="password-helper-text" />
          <FormHelperText id="password-helper-text">비밀번호를 입력하세요</FormHelperText>
        </FormControl>
        <Button className={styles.submit} onClick={(e) => onSubmit(e)} variant="contained">로그인</Button>
      </div>
    </div>
  )
}