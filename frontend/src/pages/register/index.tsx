import React, { useState } from "react";
import { 
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './Register.module.scss';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [describe, setDescribe] = useState("");
  const [location, setLocation] = useState("");
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;
    return re.test(password);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!validatePassword(password)) {
      alert("비밀번호는 영어, 숫자, 특수기호(!@#$%)를 포함하여 8자 이상이어야 합니다.");
      return;
    }

    if (!validateEmail(email)) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: email, password, name, number, describe, location, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        navigate('/login');
      } else {
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("네트워크 오류로 인해 회원가입에 실패했습니다.");
    }
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
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="name-input">이름</InputLabel>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby="name-helper-text"
          />
          <FormHelperText id="name-helper-text">이름을 입력하세요</FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="number-input">전화번호</InputLabel>
          <Input
            id="number-input"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            aria-describedby="number-helper-text"
          />
          <FormHelperText id="number-helper-text">전화번호를 입력하세요</FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="describe-input">설명</InputLabel>
          <Input
            id="describe-input"
            value={describe}
            onChange={(e) => setDescribe(e.target.value)}
            aria-describedby="describe-helper-text"
          />
          <FormHelperText id="describe-helper-text">설명을 입력하세요</FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="location-input">위치</InputLabel>
          <Input
            id="location-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-describedby="location-helper-text"
          />
          <FormHelperText id="location-helper-text">위치를 입력하세요</FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input} fullWidth>
          <InputLabel htmlFor="userType-input">사용자 유형</InputLabel>
          <br />
          <Select
            id="userType-input"
            value={userType}
            onChange={(e) => setUserType(e.target.value as string)}
          >
            <MenuItem value="user">일반 사용자</MenuItem>
            <MenuItem value="doctor">수의사</MenuItem>
          </Select>
        </FormControl>
        <br />
        <Button
          className={styles.submit}
          onClick={handleRegister}
          variant="contained"
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
