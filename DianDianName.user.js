// ==UserScript==
// @name         点点数据_取名字
// @description  Render a chat window with AI chat functionality
// @author       DethanZ
// @version      2025-03-04
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace    https://greasyfork.org/zh-CN/scripts/526647
// @supportURL   https://github.com/dethanzhang/UserScript
// @homepageURL  https://github.com/dethanzhang/UserScript
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAE0klEQVRoBeXBPWjcZgCA4VefdGdHtppQixYfqJAhd0uXcEMhhpIETwZ5TJNs6eAbSungpgS6uNChNO7WDDGk2fKz2iVZjGsoXkqNl3a4yxCIQK7NXS6JfEp8sk7FgyEc+i4+6ZwE9DxKsxVFZJAgowQZJcgoQUYJMkqQUYKMEmSUIKMEGSXIKEFGaQzA39Vdfl/zed2oLrg8OUrBVDmwtOazXt1FZtzUMHSFopWjZOUxdIWjopGS2wipXG8QZ7MR8stXH7Jvac1n7vYz+lEu5bHP6NgTOoMmSKn2JOAwqk5Av9arbeZuP8O+tsXSms8gCVJyG3vIFK0cB2pOQFJuPWTu9jNmbzzFrYcMgiAltx4iUxhTOeD5EWmtbryiMl/HrYekJUip5gTIFEyVAzUnYBDcekhlvo7nR6QhOCIFU6Vo5dnn+R0Gya2HzN5okIbSbEURKbiNkKU1n27nTg9TtHIcWN14RdUJkPH8DjUnoOYEeH7EYcxdOYE9oZOE0mxFEe+ZpTWfhUUPtxHSi6ELln76GENX6JfgPWRP6Nz8zuTs6WF68fwOqxsvSUJptqKIhDw/4ubiC3b8Dq8b1QWV6Q8wdIW0Zm88ZXXjFTLlUp6Fqyb90kjh5uIL7i63iFOyctgTOmnNXTmBXd3C8yPirFfbeH6EoSv0Q5BCzQmQKZgqg2Dogplpg15qTpt+aaTg+REy42MacYbv3yK/8pB90cgo0cgo7XNTtM9PIWOf0VlY9PD8iDhVZ49yaYh+aKRQcwJkCqZKt/zKA4bv/UY37Z8NtH838L/+njiGLihaOdarbeJ4fod+CRJy6yEyRStHnNxffyKTX3nA8P1byBStHIMkSMht7CFj6ApxxPYmveRXHiJj6IJBEiRUcwJkilaOOOrjR/QitjdJwtAF/RIk5NZDZAqmRjexvcmbRCOjyNScNjKFMZV+CRLabOwhU7I0uont/3iT8OQpZGpP9pApWjn6JUjIrXeQGdVVuontTd6kfW6KODUnwG2ExCmYKgVTpV+ChDYbe8iULI1uYnuTXnbtC7TPTxHnzvIOMuXiEEkIEvD8Dp4fEacwphJHae0gs2tf4OWX3xDHbYQsrb1Exp44RhIaCVSdAJlxUyXOrn0B9fEjXheePEXw2efsfXoamcrPdWSKVo5yaYgkNBLY8SP61flonJ0ff6Uf8/ee4zZCZC5PjpCUIIGqEyBTc/YYhPl7z7m73ELm7Olh7AmdpAQJeH4HGc/vsF7dJSm3ETJzvc7d5RYyhq4w+8Vx0hAkYOiCXmZvNHHrIf3w/Iibix6Xf9hmvdqml8r0BxRMlTQ0EiiMqfTi+R3sa1vYZ45RLg0xbqp08/yIHb9D1QmoOQHr1TaHUZk2uDQ5QlpKsxVF9Mmth9jXtnjb7AmduSsnGARBAgVTpVzK8zZVpg3mrpxgUAQJVaYN3gZDV/j24nFmpg0GSZBQuTTE5ckRjlK5lGfhqsmlyREGTSOF2YvH2XdnucUgFUyVGdvAntA5KkqzFUWktLTms7Do4TZCkjJ0haKVozJtUC4NcdSUZiuKGJD16i5/bLyi5gQcRmFMpfhJjpKVo2jlMXSFt0VptqKIDBJklCCjBBklyChBRgkySpBRgowSZJQgowQZpfHuRbwD/wOX1rro0ceVGQAAAABJRU5ErkJggg==
// @match        https://app.diandian.com/rank/*
// @match        https://app.diandian.com/app/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  // 创建聊天窗口的 HTML 结构
  const chatWindowHTML = `
    <div id="chatWindow" class="chat-window">
      <div id="chatHeader" class="chat-header">
        AI Chat
        <button id="settingsButton" class="settings-button">⚙️</button>
      </div>
      <div id="chatBody" class="chat-body"></div>
      <div id="chatInputArea" class="chat-input-area">
        <input id="chatInput" type="text" placeholder="Type your message...">
        <button id="sendButton" class="send-button">Send</button>
      </div>
    </div>
  `;

  // 创建设置窗口的 HTML 结构
  const settingsWindowHTML = `
    <div id="settingsWindow" class="settings-window">
      <div class="settings-header">Settings</div>
      <div class="settings-content">
        <label for="apiKeyInput">API Key:</label>
        <input id="apiKeyInput" type="text">
        <button id="saveApiKeyButton" class="save-api-key-button">Save</button>
      </div>
    </div>
  `;

  // 将聊天窗口和设置窗口插入到页面中
  document.body.insertAdjacentHTML("beforeend", chatWindowHTML);
  document.body.insertAdjacentHTML("beforeend", settingsWindowHTML);

  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const settingsButton = document.getElementById("settingsButton");
  const settingsWindow = document.getElementById("settingsWindow");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveApiKeyButton = document.getElementById("saveApiKeyButton");

  // 加载保存的 API 密钥
  let apiKey = GM_getValue("apiKey", "");
  if (!apiKey) {
    showSettingsWindow();
  }

  function showSettingsWindow() {
    console.log("Showing settings window");
    settingsWindow.style.display = "block";
    apiKeyInput.value = apiKey;
  }

  function hideSettingsWindow() {
    console.log("Hiding settings window");
    settingsWindow.style.display = "none";
  }

  // 显示/隐藏设置窗口
  function toggleSettingsWindow(show) {
    console.log(`${show ? "Showing" : "Hiding"} settings window`);
    settingsWindow.style.display = show ? "block" : "none";
    if (show) {
      apiKeyInput.value = apiKey;
    }
  }

  // 保存 API 密钥
  saveApiKeyButton.addEventListener("click", () => {
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      GM_setValue("apiKey", apiKey);
      toggleSettingsWindow(false);
    } else {
      alert("Please enter a valid API key.");
    }
  });

  // 打开设置窗口
  settingsButton.addEventListener("click", () => {
    console.log("Settings button clicked!");
    toggleSettingsWindow(true);
  });

  // 发送消息的函数
  async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // 显示用户消息
    appendMessage("user", escapeHtml(userMessage));
    chatInput.value = "";

    // 调用 AI API
    try {
      const aiResponse = await callAIChatAPI(userMessage);
      appendMessage("ai", escapeHtml(aiResponse));
    } catch (error) {
      // appendMessage("ai", `Error: ${error}.`);
    }
  }

  // 调用 AI API 的函数
  async function callAIChatAPI(message) {
    if (!apiKey) {
      toggleSettingsWindow(true);
      throw new Error("API key is not set.");
    }

    const apiUrl = "https://api.deepseek.com/chat/completions";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 选择模型
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          stream: true, // 启用流式输出
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      // 流式读取响应数据
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            // 跳过 [DONE] 标记
            if (line === "data: [DONE]") continue;

            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices && data.choices[0].delta.content) {
                appendMessage(
                  "ai",
                  escapeHtml(data.choices[0].delta.content),
                  true
                );
              }
            } catch (e) {
              console.warn("Failed to parse stream data:", line);
            }
          }
        }

        buffer = lines.pop() || "";
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error("Failed to fetch AI response");
    }
  }

  // 在聊天窗口中显示消息
  function appendMessage(sender, message, isStream = false) {
    let messageElement;
    if (isStream) {
      // 如果是流式输出，找到最后一个 AI 消息并追加内容
      const lastAIMessage = chatBody.querySelector(".ai-message:last-child");
      if (lastAIMessage) {
        messageElement = lastAIMessage;
        messageElement.textContent += message;
      } else {
        messageElement = document.createElement("div");
        messageElement.className = "ai-message";
        messageElement.textContent = `AI: ${message}`;
        chatBody.appendChild(messageElement);
      }
    } else {
      messageElement = document.createElement("div");
      messageElement.className =
        sender === "user" ? "user-message" : "ai-message";
      messageElement.textContent = `${
        sender === "user" ? "You" : "AI"
      }: ${message}`;
      chatBody.appendChild(messageElement);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // 绑定发送按钮点击事件
  sendButton.addEventListener("click", sendMessage);

  // 绑定回车键发送消息
  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // HTML 转义函数
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 样式表
  const styleSheet = `
    .chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 400px;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .chat-header {
      padding: 10px;
      background: #f1f1f1;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
    }
    .chat-body {
      height: 300px;
      overflow-y: auto;
      padding: 10px;
    }
    .chat-input-area {
      padding: 10px;
      border-top: 1px solid #ccc;
    }
    .chat-input {
      width: 80%;
      padding: 5px;
    }
    .send-button {
      width: 18%;
      padding: 5px;
    }
    .settings-window {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 1001;
      display: none;
    }
    .settings-header {
      padding: 10px;
      background: #f1f1f1;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
    }
    .settings-content {
      padding: 10px;
    }
    .save-api-key-button {
      width: 100%;
      padding: 5px;
      margin-top: 10px;
    }
    .user-message {
      margin-bottom: 10px;
      padding: 5px;
      border-radius: 5px;
      background-color: #e1f5fe;
    }
    .ai-message {
      margin-bottom: 10px;
      padding: 5px;
      border-radius: 5px;
      background-color: #f1f1f1;
    }
  `;
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = styleSheet;
  document.head.appendChild(style);
})();
