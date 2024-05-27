import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./UserDetail.module.scss";

interface DiagnosisRecord {
  id: string;
  description: string;
  diseaseName: string;
  date: string;
  doctorName: string;
  hospital: string;
  doctor: string;
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
  const reportRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/${id}/diagnosis`, {
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

  const handleDownloadReport = async (index: number) => {
    if (!reportRefs.current[index]) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(reportRefs.current[index]!);
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`diagnosis_report_${index + 1}.pdf`);
  };

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
          <Typography variant="h6">반려견: {user.describe}</Typography>
          <Typography variant="h6">위치: {user.location}</Typography>
          <Typography variant="h6">사용자 유형: {user.userType}</Typography>
          {user.diagnosisRecords.map((record, index) => (
            <div key={record.id} className={styles.reportContainer}>
              <div
                ref={(el) => (reportRefs.current[index] = el)}
                className={styles.report}
              >
                <Typography variant="h5" className={styles.reportTitle}>
                  진단 기록
                </Typography>
                <Divider />
                <div className={styles.reportSection}>
                  <div className={styles.sectionLabel}>환자정보</div>
                  <div className={styles.sectionContent}>
                    <Typography>환자 ID: {user.userId}</Typography>
                    <Typography>이름: {user.name}</Typography>
                    <Typography>전화번호: {user.number}</Typography>
                    <Typography>견종: {user.describe}</Typography>
                    <Typography>위치: {user.location}</Typography>
                  </div>
                </div>
                <Divider />
                <div className={styles.reportSection}>
                  <div className={styles.sectionLabel}>수의사의견</div>
                  <div className={styles.sectionContent}>
                    <Typography> 병명 : {record.diseaseName}</Typography>
                    <Typography>{record.description}</Typography>
                  </div>
                </div>
                <Divider />
                <div className={styles.reportSection}>
                  <div className={styles.sectionLabel}>발행기관</div>
                  <div className={styles.sectionContent}>
                    <Typography>기관: 한국동물병원</Typography>
                    <Typography>담당 의사: {record.doctor}</Typography>
                  </div>
                </div>
                <Divider />
                <div className={styles.reportSection}>
                  <div className={styles.sectionLabel}>진단 날짜</div>
                  <div className={styles.sectionContent}>
                    <Typography>진단 날짜: {record.date ? new Date(record.date).toLocaleDateString() : new Date().toLocaleDateString() }</Typography>
                  </div>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownloadReport(index)}
                className={styles.downloadButton}
              >
                진단기록 다운로드
              </Button>
            </div>
          ))}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.history.back()}
            className={styles.backButton}
          >
            돌아가기
          </Button>
        </div>
      )}
    </div>
  );
}
