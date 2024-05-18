import React, { useState, useRef } from "react";
import { 
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  TextField
} from "@mui/material";
import styles from './Register.module.scss';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;
    return re.test(password);
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimer(300); // 5분 = 300초
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailVerification = () => {
    if (validateEmail(email)) {
      // 이메일 인증 요청 로직 추가
      setVerificationCode("123456"); // 예시 코드, 실제로는 서버에서 생성
      startTimer();
      alert("인증번호가 전송되었습니다. 5분 이내에 입력해주세요.");
    } else {
      alert("유효한 이메일 주소를 입력하세요.");
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!validatePassword(password)) {
      alert("비밀번호는 영어, 숫자, 특수기호(!@#$%)를 포함하여 8자 이상이어야 합니다.");
      return;
    }

    if (verificationCode !== inputCode) {
      alert("인증번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 요청 로직 추가
    alert("회원가입이 완료되었습니다.");
  };

  return (
    <div className={styles.template}>
      <Typography variant="h4" className={styles.title}>
        회원가입
      </Typography>
      <div className={styles.content}>
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="email-input">이메일</InputLabel>
          <Input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="email-helper-text"
          />
          <FormHelperText id="email-helper-text">이메일 주소를 입력하세요</FormHelperText>
          <Button variant="contained" onClick={handleEmailVerification} className={styles.verifyButton}>
            이메일 인증하기
          </Button>
        </FormControl>
        <br />
        {timer > 0 && (
          <Typography variant="caption" className={styles.timer}>
            인증번호 입력 시간: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </Typography>
        )}
        <br />
        <FormControl className={styles.input} fullWidth>
          <TextField
            label="인증번호"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            disabled={timer <= 0}
          />
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="password-input">비밀번호</InputLabel>
          <Input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-helper-text"
          />
          <FormHelperText id="password-helper-text">
            비밀번호를 입력하세요 (영어, 숫자, 특수기호 !@#$% 포함 8자 이상)
          </FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="confirm-password-input">비밀번호 확인</InputLabel>
          <Input
            id="confirm-password-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-describedby="confirm-password-helper-text"
          />
          <FormHelperText id="confirm-password-helper-text">
            비밀번호를 다시 입력하세요
          </FormHelperText>
        </FormControl>
        <br />
        <Button
          className={styles.submit}
          onClick={handleRegister}
          variant="contained"
          disabled={!emailVerified || verificationCode !== inputCode || timer <= 0}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
