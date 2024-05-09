import React from 'react';
import { socket } from 'utils/ts/socket';
import Peer from 'simple-peer';
import styles from './socketRoom.module.scss';
import { getCookie } from 'utils/ts/cookie';

export default function SocketRoom() {
  const roomId = getCookie('id') || '1';
  const [peer, setPeer] = React.useState<Peer.Instance | null>(null);
  const userVideoRef = React.useRef<HTMLVideoElement>(null);
  const partnerVideoRef = React.useRef<HTMLVideoElement>(null);
  const myStream = React.useRef<MediaStream>();

  React.useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          if (userVideoRef.current) {
              userVideoRef.current.srcObject = stream;
          }
          myStream.current = stream;

          socket.emit('join-room', roomId);

          socket.on('other-user', (otherUserId: string) => {
              callUser(otherUserId);
          });

          socket.on('user-joined', (payload: { signal: any; callerId: string }) => {
              const peer = addPeer(payload.signal, payload.callerId, stream);
              setPeer(peer);
          });

          socket.on('receiving-returned-signal', (payload: { signal: any }) => {
              peer?.signal(payload.signal);
          });
      });

      return () => {
          socket.disconnect();
      };
  }, [peer, roomId]);

  function callUser(otherUserId: string) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: myStream.current!,
      });

      peer.on('signal', (signal: any) => {
          socket.emit('sending-signal', { userToSignal: otherUserId, callerId: socket.id, signal });
      });

      peer.on('stream', (stream: MediaProvider | null) => {
          if (partnerVideoRef.current) {
              partnerVideoRef.current.srcObject = stream;
          }
      });

      setPeer(peer);
  }

  function addPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      });

      peer.on('signal', (signal: any) => {
          socket.emit('returning-signal', { signal, callerId });
      });

      peer.on('stream', (stream: MediaProvider | null) => {
          if (partnerVideoRef.current) {
              partnerVideoRef.current.srcObject = stream;
          }
      });

      peer.signal(incomingSignal);

      return peer;
  }
  return (
    <div className={styles.template}>
      <video playsInline muted ref={userVideoRef} autoPlay style={{ width: '300px' }} />
      <video playsInline ref={partnerVideoRef} autoPlay style={{ width: '300px' }} />
    </div>
  )
}