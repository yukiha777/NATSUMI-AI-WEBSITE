// =====================[ 기본 설정 ]=====================
const API_BASE = "https://natsumi-mi-shu.onrender.com/natsumi";
let authToken = localStorage.getItem("token") || null;

// =====================[ 로그인 기능 ]=====================
async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("로그인 실패");

    const data = await response.json();
    localStorage.setItem("token", data.token);
    authToken = data.token;
    alert("로그인 성공! 츤츤… 그래도 반가워…");

    window.location.href = "chat.html";
  } catch (err) {
    alert("아이디나 비밀번호 틀렸잖아, 바보...");
    console.error(err);
  }
}

// =====================[ 회원가입 기능 ]=====================
async function registerUser(username, password) {
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("회원가입 실패");

    alert("회원가입 완료… 너랑 같이 해줄게, 특별히!");
    window.location.href = "login.html";
  } catch (err) {
    alert("에휴… 잘 좀 하지 그래? 회원가입 실패야.");
    console.error(err);
  }
}

// =====================[ 채팅 기능 ]=====================
async function sendMessageToAI(message) {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("AI 응답 실패");

    const data = await response.json();
    displayChatMessage("나츠미", data.reply || "…응답이 없어. 삐졌어?");
  } catch (err) {
    console.error(err);
    displayChatMessage("나츠미", "에이, 서버 또 삐졌잖아!");
  }
}

function displayChatMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  const msg = document.createElement("div");
  msg.className = sender === "나" ? "my-message" : "natsumi-message";
  msg.textContent = `${sender}: ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =====================[ 감정 뷰어 ]=====================
async function fetchEmotion() {
  try {
    const response = await fetch(`${API_BASE}/emotion`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) throw new Error("감정 정보 가져오기 실패");

    const data = await response.json();
    document.getElementById("emotion-status").textContent = `나츠미 기분: ${data.emotion} 😤`;
  } catch (err) {
    console.error(err);
    document.getElementById("emotion-status").textContent = "나츠미 기분: 모르겠어… 바보…";
  }
}

// =====================[ 이모지 생성 ]=====================
async function generateEmoji(emotion) {
  try {
    const response = await fetch(`${API_BASE}/emoji`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ emotion }),
    });

    if (!response.ok) throw new Error("이모지 생성 실패");

    const data = await response.json();
    document.getElementById("emoji-result").textContent = data.emoji || "…응? 이모지 안 나왔는데?";
  } catch (err) {
    console.error(err);
    document.getElementById("emoji-result").textContent = "흐응… 이모지 못 만들었어.";
  }
}

// =====================[ 이벤트 핸들러 등록 ]=====================
document.addEventListener("DOMContentLoaded", () => {
  // 로그인 폼
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.querySelector("#email").value.trim();
      const password = loginForm.querySelector("#password").value.trim();
      loginUser(username, password);
    });
  }

  // 회원가입 폼
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = signupForm.querySelector("#email").value.trim();
      const password = signupForm.querySelector("#password").value.trim();
      registerUser(username, password);
    });
  }

  // 채팅 폼
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const message = input.value.trim();
      if (!message) return;
      displayChatMessage("나", message);
      sendMessageToAI(message);
      input.value = "";
    });
  }

  // 감정 보기 버튼
  const emotionBtn = document.getElementById("check-emotion");
  if (emotionBtn) {
    emotionBtn.addEventListener("click", fetchEmotion);
  }

  // 이모지 생성 폼
  const emojiForm = document.getElementById("emoji-form");
  if (emojiForm) {
    emojiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emotion = document.getElementById("emoji-input").value.trim();
      if (!emotion) return;
      generateEmoji(emotion);
    });
  }
});