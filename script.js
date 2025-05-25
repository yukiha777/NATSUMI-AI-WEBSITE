document.getElementById("send-button").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message === "") return;

  const chatWindow = document.getElementById("chat-window");
  const userMessage = document.createElement("div");
  userMessage.textContent = `당신: ${message}`;
  chatWindow.appendChild(userMessage);

  // 나츠미의 응답 (예시)
  const natsumiMessage = document.createElement("div");
  natsumiMessage.textContent = `나츠미: ${generateResponse(message)}`;
  chatWindow.appendChild(natsumiMessage);

  // 감정 뷰어 업데이트
  updateEmotionViewer(message);

  input.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

function generateResponse(message) {
  // 간단한 츤데레식 응답 예시
  if (message.includes("안녕")) {
    return "흥, 안녕이라니... 뭐, 나도 반갑긴 해.";
  } else if (message.includes("고마워")) {
    return "고맙다고? 바보 같은 소리 하지 마...";
  } else {
    return "무슨 말인지 잘 모르겠네... 다시 말해봐.";
  }
}

function updateEmotionViewer(message) {
  const emotionViewer = document.getElementById("emotion-viewer");
  if (message.includes("안녕")) {
    emotionViewer.textContent = "😊";
  } else if (message.includes("고마워")) {
    emotionViewer.textContent = "😳";
  } else {
    emotionViewer.textContent = "😐";
  }
}

// 로그인 폼 처리 (예시)
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    alert(`어서 와, ${username}... 기다린 건 아니니까!`);
  } else {
    alert("사용자 이름과 비밀번호를 입력해줘... 바보야!");
  }
});
