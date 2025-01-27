// Winrate 數據 (介於 -1 到 1)
const winrates = [
    -0.121017, -0.00185623, -0.0737526, 0.026172, -0.0650543, 0.07938, -0.0379913,
    0.0645482, 0.000366261, 0.0202915, -0.0789363, 0.0174555, -0.0395516, -0.12051,
    -0.212439, 0.0419073, -0.294508, 0.159389, -0.196431, 0.0683508, -0.199191,
    -0.0692738, -0.498169, -0.43678, -0.524522, -0.0850174, -0.528137, -0.0385022,
    -0.597349, -0.312087, -0.467958, -0.312936, -0.64871, -0.364518, -0.494813,
    -0.424142, -0.527242, -0.617811, -0.579033, -0.44046, -0.775519, -0.767275,
    -0.646381, -0.774242, -0.709832, -0.565614, -0.500245, -0.633122, -0.584467,
    -0.741598, -0.768357, -0.777401, -0.653888, -0.612808, -0.775558, -0.72867,
    -0.832478, -0.921336, -0.630513, -0.874597, -0.823099, -0.820013, -0.740824,
    -0.885112, -0.641084, -0.739972, -0.797703, -0.755433, -0.738645, -0.935582,
    -0.760564, -0.826108, -0.784897, -0.85657, -0.536239, -0.932015, -0.619193,
    -0.812771, -0.82485, -0.912703, -0.862377, -0.795795, -0.580563, -0.933137,
    -0.74421, -0.90982, -0.553981, -0.922527, -0.520965, -0.6298, -0.791148,
    -0.913501, -0.528687, -0.920678, -0.718955, -0.584058, -0.815763
];

// 初始化圖表
function initWinrateChart() {
    const purpleBox = document.getElementById("winrateChart");
    const width = purpleBox.clientWidth-60; // 容器的寬度
    const height = 130; // 固定高度
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // 創建 SVG 容器
    const svg = d3.select("#winrateChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定義 X 和 Y 軸縮放
    const xScale = d3.scaleLinear()
        .domain([0, winrates.length - 1]) // X 軸：move 範圍
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([-1, 1]) // Y 軸：Winrate [-1, 1]
        .range([height, 0]);

    // 添加 X 軸
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(10));

    // 添加 Y 軸
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5));

    // 添加基準線 (Y = 0)
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 2");

    // 畫初始折線
    svg.append("path")
        .datum(winrates)
        .attr("class", "winrate-line")
        .attr("fill", "none")
        .attr("stroke", "lightgreen")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
        );

    // 添加交互點
    svg.selectAll(".winrate-point")
        .data(winrates)
        .enter()
        .append("circle")
        .attr("class", "winrate-point")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 3)
        .attr("fill", "lightgreen")
        .attr("stroke", "none")
        .attr("data-move", (d, i) => i) // 新增自定義屬性，存儲 Move 值
        .on("mouseover", function (event, d) {
            const move = d3.select(this).attr("data-move"); // 讀取自定義屬性
            d3.select(this).attr("r", 6).attr("fill", "red"); // 擴大點
            const blackWinrate = ((d + 1) * 50).toFixed(2);
        
            // 顯示 tooltip
            const tooltip = d3.select("#tooltip_wr");
            tooltip.style("display", "block")
                .text(`Move: ${move}, Black Winrate: ${blackWinrate}%`);
        
            // 動態計算 tooltip 位置
            const tooltipNode = tooltip.node();
            const tooltipWidth = tooltipNode.offsetWidth;
            const tooltipHeight = tooltipNode.offsetHeight;
        
            const pageWidth = window.innerWidth;
            const pageHeight = window.innerHeight;
        
            const mouseX = event.pageX;
            const mouseY = event.pageY;
        
            let tooltipLeft = mouseX + 10; // 預設位置在滑鼠右側
            let tooltipTop = mouseY + 10; // 預設位置在滑鼠下方
        
            // 如果 tooltip 超出右邊界，顯示在滑鼠左側
            if (mouseX + 10 + tooltipWidth > pageWidth) {
                tooltipLeft = mouseX - tooltipWidth - 10;
            }
        
            // 如果 tooltip 超出下邊界，顯示在滑鼠上方
            if (mouseY + 10 + tooltipHeight > pageHeight) {
                tooltipTop = mouseY - tooltipHeight - 10;
            }
        
            tooltip.style("left", `${tooltipLeft}px`)
                .style("top", `${tooltipTop}px`);
        })        
        .on("mouseout", function () {
            d3.select(this).attr("r", 3).attr("fill", "lightgreen"); // 恢復原始大小
            d3.select("#tooltip_wr").style("display", "none"); // 隱藏 tooltip
        })
        .on("click", function (event, d) {
            const move = d3.select(this).attr("data-move"); // 讀取自定義屬性
            setMoveAndStep(move,200)
            // console.log(`Clicked Move: ${move}, Winrate: ${(d * 100).toFixed(2)}%`);
        });

    return { svg, xScale, yScale };
}

// 更新圖表
function changeWinrateChart(newMove) {
    const { svg, xScale, yScale } = window.winrateChart;

    // 移除之前的高亮點
    svg.selectAll(".highlight-point").remove();

    // 添加新的高亮點
    svg.append("circle")
        .attr("class", "highlight-point")
        .attr("cx", xScale(newMove))
        .attr("cy", yScale(winrates[newMove]))
        .attr("r", 5)
        .attr("fill", "red");
}

// 添加 Tooltip
function addTooltip() {
    d3.select("body")
        .append("div")
        .attr("id", "tooltip_wr")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px 10px")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("display", "none");
}

// 初始化圖表和 Tooltip
addTooltip();
window.winrateChart = initWinrateChart();
// 獲取所有按鈕元素
const prevMoveButton = document.getElementById("prevMove");
const prevStepButton = document.getElementById("prevStep");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const nextStepButton = document.getElementById("nextStep");
const nextMoveButton = document.getElementById("nextMove");

// 添加按鈕點擊事件
prevMoveButton.addEventListener("click", () => {
    previousMove();
    // 在此執行切換到上一個 Move 的邏輯
});

prevStepButton.addEventListener("click", () => {
    previousStep();
    // 在此執行切換到上一個 Step 的邏輯
});

pauseButton.addEventListener("click", () => {
    stopGlobalTimer();
    // 在此執行暫停邏輯
});

resumeButton.addEventListener("click", () => {
    resumeGlobalTimer();
    // 在此執行恢復邏輯
});

nextStepButton.addEventListener("click", () => {
    nextStep();
    // 在此執行切換到下一個 Step 的邏輯
});

nextMoveButton.addEventListener("click", () => {
    nextMove();
    // 在此執行切換到下一個 Move 的邏輯
});
