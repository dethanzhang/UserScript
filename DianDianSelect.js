// ==UserScript==
// @name         点点数据导出榜单与候选清单
// @namespace    https://app.diandian.com/
// @version      1.0
// @description  在榜单和详细页面导出勾选和候选清单合并后的应用信息，并提供清单查看、删除和清空功能
// @author       YourName
// @match        https://app.diandian.com/rank/*
// @match        https://app.diandian.com/app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 存储候选应用清单
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const selectedApps = [];

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
        appItems.forEach(item => {
            if (item.querySelector('.custom-checkbox')) return; // 避免重复添加

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'custom-checkbox';
            checkbox.style.marginRight = '10px';

            // 获取应用名称元素
            const titleElement = item.querySelector('a.top-start');
            if (titleElement) {
                titleElement.parentNode.insertBefore(checkbox, titleElement);

                // 为每个复选框添加点击事件
                checkbox.addEventListener('change', function() {
                    const appData = {
                        name: titleElement.innerText.trim(),
                        category: item.querySelector('a.app-develop-desc') ? item.querySelector('a.app-develop-desc').innerText.trim() : '未知类别',
                        link: item.querySelector('a.logo-wrap') ? item.querySelector('a.logo-wrap').href : '#'
                    };
                    if (checkbox.checked) {
                        selectedApps.push(appData);  // 添加到勾选的列表
                    } else {
                        const index = selectedApps.findIndex(app => app.link === appData.link);
                        if (index !== -1) selectedApps.splice(index, 1);  // 从勾选列表移除
                    }
                });
            }
        });
    }

    // 创建“加入候选”按钮
    function createAddToCandidatesButton() {
        if (window.location.href.includes('/app/')) { // 仅在应用详细页面显示
            const button = document.createElement('button');
            button.textContent = '加入候选';
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.padding = '10px';
            button.style.background = '#007bff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '1000';

            button.onclick = addToCandidates;
            document.body.appendChild(button);
        }
    }
    // 在详细页面中获取正确的应用类别
    function getAppCategory() {
        // 先获取正确的父容器
        const parentContainer = document.querySelector('div.app-info-card.dd-flex');
        console.log("Parent Container:", parentContainer);
    
        if (!parentContainer) {
            console.log("未找到正确的父容器！");
            return '未知类别';
        }
    
        // 获取该容器下所有 app-info-card-item
        const items = parentContainer.querySelectorAll('div.app-info-card-item');
        console.log("所有的 app-info-card-item:", items);
    
        if (items.length < 3) {
            console.log("app-info-card-item 数量不足 3 个，无法获取正确的元素");
            return '未知类别';
        }
    
        // 获取第 3 个元素（索引为 2）
        const targetItem = items[2]; 
        console.log("选中的第 3 个 app-info-card-item:", targetItem);
    
        // 在该元素内查找类别
        const categoryElement = parentContainer.querySelectorAll('a.dd-desc-color')[2];
        console.log("Category Element:", categoryElement);
    
        return categoryElement ? categoryElement.innerText.trim() : '未知类别';
    }
    
    // 添加应用到候选清单
    function addToCandidates() {
        const appName = document.querySelector('div.ellip.font-600') ? document.querySelector('div.ellip.font-600').innerText.trim() : '未知';
        // const appCategory = document.querySelector('div.show-text dd-max-ellipsis') ? document.querySelector('div.show-text dd-max-ellipsis').innerText.trim() : '未知类别';
        const appCategory = getAppCategory();
        const appLink = window.location.href;

        // 将当前应用的信息加入候选清单
        const appData = { name: appName, category: appCategory, link: appLink };
        if (!candidates.some(app => app.link === appData.link)) {
            candidates.push(appData); // 确保去重
            localStorage.setItem('candidates', JSON.stringify(candidates));
            // alert('已加入候选清单！');
            renderCandidatesPanel(); // 更新候选清单面板
        } else {
            alert('此应用已在候选清单中！');
        }
    }

    // 创建候选清单面板
    function createCandidatesPanel() {
        const panel = document.createElement('div');
        panel.id = 'candidatesPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.width = '300px';
        panel.style.height = '400px';
        panel.style.overflowY = 'auto';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.zIndex = '1000';
        panel.style.display = 'none'; // 默认隐藏

        const title = document.createElement('h3');
        title.innerText = '候选清单';
        panel.appendChild(title);

        // 添加清空候选清单按钮
        const clearButton = document.createElement('button');
        clearButton.innerText = '清空';
        clearButton.style.marginBottom = '10px';
        clearButton.onclick = clearCandidates;
        panel.appendChild(clearButton);

        document.body.appendChild(panel);
    }

    // 渲染候选清单
    function renderCandidatesPanel() {
        const panel = document.getElementById('candidatesPanel');
        panel.style.display = 'block'; // 显示候选面板

        // 清空现有清单
        panel.innerHTML = '<h3>候选清单</h3>';
        const clearButton = document.createElement('button');
        clearButton.innerText = '清空';
        clearButton.style.marginBottom = '10px';
        clearButton.onclick = clearCandidates;
        panel.appendChild(clearButton);

        // 渲染所有候选项
        candidates.forEach((app, index) => {
            const appDiv = document.createElement('div');
            appDiv.style.display = 'flex';
            appDiv.style.justifyContent = 'space-between';
            appDiv.style.marginBottom = '5px';

            const appInfo = document.createElement('span');
            appInfo.innerText = `${app.name} (${app.category})`;

            const deleteButton = document.createElement('button');
            deleteButton.innerText = '删除';
            deleteButton.style.backgroundColor = '#ff6666';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '3px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => deleteCandidate(index);

            appDiv.appendChild(appInfo);
            appDiv.appendChild(deleteButton);
            panel.appendChild(appDiv);
        });
    }

    // 删除候选清单中的某个应用
    function deleteCandidate(index) {
        candidates.splice(index, 1);
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidatesPanel(); // 更新面板
    }

    // 清空候选清单
    function clearCandidates() {
        candidates.length = 0;
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidatesPanel(); // 更新面板
    }

    // 创建“导出 CSV”按钮
    function createExportButton() {
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出候选清单及榜单 CSV';
        exportButton.style.position = 'fixed';
        exportButton.style.top = '80px';
        exportButton.style.right = '20px';
        exportButton.style.padding = '10px';
        exportButton.style.background = '#28a745';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '5px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.zIndex = '1000';

        exportButton.onclick = exportCSV;
        document.body.appendChild(exportButton);
    }

    // 合并候选清单和勾选内容，并导出为 CSV
    function exportCSV() {
        const allApps = [...selectedApps, ...candidates];

        // 去重：基于应用链接进行去重
        const uniqueApps = Array.from(new Set(allApps.map(a => a.link)))
            .map(link => allApps.find(a => a.link === link));

        if (uniqueApps.length === 0) {
            alert('没有可导出的数据！');
            return;
        }

        let csvContent = "名称,类别,链接\n";
        uniqueApps.forEach(app => {
            csvContent += `"${app.name}","${app.category}","${app.link}"\n`;
        });

        // 使用 TextEncoder 确保 UTF-8 编码
        const encoder = new TextEncoder();
        const csvArray = encoder.encode(csvContent);
        const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Candidates_and_Selected_List.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 监听列表加载并添加复选框
    if (window.location.href.includes('/rank/')) {
        waitForElements('.rank-list', addCheckboxes);
    }

    // 创建按钮
    createAddToCandidatesButton();
    createExportButton();
    createCandidatesPanel();  // 创建候选清单面板
    renderCandidatesPanel();  // 渲染候选清单
})();
