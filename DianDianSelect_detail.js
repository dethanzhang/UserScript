// ==UserScript==
// @name         点点数据详细页增强版
// @namespace    https://app.diandian.com/
// @version      2025-02-08
// @description  在榜单和详细页面导出勾选和候选清单合并后的应用信息，并提供清单查看、删除和清空功能
// @author       DethanZ
// @match        https://app.diandian.com/rank/*
// @match        https://app.diandian.com/app/*
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");
  // 判断当前页面类型
  const isAppDetailPage = window.location.href.includes("/app/");

  // 存储候选应用清单
  const candidates = JSON.parse(localStorage.getItem("candidates")) || [];

  // 监听页面可见性变化
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      // 重新读取 localStorage 中的 candidates
      const updatedCandidates =
        JSON.parse(localStorage.getItem("candidates")) || [];
      candidates.length = 0; // 清空当前数组
      candidates.push(...updatedCandidates); // 更新为最新的候选清单
      renderCandidatesPanel(); // 更新候选清单面板
    }
  });

  // 获取当前日期（格式：YYYYMMDD）
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份是从 0 开始的
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // 创建上方按钮: 加入候选
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

  // 创建按钮: 导出候选清单
  function createExportButton() {
    const exportButton = document.createElement("button");
    exportButton.textContent = "导出候选清单CSV";
    exportButton.style.position = "fixed";
    exportButton.style.top = "100px";
    exportButton.style.right = "20px";
    exportButton.style.padding = "10px";
    exportButton.style.background = "#28a745";
    exportButton.style.color = "white";
    exportButton.style.border = "none";
    exportButton.style.borderRadius = "5px";
    exportButton.style.cursor = "pointer";
    exportButton.style.zIndex = "1000";

    exportButton.onclick = exportCandidateList;
    document.body.appendChild(exportButton);
  }

  // 创建候选清单面板
  function createCandidatesPanel() {
    const panel = document.createElement("div");
    panel.id = "candidatesPanel";
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.width = "300px";
    panel.style.height = "400px";
    panel.style.overflowY = "auto";
    panel.style.backgroundColor = "white";
    panel.style.border = "1px solid #ccc";
    panel.style.padding = "10px";
    panel.style.zIndex = "1000";
    panel.style.display = "none"; // 默认隐藏

    const title = document.createElement("h3");
    title.innerText = "候选清单";
    panel.appendChild(title);

    // 添加清空候选清单按钮
    const clearButton = document.createElement("button");
    clearButton.innerText = "清空";
    clearButton.style.marginBottom = "10px";
    clearButton.onclick = clearCandidates;
    panel.appendChild(clearButton);

    document.body.appendChild(panel);
  }

  // 渲染候选清单
  function renderCandidatesPanel() {
    const panel = document.getElementById("candidatesPanel");
    panel.style.display = "block"; // 显示候选面板

    // 清空现有清单
    panel.innerHTML = "<h3>候选清单</h3>";
    const clearButton = document.createElement("button");
    clearButton.innerText = "清空";
    clearButton.style.marginBottom = "10px";
    clearButton.onclick = clearCandidates;
    panel.appendChild(clearButton);

    // 渲染所有候选项
    candidates.forEach((app, index) => {
      const appDiv = document.createElement("div");
      appDiv.style.display = "flex";
      appDiv.style.justifyContent = "space-between";
      appDiv.style.marginBottom = "5px";

      const appInfo = document.createElement("span");
      appInfo.innerText = `${app.name} (${app.category})`;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "删除";
      deleteButton.style.backgroundColor = "#ff6666";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "3px";
      deleteButton.style.cursor = "pointer";
      deleteButton.onclick = () => deleteCandidate(index);

      appDiv.appendChild(appInfo);
      appDiv.appendChild(deleteButton);
      panel.appendChild(appDiv);
    });
  }

  // 删除候选清单中的某个应用
  function deleteCandidate(index) {
    candidates.splice(index, 1);
    localStorage.setItem("candidates", JSON.stringify(candidates));
    renderCandidatesPanel(); // 更新面板
  }

  // 清空候选清单
  function clearCandidates() {
    candidates.length = 0;
    localStorage.setItem("candidates", JSON.stringify(candidates));
    renderCandidatesPanel(); // 更新面板
  }

  // TODO: 排名、下载量、上线时间
  // 添加应用到候选清单
  function addToCandidates() {
    const appName = document.querySelector("div.ellip.font-600")
      ? document.querySelector("div.ellip.font-600").innerText.trim()
      : "未知"; // 应用名称
    const appCategory = getCategoryAndDownloads().category; // 应用类别
    const appLink = window.location.href; // 应用链接
    // const appRank = document.querySelector("div.app-rank"); // 应用排名
    const appDownloads = getCategoryAndDownloads().downloads; // 应用下载量
    const appPubTime = getPubTime(); // 应用上线时间

    // 将当前应用的信息加入候选清单
    const appData = {
      name: appName,
      category: appCategory,
      downloads: appDownloads,
      pubTime: appPubTime,
      link: appLink,
    };
    if (!candidates.some((app) => app.link === appData.link)) {
      candidates.push(appData); // 确保去重
      localStorage.setItem("candidates", JSON.stringify(candidates));
      // alert('已加入候选清单！');
      renderCandidatesPanel(); // 更新候选清单面板
    } else {
      alert("此应用已在候选清单中！");
    }
  }

  function getPubTime() {
    const parentContainer = document.querySelector("div.app-base-info-wrap");
    const item = parentContainer.querySelectorAll(
      "div.content-title.dd-flex.dd-flex-end"
    )[1];
    return item ? item.innerText.trim() : "未知下载量";
  }

  // 在详细页面中获取正确的应用类别
  function getCategoryAndDownloads() {
    // 先获取正确的父容器
    const parentContainer = document.querySelector("div.app-info-card.dd-flex");
    if (!parentContainer) {
      console.log("未找到正确的父容器！");
      return "未知类别";
    }
    // 获取该容器下所有 app-info-card-item
    const items = parentContainer.querySelectorAll("div.app-info-card-item");

    // 获取items中的第3个元素
    const blockCategory = items[2].querySelector("div.app-desc-value");
    const categoryElement = blockCategory.querySelector("a.dd-desc-color");

    // 获取items中的倒数第2个元素
    const blockDownloads =
      items[items.length - 2].querySelector("div.app-value");
    const downloadsElement = blockDownloads.querySelector("a.app-value");

    // 返回类别和下载量
    return {
      category: categoryElement ? categoryElement.innerText.trim() : "未知类别",
      downloads: downloadsElement
        ? downloadsElement.innerText.trim()
        : "未知下载量",
    };
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

  // **导出候选清单**
  function exportCandidateList() {
    const candidateApps = [...candidates];
    if (candidateApps.length === 0) {
      alert("候选清单为空！");
      return;
    }
    exportToCSV(candidateApps, "详情页_候选清单");
    // **清空候选清单**
    clearCandidates();
  }

  // 详情页显示“加入候选”
  if (isAppDetailPage) {
    createButton("加入候选", addToCandidates);
  }

  createExportButton(); // 创建导出候选清单按钮
  createCandidatesPanel(); // 创建候选清单面板
  renderCandidatesPanel(); // 渲染候选清单
})();
