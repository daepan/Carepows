import React, { useEffect, useRef } from "react";
import { useGeoLocation } from "../../utils/hooks/useGeoLocation";

declare global {
  interface Window {
    kakao: any;
  }
}

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
};

interface Place {
  y: string;
  x: string;
  place_name: string;
}


const Map = () => {
  const { location } = useGeoLocation(geolocationOptions);
  const mapContainer = useRef<HTMLDivElement>(null);
  const { kakao } = window;

  const displayMarker = (map: any, place: Place) => {
    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
    });
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`, // 장소명이 표출될 인포윈도우
    });

    kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });
  };

  useEffect(() => {
    if (!mapContainer.current || !kakao) return;

    const position = new kakao.maps.LatLng(
      location.latitude,
      location.longitude
    );
    const mapOptions = {
      center: position,
      level: 4,
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOptions);
    const content = `
      <div class="customoverlay"><span>내 위치</span></div>
    `

    if (kakao.maps.services) {
      console.log(kakao.maps.services);
      const ps = new kakao.maps.services.Places();
      
      const options = {
        location: new kakao.maps.LatLng(location.latitude, location.longitude),
        radius: 10000,
        sort: kakao.maps.services.SortBy.DISTANCE,
      };
      
      ps.keywordSearch("동물병원", (data: Place[], status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          let bounds = new kakao.maps.LatLngBounds();
          console.log(bounds);
          data.forEach((place) => {
            displayMarker(map, place);
            bounds.extend(
              new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x))
            );
          });
          map.setBounds(bounds);
        }
      }, options);
    }

    new kakao.maps.Marker({
      map,
      position,
      content,
    });
  }, [location, kakao]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "350px" }}
    ></div>
  );
};

export default Map;
