import React, { useEffect, useRef, useState } from "react";
import { getCookie } from "utils/ts/cookie";
import { io, Socket } from "socket.io-client";
import { Button, Typography, TextField } from "@mui/material";
import { useAuth } from "components/context/AuthContext";
import styles from './socketRoom.module.scss';

const iceServers = [
  {
    urls: "stun:stun.l.google.com:19302"
  },
  {
    urls: "turn:13.125.108.54",
    username: "daekwan",
    credential: "1234"
  }
];

const VideoCall = () => {
  const roomName = "1";
  const socketRef = useRef<Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [peerUserId, setPeerUserId] = useState<string | null>(null); // 상대방 ID 상태 추가
  const { userId, userType } = useAuth();

  console.log("UserId from useAuth:", userId);
  console.log("UserType from useAuth:", userType);

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("로컬 스트림:", stream);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      if (!pcRef.current) return;

      stream.getTracks().forEach((track) => {
        if (pcRef.current) {
          console.log(pcRef.current);
          pcRef.current.addTrack(track, stream);
        } else {
          console.log("몬가 안댐");
          console.log(track);
        }
      });

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate && socketRef.current) {
          console.log("ICE 후보 수신:", e.candidate);
          socketRef.current.emit("send_ice", e.candidate, roomName);
        }
      };

      pcRef.current.ontrack = (e) => {
        console.log("원격 트랙 수신:", e.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
          setLoading(false);
          setConnected(true);
        }
      };
    } catch (e) {
      console.error("미디어를 가져오는 중 오류 발생:", e);
    }
  };

  const createOffer = async () => {
    if (!pcRef.current || !socketRef.current) return;
    try {
      const sdp = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(sdp);
      console.log("오퍼 전송:", sdp);
      socketRef.current.emit("send_offer", sdp, roomName);
    } catch (e) {
      console.error("오퍼 생성 중 오류 발생:", e);
    }
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    if (!pcRef.current || !socketRef.current) return;
    try {
      await pcRef.current.setRemoteDescription(sdp);
      const answerSdp = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answerSdp);
      console.log("응답 전송:", answerSdp);
      socketRef.current.emit("send_answer", answerSdp, roomName);
    } catch (e) {
      console.error("응답 생성 중 오류 발생:", e);
    }
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log("소켓 연결 해제");
    }
    if (pcRef.current) {
      pcRef.current.close();
      console.log("피어 연결 해제");
    }
    setConnected(false);
  };

  const handleDiagnosisSubmit = () => {
    console.log("진단 기록 제출 시도");
    console.log("UserId:", userId);
    console.log("UserType:", userType);
    console.log("Diagnosis:", diagnosis);
    console.log("DiseaseName:", diseaseName);
    const nowDate = new Date();
    if (userType === "doctor" && peerUserId && diagnosis && diseaseName) {
      const diagnosisData = {
        userId: peerUserId, // 상대방의 ID 사용
        diagnosis: {
          diseaseName,
          description: diagnosis,
          doctor: getCookie('name'),
          date: nowDate,
        }
      };
      console.log("진단 데이터:", diagnosisData);
      socketRef.current?.emit("add_diagnosis", diagnosisData, (response: any) => {
        console.log("서버 응답:", response);
        if (response.success) {
          console.log("진단 기록 추가 성공");
          setDiagnosis("");
          setDiseaseName("");
        } else {
          console.error("진단 기록 추가 실패:", response.message);
        }
      });
    } else {
      console.error("진단 기록 추가 실패: 의사만 진단 기록을 추가할 수 있으며, 모든 필드를 채워야 합니다.");
    }
  };

  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_SOCKET_BASE_URL}`, {
      path: "/socket.io",
      transports: ['websocket'],
    });
    console.log("소켓 연결 시도");

    pcRef.current = new RTCPeerConnection({ iceServers });

    socketRef.current.on("welcome", (peerId: string) => {
      console.log("상대방이 방에 입장했습니다:", peerId);
      setPeerUserId(peerId); // 상대방 ID 저장
      createOffer();
    });

    socketRef.current.on("receive_offer", (sdp: RTCSessionDescription) => {
      console.log("오퍼 수신:", sdp);
      createAnswer(sdp);
    });

    socketRef.current.on("receive_answer", async (sdp: RTCSessionDescription) => {
      console.log("응답 수신:", sdp);
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(sdp);
      }
    });

    socketRef.current.on("receive_ice", async (candidate: RTCIceCandidate) => {
      if (pcRef.current) {
        console.log("ICE 후보 수신:", candidate);
        await pcRef.current.addIceCandidate(candidate);
      }
    });

    socketRef.current.emit("enter_room", roomName, userId, () => {
      console.log("방에 입장:", roomName);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("연결 오류:", err.message);
    });

    getMedia();

    return () => {
      handleDisconnect();
    };
  }, [userId]);

  return (
    <div className={styles.template}>
      <div className={styles.template__video}>
        <div className={styles.template__remote}>
          <div className={styles.template__title}>
            {userType === "doctor" ? '진료 대상자 화면' : '수의사 화면'}
          </div>
          {loading && <Typography className={styles.loadingText}>로딩 중...</Typography>}
          {!connected && !loading && <Typography className={styles.noSignalText}>신호 없음</Typography>}
          <video
            id="remoteVideo"
            className={styles.remoteVideo}
            ref={remoteVideoRef}
            autoPlay
          />
        </div>
        <div className={styles.template__my}>
          <div>
            <div className={styles.template__title}>본인 화면</div>
            <video
              id="myVideo"
              className={styles.myVideo}
              ref={myVideoRef}
              autoPlay
              muted
            />
          </div>
        </div>
      </div>
      {userType === "doctor" && (
        <div className={styles.diagnosisForm}>
          <Typography variant="h6">진단 기록 추가</Typography>
          <TextField
            label="병명"
            value={diseaseName}
            onChange={(e) => setDiseaseName(e.target.value)}
            fullWidth
          />
          <TextField
            label="진단 내용"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            fullWidth
            multiline
            rows={4}
            style={{ marginTop: 10 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDiagnosisSubmit}
            className={styles.submitButton}
            style={{ marginTop: 10 }}
          >
            진단 기록 추가
          </Button>
        </div>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDisconnect}
        className={styles.disconnectButton}
      >
        연결 종료
      </Button>
    </div>
  );
};

export default VideoCall;
