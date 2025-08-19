// ==UserScript==
// @name         自动点击按钮工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在页面右下角添加控制面板，可设置自动点击参数，并实时更新最后点击的按钮ID
// @author       YourName
// @match        https://www.decisionproblem.com/paperclips/index2.html
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 创建控制面板样式
  const style = document.createElement("style");
  style.textContent = `
        #autoClickerPanel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        #autoClickerPanel h3 {
            margin-top: 0;
            color: #333;
        }
        #autoClickerPanel label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
        }
        #autoClickerPanel input {
            width: 100%;
            padding: 5px;
            box-sizing: border-box;
        }
        #autoClickerPanel button {
            margin-top: 15px;
            padding: 8px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #autoClickerPanel button:hover {
            background: #45a049;
        }
        #autoClickerPanel button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        #autoClickerPanel .last-clicked {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
    `;
  document.head.appendChild(style);

  // 创建控制面板HTML
  const panel = document.createElement("div");
  panel.id = "autoClickerPanel";
  panel.innerHTML = `
        <h3>自动点击工具</h3>
        <label for="btnIdInput">按钮ID:</label>
        <input type="text" id="btnIdInput" placeholder="输入要点击的按钮ID">
        <div class="last-clicked">当前按钮ID将随您点击自动更新</div>

        <label for="clickTimesInput">点击次数:</label>
        <input type="number" id="clickTimesInput" value="100" min="1" placeholder="输入点击次数">

        <label for="delayInput">间隔时间(ms):</label>
        <input type="number" id="delayInput" value="10" min="1" placeholder="输入间隔时间(毫秒)">

        <button id="startClickingBtn">开始自动点击</button>
        <button id="stopClickingBtn" disabled>停止</button>
    `;
  document.body.appendChild(panel);

  // 获取DOM元素
  const btnIdInput = document.getElementById("btnIdInput");
  const clickTimesInput = document.getElementById("clickTimesInput");
  const delayInput = document.getElementById("delayInput");
  const startBtn = document.getElementById("startClickingBtn");
  const stopBtn = document.getElementById("stopClickingBtn");

  let intervalId = null;

  // 监听页面上的所有点击事件
  document.addEventListener("click", function (e) {
    // 排除自动点击器面板上的元素
    if (e.target.closest("#autoClickerPanel")) {
      return;
    }

    // 检查点击的元素是否是按钮
    const isButton =
      e.target.tagName === "BUTTON" ||
      (e.target.tagName === "INPUT" &&
        ["button", "submit", "reset"].includes(e.target.type)) ||
      e.target.getAttribute("role") === "button";

    if (isButton && e.target.id) {
      // 直接更新输入框中的按钮ID
      btnIdInput.value = e.target.id;
    }
  });

  // 开始点击函数
  function startClicking() {
    const btnId = btnIdInput.value || "btnAddProc";
    const clkTimes = parseInt(clickTimesInput.value) || 100;
    const delayMs = parseInt(delayInput.value) || 10;

    let clickCount = 0;
    const button = document.getElementById(btnId);

    if (!button) {
      alert(`未找到ID为"${btnId}"的按钮！`);
      return;
    }

    // 禁用开始按钮，启用停止按钮
    startBtn.disabled = true;
    stopBtn.disabled = false;

    intervalId = setInterval(() => {
      if (clickCount < clkTimes) {
        button.click();
        clickCount++;
        console.log(`已点击 ${clickCount} 次，共 ${clkTimes} 次`);
      } else {
        stopClicking();
        console.log(`已完成 ${clkTimes} 次点击`);
      }
    }, delayMs);
  }

  // 停止点击函数
  function stopClicking() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      console.log("自动点击已停止");
    }
  }

  // 添加事件监听
  startBtn.addEventListener("click", startClicking);
  stopBtn.addEventListener("click", stopClicking);

  // 添加键盘快捷键支持
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && intervalId) {
      stopClicking();
    }
  });
})();