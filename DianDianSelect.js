// ==UserScript==
// @name         点点数据详细页基础版
// @namespace    https://app.diandian.com/
// @version      2025-02-10
// @description  在榜单和详细页面导出勾选和候选清单合并后的应用信息，并提供清单查看、删除和清空功能
// @author       DethanZ
// @match        https://app.diandian.com/rank/*
// @match        https://app.diandian.com/app/*
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");
  // 判断当前页面类型
  const isAppDetailPage =
    window.location.href.includes("/app/") &&
    window.location.href.includes("/googleplay?"); //暂不支持ios
  const isRankDetailPage = window.location.href.includes("/googleplay-rank?"); //暂不支持ios

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

  // 格式化数字为中文格式
  function formatNumberToChinese(numStr) {
    numStr = numStr.replace(/,/g, "");
    const hasPlus = numStr.includes("+");
    const num = parseFloat(numStr.replace("+", ""));

    let result;
    if (num >= 100000000) {
      result = Math.round(num / 100000000) + "亿"; // 四舍五入到整数
    } else if (num >= 10000) {
      result = Math.round(num / 10000) + "万"; // 四舍五入到整数
    } else {
      result = num.toString();
    }

    if (hasPlus) {
      result += "+";
    }

    return result;
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
    exportButton.style.position = "absolute";
    exportButton.style.top = "10px";
    exportButton.style.right = "10px";
    exportButton.style.padding = "5px";
    exportButton.style.background = "#28a745";
    exportButton.style.color = "white";
    exportButton.style.border = "none";
    exportButton.style.borderRadius = "5px";
    exportButton.style.cursor = "pointer";
    exportButton.style.zIndex = "1000";

    exportButton.onclick = exportCandidateList;
    return exportButton;
  }

  // 创建候选清单面板
  function createCandidatesPanel() {
    const panel = document.createElement("div");
    panel.id = "candidatesPanel";
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.width = "400px";
    panel.style.height = "200px";
    panel.style.overflowY = "auto";
    panel.style.backgroundColor = "white";
    panel.style.border = "1px solid #ccc";
    panel.style.padding = "10px";
    panel.style.zIndex = "1000";
    panel.style.display = "none"; // 默认隐藏

    const title = document.createElement("h3");
    title.innerText = "候选清单";
    panel.appendChild(title);

    // 添加导出候选清单按钮
    const exportButton = createExportButton();
    panel.appendChild(exportButton);

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

    // 添加导出候选清单按钮
    const exportButton = createExportButton();
    panel.appendChild(exportButton);

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
      appCategory: categoryElement
        ? categoryElement.innerText.trim()
        : "未知类别",
      appDownloads: downloadsElement
        ? downloadsElement.innerText.trim()
        : "未知下载量",
    };
  }

  // TODO: 排名数据
  // 添加应用到候选清单
  function addToCandidates() {
    const appName = document.querySelector("div.ellip.font-600")
      ? document.querySelector("div.ellip.font-600").innerText.trim()
      : "未知";
    const { appCategory, appDownloads } = getCategoryAndDownloads(); // 应用类别和下载量
    const appLink = window.location.href.replace(
      "/googleplay-rank?",
      "/googleplay?"
    );

    // 将当前应用的信息加入候选清单
    const appData = {
      name: appName,
      category: appCategory,
      downloads: formatNumberToChinese(appDownloads),
      pubtime: getPubTime(),
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
    if (!parentContainer) {
      return "-";
    }
    const item = parentContainer.querySelectorAll(
      "div.content-title.dd-flex.dd-flex-end"
    )[1];
    return item ? item.innerText.trim() : "-";
  }

  // **通用 CSV 导出函数**
  function exportToCSV(data, filename) {
    // 去重：基于应用名称进行去重
    const uniqueData = Array.from(new Set(data.map((app) => app.name))).map(
      (name) => {
        return data.find((app) => app.name === name);
      }
    );

    let csvContent = "名称,类别,下载量,发布时间,链接\n";
    uniqueData.forEach((app) => {
      csvContent += `"${app.name}","${app.category}","${app.downloads}","${app.pubtime}","${app.link}"\n`;
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
  if (window.location.href.includes("/app/")) {
    createButton("加入候选", addToCandidates);
  }

  createCandidatesPanel(); // 创建候选清单面板
  renderCandidatesPanel(); // 渲染候选清单
})();
