// data.js

// 키워드와 설명을 저장할 객체
let keywords = {};

// JSON 파일에서 키워드 데이터 로드 함수
async function loadKeywords() {
    try {
        // fetch를 사용하여 JSON 파일 비동기 요청
        const response = await fetch('data/keywords.json');
        // 응답을 JSON 형식으로 파싱
        keywords = await response.json();
    } catch (error) {
        // 오류 발생 시 콘솔에 오류 메시지 출력
        console.error('키워드 로드 실패:', error);
    }
}

// 이미 사용된 키워드를 제외하고 랜덤 키워드 선택 함수
function getRandomKeywordExcluding(excludedKeywords) {
    // 객체의 모든 키(키워드)를 배열로 변환
    const keys = Object.keys(keywords).filter(key => !excludedKeywords.includes(key));

    if (keys.length === 0) {
        return null;  // 모든 키워드를 사용한 경우 null 반환
    }

    // 무작위 인덱스 선택
    const randomIndex = Math.floor(Math.random() * keys.length);
    // 선택된 인덱스의 키(키워드) 가져오기
    const randomKey = keys[randomIndex];
    // 선택된 키워드와 해당 설명을 객체로 반환
    return {
        keyword: randomKey,
        description: keywords[randomKey]
    };
}

// 다른 모듈에서 사용할 수 있도록 함수들 내보내기
export { loadKeywords, getRandomKeywordExcluding };
