import React, { useState } from "react";
import { 
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Button from "@mui/material/Button";
import { setCookie } from "utils/ts/cookie";
import { useNavigate, Link } from "react-router-dom";
import styles from "./doctor.module.scss";

interface IClassUser {
  userId: HTMLInputElement | null;
  password: HTMLInputElement | null;
  isDoctor: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
    isDoctor: false,
  });

  const [userType, setUserType] = useState<string>("유저");

  const fetchDoctor = async (userId: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        setCookie('name', data.data.name, 1);
        setCookie('id', data.data.id, 1);
        navigate("/doctorDetail"); // 로그인 성공 시 페이지 이동
      } else {
        console.error("Login failed:", data.message);
        alert("로그인 실패: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("네트워크 오류");
    }
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const userId = loginRef.current.userId?.value;
    const password = loginRef.current.password?.value;

    if (userId && password) {
      if (loginRef.current.isDoctor) {
        fetchDoctor(userId, password);
      } else {
        // 일반 유저 로그인 처리 로직 추가
        console.log("유저 로그인 로직 추가 필요");
      }
    } else {
      alert("ID와 비밀번호를 모두 입력하세요.");
    }
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserType(value);
    loginRef.current.isDoctor = value === "수의사";
  };

  return (
    <div className={styles.template}>
      <div className={styles.title}>
        CarePaws 로그인
      </div>
      <div className={styles.content}>
      <FormControl>
          <FormLabel id="user-type-radio-buttons-group">User Type</FormLabel>
          <RadioGroup
            aria-labelledby="user-type-radio-buttons-group"
            name="user-type-radio-buttons-group"
            value={userType}
            onChange={handleUserTypeChange}
          >
            <FormControlLabel value="수의사" control={<Radio />} label="수의사" />
            <FormControlLabel value="유저" control={<Radio />} label="유저" />
          </RadioGroup>
        </FormControl>
        <FormControl className={styles.input}>
          <InputLabel htmlFor="id-input">ID</InputLabel>
          <Input
            inputRef={(inputRef) => {
              loginRef.current.userId = inputRef;
            }}
            id="id-input"
            aria-describedby="id-helper-text"
          />
          <FormHelperText id="id-helper-text">ID를 입력하세요</FormHelperText>
        </FormControl>
        <br />
        <FormControl className={styles.input}>
          <InputLabel htmlFor="password-input">PASSWORD</InputLabel>
          <Input
            inputRef={(inputRef) => {
              loginRef.current.password = inputRef;
            }}
            type="password"
            id="password-input"
            aria-describedby="password-helper-text"
          />
          <FormHelperText id="password-helper-text">
            비밀번호를 입력하세요
          </FormHelperText>
        </FormControl>
        <Link to="/register" className={styles.register}>혹시 아직 계정이 없으신가요?</Link>
        <Button
          className={styles.submit}
          onClick={(e) => onSubmit(e)}
          variant="contained"
        >
          로그인
        </Button>
      </div>
    </div>
  );
}
