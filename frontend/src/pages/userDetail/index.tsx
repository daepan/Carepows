import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import styles from "./UserDetail.module.scss";

interface DiagnosisRecord {
  id: string;
  description: string;
  date: string;
}

interface User {
  id: string;
  userId: string;
  name: string;
  number: string;
  describe: string;
  location: string;
  userType: string;
  diagnosisRecords: DiagnosisRecord[];
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}/diagnosis`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          console.log("User details fetched:", data);
          setUser(data.user);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.template}>
      <Typography variant="h4" className={styles.title}>
        사용자 상세 정보
      </Typography>
      {user && (
        <div className={styles.content}>
          <Typography variant="h6">ID: {user.userId}</Typography>
          <Typography variant="h6">이름: {user.name}</Typography>
          <Typography variant="h6">전화번호: {user.number}</Typography>
          <Typography variant="h6">설명: {user.describe}</Typography>
          <Typography variant="h6">위치: {user.location}</Typography>
          <Typography variant="h6">사용자 유형: {user.userType}</Typography>
          <Typography variant="h6">진단 기록:</Typography>
          <List>
            {user.diagnosisRecords.length > 0 ? (
              user.diagnosisRecords.map((record, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`날짜: ${record.date}`}
                    secondary={record.description}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2">진단 기록이 없습니다.</Typography>
            )}
          </List>
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.history.back()}
      >
        돌아가기
      </Button>
    </div>
  );
}
