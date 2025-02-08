// ==UserScript==
// @name         点点数据勾选导出榜单
// @namespace    https://app.diandian.com/
// @version      2025-02-08
// @description  在榜单和详细页面导出勾选和候选清单合并后的应用信息，并提供清单查看、删除和清空功能
// @author       DethanZ
// @match        https://app.diandian.com/rank/*
// @grant        none
// ==/UserScript==

// TODO: 榜单类型, 榜单排名、类型排名、是否有付费点
(function () {
  ("use strict");
  // 存储候选应用清单
  const selectedApps = [];

  // 获取当前日期（格式：YYYYMMDD）
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份是从 0 开始的
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // 监听页面加载，确保所有榜单应用都有复选框
  function waitForElements(selector, callback) {
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        callback(elements);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 在榜单页面添加复选框
  function addCheckboxes(appItems) {
    appItems.forEach((item) => {
      if (item.querySelector(".custom-checkbox")) return; // 避免重复添加

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "custom-checkbox";
      checkbox.style.marginRight = "10px";

      // 获取应用名称元素
      const titleElement = item.querySelector("a.top-start");
      if (titleElement) {
        titleElement.parentNode.insertBefore(checkbox, titleElement);

        // 为每个复选框添加点击事件
        checkbox.addEventListener("change", function () {
          const appData = {
            name: titleElement.innerText.trim(),
            category: item.querySelector("a.app-develop-desc")
              ? item.querySelector("a.app-develop-desc").innerText.trim()
              : "未知类别",
            link: item.querySelector("a.logo-wrap")
              ? item.querySelector("a.logo-wrap").href
              : "#",
          };
          if (checkbox.checked) {
            selectedApps.push(appData); // 添加到勾选的列表
          } else {
            const index = selectedApps.findIndex(
              (app) => app.link === appData.link
            );
            if (index !== -1) selectedApps.splice(index, 1); // 从勾选列表移除
          }
        });
      }
    });
  }

  // 创建上方按钮: 导出勾选
  function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.position = "fixed";
    button.style.top = "60px";
    button.style.right = "20px";
    button.style.padding = "10px";
    button.style.background = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";

    button.onclick = onClickHandler;
    document.body.appendChild(button);
  }

  // **通用 CSV 导出函数**
  function exportToCSV(data, filename) {
    // 去重：基于应用链接进行去重
    const uniqueData = Array.from(new Set(data.map((a) => a.link))).map(
      (link) => data.find((a) => a.link === link)
    );

    let csvContent = "名称,类别,链接\n";
    uniqueData.forEach((app) => {
      csvContent += `"${app.name}","${app.category}","${app.link}"\n`;
    });

    // 生成带日期的文件名
    const fullFilename = `${filename}_${getCurrentDate()}.csv`;

    // 创建 CSV 下载链接
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fullFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // **导出勾选项**
  function exportCheckedItems() {
    if (selectedApps.length === 0) {
      alert("未勾选任何应用！");
      return;
    }
    exportToCSV(selectedApps, "排行榜_勾选内容");
  }

  waitForElements(".rank-list", addCheckboxes); // 监听列表加载并添加复选框
  createButton("导出勾选项", exportCheckedItems); // 创建导出按钮
})();
