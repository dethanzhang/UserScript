// ==UserScript==
// @name         点点数据_取名字
// @description  Get Names from CozeAPI
// @author       DethanZ
// @version      2025-03-10
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/zh-CN/scripts/526647
// @supportURL   https://github.com/dethanzhang/UserScript
// @homepageURL  https://github.com/dethanzhang/UserScript
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAE0klEQVRoBeXBPWjcZgCA4VefdGdHtppQixYfqJAhd0uXcEMhhpIETwZ5TJNs6eAbSungpgS6uNChNO7WDDGk2fKz2iVZjGsoXkqNl3a4yxCIQK7NXS6JfEp8sk7FgyEc+i4+6ZwE9DxKsxVFZJAgowQZJcgoQUYJMkqQUYKMEmSUIKMEGSXIKEFGaQzA39Vdfl/zed2oLrg8OUrBVDmwtOazXt1FZtzUMHSFopWjZOUxdIWjopGS2wipXG8QZ7MR8stXH7Jvac1n7vYz+lEu5bHP6NgTOoMmSKn2JOAwqk5Av9arbeZuP8O+tsXSms8gCVJyG3vIFK0cB2pOQFJuPWTu9jNmbzzFrYcMgiAltx4iUxhTOeD5EWmtbryiMl/HrYekJUip5gTIFEyVAzUnYBDcekhlvo7nR6QhOCIFU6Vo5dnn+R0Gya2HzN5okIbSbEURKbiNkKU1n27nTg9TtHIcWN14RdUJkPH8DjUnoOYEeH7EYcxdOYE9oZOE0mxFEe+ZpTWfhUUPtxHSi6ELln76GENX6JfgPWRP6Nz8zuTs6WF68fwOqxsvSUJptqKIhDw/4ubiC3b8Dq8b1QWV6Q8wdIW0Zm88ZXXjFTLlUp6Fqyb90kjh5uIL7i63iFOyctgTOmnNXTmBXd3C8yPirFfbeH6EoSv0Q5BCzQmQKZgqg2Dogplpg15qTpt+aaTg+REy42MacYbv3yK/8pB90cgo0cgo7XNTtM9PIWOf0VlY9PD8iDhVZ49yaYh+aKRQcwJkCqZKt/zKA4bv/UY37Z8NtH838L/+njiGLihaOdarbeJ4fod+CRJy6yEyRStHnNxffyKTX3nA8P1byBStHIMkSMht7CFj6ApxxPYmveRXHiJj6IJBEiRUcwJkilaOOOrjR/QitjdJwtAF/RIk5NZDZAqmRjexvcmbRCOjyNScNjKFMZV+CRLabOwhU7I0uont/3iT8OQpZGpP9pApWjn6JUjIrXeQGdVVuontTd6kfW6KODUnwG2ExCmYKgVTpV+ChDYbe8iULI1uYnuTXnbtC7TPTxHnzvIOMuXiEEkIEvD8Dp4fEacwphJHae0gs2tf4OWX3xDHbYQsrb1Exp44RhIaCVSdAJlxUyXOrn0B9fEjXheePEXw2efsfXoamcrPdWSKVo5yaYgkNBLY8SP61flonJ0ff6Uf8/ee4zZCZC5PjpCUIIGqEyBTc/YYhPl7z7m73ELm7Olh7AmdpAQJeH4HGc/vsF7dJSm3ETJzvc7d5RYyhq4w+8Vx0hAkYOiCXmZvNHHrIf3w/Iibix6Xf9hmvdqml8r0BxRMlTQ0EiiMqfTi+R3sa1vYZ45RLg0xbqp08/yIHb9D1QmoOQHr1TaHUZk2uDQ5QlpKsxVF9Mmth9jXtnjb7AmduSsnGARBAgVTpVzK8zZVpg3mrpxgUAQJVaYN3gZDV/j24nFmpg0GSZBQuTTE5ckRjlK5lGfhqsmlyREGTSOF2YvH2XdnucUgFUyVGdvAntA5KkqzFUWktLTms7Do4TZCkjJ0haKVozJtUC4NcdSUZiuKGJD16i5/bLyi5gQcRmFMpfhJjpKVo2jlMXSFt0VptqKIDBJklCCjBBklyChBRgkySpBRgowSZJQgowQZpfHuRbwD/wOX1rro0ceVGQAAAABJRU5ErkJggg==
// @match        https://app.diandian.com/app/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  // 创建一个按钮元素用于触发API请求
  const fetchButton = document.createElement("button");
  fetchButton.innerText = "起个名字";
  fetchButton.style.position = "fixed";
  fetchButton.style.bottom = "20px";
  fetchButton.style.left = "80px";
  fetchButton.style.padding = "10px 20px";
  fetchButton.style.backgroundColor = "#007bff";
  fetchButton.style.color = "#fff";
  fetchButton.style.border = "none";
  fetchButton.style.borderRadius = "5px";
  fetchButton.style.cursor = "pointer";
  document.body.appendChild(fetchButton);

  // 创建一个按钮元素用于输入API密钥
  const apiKeyButton = document.createElement("button");
  apiKeyButton.innerText = "密钥";
  apiKeyButton.style.position = "fixed";
  apiKeyButton.style.bottom = "20px";
  apiKeyButton.style.left = "180px";
  apiKeyButton.style.padding = "10px 20px";
  apiKeyButton.style.backgroundColor = "#28a745";
  apiKeyButton.style.color = "#fff";
  apiKeyButton.style.border = "none";
  apiKeyButton.style.borderRadius = "5px";
  apiKeyButton.style.cursor = "pointer";
  document.body.appendChild(apiKeyButton);

  let apiKey = GM_getValue("apiKey", "");
  // let apiKey = localStorage.getItem("apiKey") || "";

  // 添加API密钥按钮点击事件监听器
  apiKeyButton.addEventListener("click", () => {
    const inputKey = prompt("请输入API密钥:", apiKey);
    if (inputKey !== null) {
      apiKey = inputKey;
      GM_setValue("apiKey", apiKey);
      // localStorage.setItem("apiKey", apiKey);
      alert("API密钥已保存!");
    }
  });

  // 创建一个面板元素用于显示API返回的数据
  const panelDiv = document.createElement("div");
  panelDiv.style.position = "fixed";
  panelDiv.style.bottom = "60px";
  panelDiv.style.left = "80px";
  panelDiv.style.padding = "10px";
  panelDiv.style.backgroundColor = "#fff";
  panelDiv.style.border = "1px solid #ccc";
  panelDiv.style.borderRadius = "5px";
  panelDiv.style.width = "200px";
  panelDiv.style.maxHeight = "400px";
  panelDiv.style.overflowY = "auto";
  panelDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  panelDiv.style.display = "none"; // 初始隐藏
  document.body.appendChild(panelDiv);

  // 创建一个元素用于显示API返回的数据
  const resultDiv = document.createElement("div");
  resultDiv.style.marginTop = "20px";
  resultDiv.style.padding = "10px";
  resultDiv.style.border = "1px solid #ccc";
  document.body.appendChild(resultDiv);

  // 添加按钮点击事件监听器
  fetchButton.addEventListener("click", () => {
    console.log("Button clicked!");
    panelDiv.style.display = "block"; // 显示面板
    panelDiv.innerHTML = "<pre>起名中 >_< 请稍等</pre>"; // 添加加载提示
    const appName = document
      .querySelector("div.ellip.font-600")
      .innerText.trim();
    const appDesc = document.querySelector("p.main-content").innerText.trim();
    fetch("https://api.coze.cn/v1/workflow/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: "7478614078454956070",
        parameters: {
          raw_name: appName,
          raw_desc: appDesc,
        },
        stream: false,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const dataObject = JSON.parse(data.data);
        const formattedOutput = dataObject.output.replace(/\n/g, "<br>");
        panelDiv.innerHTML = `<pre>${formattedOutput}</pre>`;
      })
      .catch((error) => {
        console.error("Error:", error);
        panelDiv.innerHTML = `<pre>Error: ${error.message}</pre>`;
      });
  });
})();
