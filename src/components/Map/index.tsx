import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const mapContainer = React.useRef(null);
  const { kakao } = window;
  const position = new kakao.maps.LatLng(33.450701, 126.570667);
  const mapOptions = {
    center: position, // 지도의 중심좌표
    level: 4 // 지도의 확대 레벨
  };

  useEffect(() => {
    const map = new kakao.maps.Map(mapContainer.current, mapOptions);
    const marker = new kakao.maps.Marker({ position }); // 마커 생성
    
    // 커스텀 오버레이에 표출될 내용
    const content = `
        <div class="customoverlay">
          <span>포썸</span>
        </div>`;
  
    // 커스텀 오버레이 생성
    new kakao.maps.CustomOverlay({
      map,
      position,
      content
    });
  
    // 마커가 지도 위에 표시되도록 설정
    marker.setMap(map);
  
  }, []);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: '100%', height: '350px', display: 'block' }}
    ></div>
  );
};

export default Map;