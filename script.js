// 채팅 전송 버튼
document.getElementById("send-button").addEventListener("click", async () => {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message === "") return;

  const chatWindow = document.getElementById("chat-window");

  // 사용자 메시지 표시
  const userMessage = document.createElement("div");
  userMessage.textContent = `너: ${message}`;
  chatWindow.appendChild(userMessage);

  // 백엔드에 메시지 전송
  const reply = await generateResponse(message);

  // 나츠미의 응답 표시
  const natsumiMessage = document.createElement("div");
  natsumiMessage.textContent = `나츠미: ${reply}`;
  chatWindow.appendChild(natsumiMessage);

  // 감정 업데이트
  updateEmotionViewer(reply);

  input.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// 나츠미 응답 생성 (백엔드 호출)
async function generateResponse(message) {
  try {
    const response = await fetch('https://natsumi-mi-shu.onrender.com/natsumi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.reply || "응? 그게 무슨 말이야, 바보야...";
  } catch (error) {
    console.error('응답 오류:', error);
    return "지금은 말 걸지 마... 나츠미 바쁘단 말야!";
  }
}

// 감정 이모지 업데이트
function updateEmotionViewer(message) {
  const emotionViewer = document.getElementById("emotion-viewer");
  if (message.includes("기뻐") || message.includes("좋아")) {
    emotionViewer.textContent = "😊";
  } else if (message.includes("고마워") || message.includes("감사")) {
    emotionViewer.textContent = "😳";
  } else if (message.includes("화나") || message.includes("짜증")) {
    emotionViewer.textContent = "😠";
  } else {
    emotionViewer.textContent = "😐";
  }
}

// 로그인 처리
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch('https://natsumi-mi-shu.onrender.com/natsumi/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      alert(`어... 어서 와, ${username}. 기다린 건 아니니까!!`);
    } else {
      alert("틀렸잖아… 바보야.");
    }
  } catch (err) {
    console.error('로그인 실패:', err);
    alert("으… 나츠미가 서버랑 연결이 안 돼… 네 탓은 아니야... 아마.");
  }
});
