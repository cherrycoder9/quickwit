// app.js

import { loadKeywords, getRandomKeywordExcluding } from './data.js';

let currentKeyword = null;
let hintTimer = null;
let hintDisplayTimer = null;
let usedKeywords = [];  // 이미 사용된 키워드를 저장할 배열
let inputStarted = false;  // 입력이 시작되었는지 여부를 저장하는 변수

// DOM 로드 완료 후 실행되는 이벤트 리스너
document.addEventListener('DOMContentLoaded', async () => {
    await loadKeywords();  // 키워드 로드
    setupEventListeners();  // 이벤트 리스너 설정
});

// 이벤트 리스너 설정 함수
function setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', startGame);  // 시작 버튼 클릭 시 게임 시작
    document.getElementById('submit-button').addEventListener('click', checkAnswer);  // 제출 버튼 클릭 시 답변 확인
    document.getElementById('answer-input').addEventListener('input', () => {
        inputStarted = true;
        resetHintTimer();  // 입력 중에는 힌트 타이머 초기화
    });
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();  // 엔터키 입력 시 답변 확인
    });
}

// 게임 시작 함수
function startGame() {
    currentKeyword = getRandomKeywordExcluding(usedKeywords);  // 이미 사용된 키워드를 제외한 랜덤 키워드 선택
    if (!currentKeyword) {
        alert('모든 키워드를 사용했습니다! 게임을 다시 시작합니다.');
        usedKeywords = [];  // 사용된 키워드 목록 초기화
        currentKeyword = getRandomKeywordExcluding(usedKeywords);  // 다시 랜덤 키워드 선택
    }
    usedKeywords.push(currentKeyword.keyword);  // 현재 키워드를 사용된 목록에 추가
    document.getElementById('keyword-display').textContent = currentKeyword.keyword;  // 키워드 표시
    document.getElementById('answer-input').value = '';  // 입력 필드 초기화
    document.getElementById('answer-input').focus();  // 입력 필드에 포커스 설정
    inputStarted = false;  // 입력 시작 여부 초기화
    startHintTimer();  // 힌트 타이머 시작
    document.getElementById('game-area').style.display = 'block';  // 게임 영역 표시
    document.getElementById('start-button').style.display = 'none';  // 시작 버튼 숨기기
}

// 답변 확인 함수
function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim();  // 사용자 입력 값 가져오기
    const similarity = calculateSimilarity(userAnswer, currentKeyword.description);  // 유사도 계산

    if (similarity > 0.85) {  // 유사도가 85% 초과인 경우
        alert('정답입니다!');
        updateScore(true);  // 점수 업데이트 (정답)
        startGame();  // 다음 문제로 넘어가기
    } else {
        alert('틀렸습니다. 다시 시도해보세요.');
        showHint();  // 힌트 표시
        updateScore(false);  // 점수 업데이트 (오답)
    }
}

// 점수 업데이트 함수
function updateScore(isCorrect) {
    const correctCount = document.getElementById('correct-count');  // 정답 카운트 엘리먼트
    const totalCount = document.getElementById('total-count');  // 전체 카운트 엘리먼트

    if (isCorrect) {
        correctCount.textContent = parseInt(correctCount.textContent) + 1;  // 정답 카운트 증가
    }
    totalCount.textContent = parseInt(totalCount.textContent) + 1;  // 전체 카운트 증가
}

// 문자열 유사도 계산 함수
function calculateSimilarity(str1, str2) {
    // 문자열을 소문자로 변환하고 공백을 기준으로 단어 배열로 분리
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');

    // 두 배열에서 공통된 단어의 수 계산
    const commonWords = words1.filter(word => words2.includes(word));

    // 유사도 계산: 공통 단어 수 / 더 긴 배열의 길이
    return commonWords.length / Math.max(words1.length, words2.length);
}

// 힌트 타이머 시작 함수
function startHintTimer() {
    clearTimeout(hintTimer);  // 기존 힌트 타이머 초기화
    hintTimer = setTimeout(() => {
        if (!inputStarted) {  // 입력이 시작되지 않았을 때만 힌트 표시
            showHint();
        }
    }, 3000);  // 3초 후 힌트 표시
}

// 힌트 타이머 초기화 함수
function resetHintTimer() {
    clearTimeout(hintTimer);  // 기존 힌트 타이머 초기화
}

// 힌트 표시 함수
function showHint() {
    const hintDisplay = document.getElementById('hint-display');  // 힌트 표시 엘리먼트
    hintDisplay.textContent = currentKeyword.description;  // 전체 정답 문장 표시
    hintDisplay.classList.add('show');  // 힌트 표시

    clearTimeout(hintDisplayTimer);  // 기존 힌트 표시 타이머 초기화
    hintDisplayTimer = setTimeout(() => {
        hintDisplay.classList.remove('show');  // 3초 후 힌트 숨기기
        hintDisplay.textContent = '';  // 힌트 내용 초기화
    }, 3000);
}
