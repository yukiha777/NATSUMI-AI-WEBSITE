const API_BASE = "https://natsumi-mi-shu.onrender.com";
let authToken = localStorage.getItem("token") || null;

// 로그인 함수
async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("로그인 실패");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    authToken = data.token;
    alert("로그인 성공! 츤츤... 어쩜 이렇게 잘했냐.");

    window.location.href = "chat.html";
  } catch (err) {
    alert("아이디나 비밀번호 틀렸잖아, 바보...");
    console.error(err);
  }
}

// 회원가입 함수
async function registerUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("회원가입 실패");

    alert("회원가입 완료… 너랑 같이 해줄게, 특별히!");
    window.location.href = "login.html";
  } catch (err) {
    alert("에휴… 회원가입 실패야. 제대로 해봐, 바보야!");
    console.error(err);
  }
}

// AI 채팅 보내기
async function sendMessageToAI(message) {
  if (!authToken) {
    alert("로그인 먼저 해, 바보야!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("AI 응답 실패");

    const data = await res.json();
    displayChatMessage("나츠미", data.reply || "…응답이 없어. 삐졌어?");
  } catch (err) {
    console.error(err);
    displayChatMessage("나츠미", "에이, 서버 또 삐졌잖아!");
  }
}

// 채팅 메시지 화면에 표시
function displayChatMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = sender === "나" ? "my-message" : "natsumi-message";
  msg.textContent = `${sender}: ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 감정 상태 조회
async function fetchEmotion() {
  if (!authToken) {
    alert("로그인 먼저 해, 바보야!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/emotion`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) throw new Error("감정 조회 실패");

    const data = await res.json();
    document.getElementById("emotion-status").textContent = `나츠미 기분: ${data.emotion} 😤`;
  } catch (err) {
    console.error(err);
    document.getElementById("emotion-status").textContent = "나츠미 기분: 모르겠어… 바보야...";
  }
}

// 이모지 생성
async function generateEmoji(emotion) {
  if (!authToken) {
    alert("로그인 먼저 해, 바보야!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/emoji`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ emotion }),
    });

    if (!res.ok) throw new Error("이모지 생성 실패");

    const data = await res.json();
    document.getElementById("emoji-result").textContent = data.emoji || "…응? 이모지 안 나왔는데?";
  } catch (err) {
    console.error(err);
    document.getElementById("emoji-result").textContent = "흐응… 이모지 못 만들었어.";
  }
}

// 로그아웃 함수
function logoutUser() {
  localStorage.removeItem("token");
  authToken = null;
  alert("다시 로그인해, 바보야!");
  window.location.href = "login.html";
}

// 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
  // 로그인 폼 핸들러
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      if (!email || !password) {
        alert("이메일하고 비밀번호 다 넣어라, 바보야!");
        return;
      }
      loginUser(email, password);
    });
  }

  // 회원가입 폼 핸들러
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      if (!email || !password) {
        alert("이메일하고 비밀번호 다 넣어라, 바보야!");
        return;
      }
      registerUser(email, password);
    });
  }

  // 채팅 폼 핸들러
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

  // 이모지 생성 폼 핸들러
  const emojiForm = document.getElementById("emoji-form");
  if (emojiForm) {
    emojiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emotion = document.getElementById("emoji-input").value.trim();
      if (!emotion) {
        alert("이모지 감정 입력 좀 해, 바보야!");
        return;
      }
      generateEmoji(emotion);
    });
  }

  // 로그아웃 버튼 (있으면)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});