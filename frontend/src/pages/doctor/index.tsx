import React from "react";
import { FormControl, Input, InputLabel, FormHelperText } from "@mui/material";
import Button from "@mui/material/Button";
import { setCookie } from "utils/ts/cookie";
import { useNavigate } from "react-router-dom";
import styles from "./doctor.module.scss";

interface IClassUser {
  userId: HTMLInputElement | null;
  password: HTMLInputElement | null;
}

export default function Doctor() {
  const navigate = useNavigate();
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
  });
  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const userId = loginRef.current.userId?.value;
    const password = loginRef.current.password?.value;

    if (userId && password) {
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
    } else {
      alert("ID와 비밀번호를 모두 입력하세요.");
    }
  };
  return (
    <div className={styles.template}>
      <div className={styles.title}>
        CarePows 등록 <br />
        수의사 로그인
      </div>
      <div className={styles.content}>
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
