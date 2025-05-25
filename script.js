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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "회원가입 실패");
    }

    alert("회원가입 완료… 너랑 같이 해줄게, 특별히!");
    window.location.href = "index.html"; // 로그인 페이지로 이동
  } catch (err) {
    alert("에휴… 잘 좀 하지 그래? 회원가입 실패야.");
    console.error(err);
  }
}

// =====================[ 채팅 및 이미지 생성 기능 ]=====================
async function sendMessageToAI(message, mode = "chat") {
  try {
    const url = mode === "chat" ? `${API_BASE}/chat` : `${API_BASE}/image`;
    // 백엔드에 맞춰 프롬프트 키로 변경
    const bodyPayload = mode === "chat" ? { message } : { prompt: message };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "AI 응답 실패");
    }

    const data = await response.json();

    if (mode === "chat") {
      displayChatMessage("나츠미", data.reply || "…응답이 없어. 삐졌어?");
    } else {
      if (data.image_url) {
        displayChatImage(data.image_url);
      } else {
        displayChatMessage("나츠미", "이미지 생성 실패했어. 바보...");
      }
    }
  } catch (err) {
    console.error(err);
    displayChatMessage("나츠미", "에이, 서버 또 삐졌잖아!");
  }
}

function displayChatMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = sender === "나" ? "my-message" : "natsumi-message";
  msg.textContent = `${sender}: ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayChatImage(imageUrl) {
  const chatBox = document.getElementById("chat-box");
  const imgWrapper = document.createElement("div");
  imgWrapper.className = "natsumi-message";
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Generated Image";
  img.style.maxWidth = "300px";
  img.style.borderRadius = "8px";
  imgWrapper.appendChild(img);
  chatBox.appendChild(imgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =====================[ 이벤트 핸들러 등록 ]=====================
document.addEventListener("DOMContentLoaded", () => {
  // 로그인 폼
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      loginUser(username, password);
    });
  }

  // 회원가입 폼
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      registerUser(username, password);
    });
  }

  // 채팅/이미지 생성 폼
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const message = input.value.trim();
      if (!message) return;

      const modeSelect = document.getElementById("mode-select");
      const mode = modeSelect ? modeSelect.value : "chat";

      displayChatMessage("나", message);
      sendMessageToAI(message, mode);

      input.value = "";
    });
  }

  // 로그아웃 버튼 (chat.html에 있어야 동작)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("그래, 꺼져…!");
      window.location.href = "index.html";
    });
  }
});