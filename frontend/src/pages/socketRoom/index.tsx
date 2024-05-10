import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { socket } from 'utils/ts/socket';
import styles from './socketRoom.module.scss';
import { getCookie } from 'utils/ts/cookie';

export default function SocketRoom() {
  const roomId = getCookie('id') || '1';
  const userId = sessionStorage.getItem('userId') || Math.random().toString(36).substring(7);
  sessionStorage.setItem('userId', userId);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const myStream = useRef<MediaStream>();

  useEffect(() => {
    console.log(`Connecting to room ${roomId} as user ${userId}`);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      myStream.current = stream;

      socket.emit('join-room', { roomId, userId });

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

      socket.on('other-user', (otherUserId: string) => {
        console.log(`Found other user: ${otherUserId}`);
        callUser(otherUserId);
      });

      socket.on('user-joined', (payload: { signal: any; callerId: string }) => {
        console.log(`User joined: ${payload.callerId}`);
        const newPeer = addPeer(payload.signal, payload.callerId, stream);
        setPeer(newPeer);
      });

      socket.on('receiving-returned-signal', (payload: { signal: any }) => {
        console.log('Receiving returned signal');
        peer?.signal(payload.signal);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [peer]);

  function callUser(otherUserId: string) {
    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: myStream.current!,
    });

    newPeer.on('signal', (signal: any) => {
      console.log('Sending signal');
      socket.emit('sending-signal', { userToSignal: otherUserId, callerId: socket.id, signal });
    });

    newPeer.on('stream', (stream: MediaStream) => {
      console.log('Received stream');
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = stream;
      }
    });

    newPeer.on('error', (err) => console.error('Peer error:', err));

    setPeer(newPeer);
  }

  function addPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    newPeer.on('signal', (signal: any) => {
      console.log('Returning signal');
      socket.emit('returning-signal', { signal, callerId });
    });

    newPeer.on('stream', (stream: MediaStream) => {
      console.log('Received stream');
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = stream;
      }
    });

    newPeer.on('error', (err) => console.error('Peer error:', err));

    newPeer.signal(incomingSignal);

    return newPeer;
  }

  return (
    <div className={styles.template}>
      <video playsInline muted ref={userVideoRef} autoPlay style={{ width: '300px' }} />
      <video playsInline ref={partnerVideoRef} autoPlay style={{ width: '300px' }} />
    </div>
  );
}
