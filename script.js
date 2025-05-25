const apiUrl = "https://natsumi-mi-shu.onrender.com/natsumi";

// --- 로그인 ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const chatForm = document.getElementById("chat-form");
  const emojiButton = document.getElementById("emoji-button");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // 더미 인증 예시
      const user = JSON.parse(localStorage.getItem(email));
      if (user && user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "chat.html";
      } else {
        alert("이메일이나 비밀번호가 틀렸어… 확인해봐, 바보야!");
      }
    });
  }

  // --- 회원가입 ---
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const user = { username, email, password };
      localStorage.setItem(email, JSON.stringify(user));
      alert("가입 완료야…! 이제 로그인 해보라구~");
      window.location.href = "index.html";
    });
  }

  // --- 채팅 기능 ---
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("user-message");
      const message = input.value.trim();
      if (!message) return;

      addMessage("너", message);
      input.value = "";

      addMessage("나츠미", "잠깐만… 생각해볼게…");

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();

        document.getElementById("chat-box").lastChild.remove(); // thinking 제거
        addMessage("나츠미", data.response || "음… 잘 모르겠네, 바보야!");
        updateEmotion(data.emotion);
      } catch (err) {
        console.error(err);
        addMessage("나츠미", "으… 서버가 삐졌나봐… 다시 시도해줘.");
      }
    });
  }

  // --- 이모지 생성 ---
  if (emojiButton) {
    emojiButton.addEventListener("click", () => {
      const input = document.getElementById("user-message").value;
      const emojis = generateEmoji(input);
      document.getElementById("emoji-output").textContent = `이모지 추천: ${emojis}`;
    });
  }
});

// --- 채팅 메시지 추가 ---
function addMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// --- 감정 뷰어 업데이트 ---
function updateEmotion(emotion) {
  const view = document.getElementById("emotion-display");
  const emoMap = {
    happy: "기분 좋아~ 😏",
    sad: "조금… 슬퍼졌어… 🥺",
    angry: "화났거든!? 😡",
    confused: "응…? 무슨 말이야, 바보야? 😕",
    default: "잘 모르겠는 기분이야…"
  };
  view.textContent = emoMap[emotion] || emoMap["default"];
}

// --- 이모지 생성 함수 ---
function generateEmoji(text) {
  const love = ["😍", "🥰", "💜"];
  const angry = ["😡", "💢", "👿"];
  const sad = ["😢", "😭", "🥺"];
  const happy = ["😄", "😊", "✨"];
  const confused = ["😕", "🤨", "🌀"];

  text = text.toLowerCase();

  if (text.includes("좋아") || text.includes("사랑")) return pickEmoji(love);
  if (text.includes("화나") || text.includes("짜증")) return pickEmoji(angry);
  if (text.includes("슬퍼") || text.includes("눈물")) return pickEmoji(sad);
  if (text.includes("행복") || text.includes("기뻐")) return pickEmoji(happy);
  if (text.includes("왜") || text.includes("모르")) return pickEmoji(confused);

  return "🤔";
}

function pickEmoji(list) {
  return list[Math.floor(Math.random() * list.length)];
}