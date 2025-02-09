// ==UserScript==
// @name         DOM Change Listener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  监听DOM变化以获取fetch返回的JSON数据
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 目标DOM元素的选择器
  const targetSelector = "div.dd-chart-frame"; // 替换为实际的DOM元素选择器

  // 监听DOM变化
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          try {
            const jsonData = JSON.parse(targetElement.textContent);
            console.log("Intercepted JSON:", jsonData);

            // 在这里可以对jsonData进行处理
          } catch (error) {
            console.log("Failed to parse JSON:", error);
          }
        }
      }
    }
  });

  // 等待目标节点出现
  function waitForTargetNode() {
    const targetNode = document.querySelector(targetSelector);
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      console.log("Started observing target element");
    } else {
      console.log("Target element not found, retrying...");
      setTimeout(waitForTargetNode, 1000); // 每秒重试一次
    }
  }

  waitForTargetNode(); // 开始等待目标节点出现

  // 拦截 fetch 请求
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();

    clonedResponse
      .json()
      .then((data) => {
        console.log("Intercepted fetch JSON:", data);
        // 在这里可以对 data 进行处理
      })
      .catch((error) => {
        console.log("Failed to parse fetch JSON:", error);
      });

    return response;
  };
})();
