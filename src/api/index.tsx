import axios from 'axios';

// 화살표 함수로 API 호출을 위한 함수를 정의합니다.
export const getShelterInfo = async () => {
  const url = 'http://apis.data.go.kr/1543061/animalShelterSrvc/shelterInfo';
  const params = {
    numOfRows: '10',
    pageNo: '1',
    serviceKey: `${process.env.REACT_APP_API_KEY}`,
    _type: 'json'
  };

  try {
    // axios를 사용하여 GET 요청을 보내고 응답을 변수에 저장합니다.
    const response = await axios.get(url, { params });

    // 응답 데이터를 콘솔에 출력합니다.
    console.log(response.data);

    // 필요한 경우 응답 데이터를 반환합니다.
    return response.data;
  } catch (error) {
    // 오류가 발생한 경우 콘솔에 오류를 출력합니다.
    console.error(error);
  }
};
