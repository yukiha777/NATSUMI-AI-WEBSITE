const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const chatForm = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const emotionDisplay = document.getElementById("emotion-display");
const emojiButton = document.getElementById("emoji-button");
const emojiOutput = document.getElementById("emoji-output");

const API_URL = "https://natsumi-mi-shu.onrender.com/natsumi";

// 📝 회원가입 처리
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await res.json();

      if (res.ok) {
        alert("회원가입 성공~ 이제 로그인하라구…! 바보야!");
        window.location.href = "login.html";
      } else {
        alert("회원가입 실패: " + (result.message || "몰라! 다시 해봐!!"));
      }
    } catch (err) {
      alert("서버가 삐졌나봐… 연결 안 돼 😤");
    }
  });
}

// 🔐 로그인 처리
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        alert("로그인 성공! 뭐, 칭찬은 못 해주지만… 흐응");
        window.location.href = "chat.html";
      } else {
        alert("로그인 실패: " + (result.message || "다시 확인하라구!"));
      }
    } catch (err) {
      alert("서버가 응답 안 해! 분명 자고 있는 거야…");
    }
  });
}

// 💬 채팅 기능
if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = document.getElementById("user-message").value.trim();
    if (!userMessage) return;

    displayMessage("너", userMessage);
    document.getElementById("user-message").value = "";

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const result = await res.json();

      if (res.ok && result.reply) {
        displayMessage("나츠미", result.reply);
        updateEmotion(result.emotion || "무표정");
      } else {
        displayMessage("나츠미", "응...? 다시 말해봐, 바보야.");
      }
    } catch (err) {
      displayMessage("나츠미", "서버가 삐진 것 같아... 그런가 봐.");
    }
  });
}

// 🤖 메시지 출력
function displayMessage(sender, message) {
  const msgElem = document.createElement("div");
  msgElem.className = "message";
  msgElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 😡 감정 업데이트
function updateEmotion(emotion) {
  if (emotionDisplay) {
    emotionDisplay.textContent = `지금 기분은… ${emotion}이야… 뭐, 그냥 그렇다고!`;
  }
}

// 🥴 이모지 생성기
if (emojiButton) {
  emojiButton.addEventListener("click", async () => {
    const userMessage = document.getElementById("user-message").value.trim();
    if (!userMessage) {
      alert("무언가 입력하라고, 바보야!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/emoji`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const result = await res.json();

      if (res.ok && result.emoji) {
        emojiOutput.textContent = `이모지 느낌은… ${result.emoji}`;
      } else {
        emojiOutput.textContent = "이모지 못 만들었어… 너 때문이야! (아마)";
      }
    } catch (err) {
      emojiOutput.textContent = "이모지 만들기 실패… 흐응, 다음엔 제대로 하라구.";
    }
  });
}