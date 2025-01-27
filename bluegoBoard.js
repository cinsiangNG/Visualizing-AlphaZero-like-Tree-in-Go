// bluegoBoard.js

// policy's domain and range setting
const boardSize = 9;
const colorScale_p = d3.scaleLinear()
    .domain([0, 0.5, 1])
    .range(['red', 'yellow', 'blue']);

const colorScale_v = d3.scaleLinear()
.domain([-1, -0.5, 0])
.range(['purple', 'green', 'orange']);

// value's domain and range setting
// const colorScale = d3.scaleLinear()
//     .domain([-1, 0, 1])
//     .range(['red', 'white', 'blue']);

function drawBlueGoBoard_p(container, boardData, currentData, heatmapData, policycolorData, size = 250) {
    d3.select('#tooltip').remove();
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('border-radius', '4px')
        .style('padding', '5px')
        .style('display', 'none')
        .style('pointer-events', 'none')
        .style('font-size', '12px');
    const gridSize = size / 9; 
    const padding = gridSize; 
    const totalSize = size + padding; 

    // create svg container
    let svg = container.select('svg');
    if (svg.empty()) {
        svg = container.append('svg')
            .attr('width', size + padding) 
            .attr('height', size + padding) 
            .attr('viewBox', `0 0 ${size + padding} ${size + padding}`)
            .style('max-width', size + padding)
            .style('max-height', size + padding)
            .style('border', '0px solid black')
            .style('display', 'block')
            .style('position', 'relative')
            .style('left', '1%')
            .style('top', '35%');
    } else {
        svg.selectAll('*').remove(); 
    }

    // Draw the heatmap board
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (heatmapData[i][j] !== 0) {
                const colorpolicy = policycolorData[i][j];
                const fillcolor = colorScale_p(colorpolicy);
                
                svg.append('rect')
                    .attr('x', (j + 1) * gridSize) 
                    .attr('y', i * gridSize) 
                    .attr('width', gridSize)
                    .attr('height', gridSize)
                    .attr('fill', fillcolor)
                    .on('mouseover', function(event) {
                        tooltip.style('display', 'block')
                               .style('left', `${event.pageX + 10}px`)
                               .style('top', `${event.pageY + 10}px`)
                               .html(`Policy: ${(colorpolicy*100).toFixed(4)}%`);
                    })
                    .on('mousemove', function(event) {
                        tooltip.style('left', `${event.pageX + 10}px`)
                               .style('top', `${event.pageY + 10}px`);
                    })
                    .on('mouseout', function() {
                        tooltip.style('display', 'none');
                    });
            }
        }
    }

    // Draw the board grid
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            svg.append('rect')
                .attr('x', (j + 1) * gridSize) 
                .attr('y', i * gridSize) 
                .attr('width', gridSize)
                .attr('height', gridSize)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
        }
    }

    // Draw the stones based on the boardData
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (boardData[i][j] === 1) {
                // black
                svg.append('circle')
                    .attr('cx', (j + 1) * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'black');
                if (currentData[i][j] === 1) {
                    // black
                    svg.append('circle')
                        .attr('cx', (j + 1) * gridSize + gridSize / 2)
                        .attr('cy', i * gridSize + gridSize / 2)
                        .attr('r', gridSize / 6)
                        .attr('fill', 'green');
                }
            } else if (boardData[i][j] === -1) {
                // white 
                svg.append('circle')
                    .attr('cx', (j + 1) * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);
                if (currentData[i][j] === 1) {
                    // black
                    svg.append('circle')
                        .attr('cx', (j + 1) * gridSize + gridSize / 2)
                        .attr('cy', i * gridSize + gridSize / 2)
                        .attr('r', gridSize / 6)
                        .attr('fill', 'green');
                }
            }
        }
    }

    // Draw the labels
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const numbers = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];

    // Left label(numbers)
    for (let i = 0; i < boardSize; i++) {
        svg.append('text')
            .attr('x', padding / 2) 
            .attr('y', i * gridSize + gridSize / 2) 
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(numbers[i]);
    }

    // Bottom label(letters)
    for (let j = 0; j < boardSize; j++) {
        svg.append('text')
            .attr('x', (j + 1) * gridSize + gridSize / 2) 
            .attr('y', size + padding / 2) 
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('front-family', 'Times New Romans, serif')
            .text(letters[j]);
    }
}

function drawBlueGoBoard_v(container, boardData, currentData, heatmapData, policycolorData, size = 250) {
    d3.select('#tooltip').remove();
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('border-radius', '4px')
        .style('padding', '5px')
        .style('display', 'none')
        .style('pointer-events', 'none')
        .style('font-size', '12px');
    const gridSize = size / 9; 
    const padding = gridSize; 
    const totalSize = size + padding; 

    // create svg container
    let svg = container.select('svg');
    if (svg.empty()) {
        console.log("!")
        svg = container.append('svg')
            .attr('width', size + padding) 
            .attr('height', size + padding) 
            .attr('viewBox', `0 0 ${size + padding} ${size + padding}`)
            .style('max-width', size + padding)
            .style('max-height', size + padding)
            .style('border', '0px solid black')
            .style('display', 'block')
            .style('position', 'relative')
            .style('left', '1%')
            .style('top', '35%');
    } else {
        svg.selectAll('*').remove(); 
    }

    // Draw the heatmap board
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (heatmapData[i][j] !== 0) {
                const colorpolicy = policycolorData[i][j];
                const fillcolor = colorScale_v(colorpolicy);
                
                svg.append('rect')
                    .attr('x', (j + 1) * gridSize) 
                    .attr('y', i * gridSize) 
                    .attr('width', gridSize)
                    .attr('height', gridSize)
                    .attr('fill', fillcolor)
                    .on('mouseover', function(event) {
                        tooltip.style('display', 'block')
                               .style('left', `${event.pageX + 10}px`)
                               .style('top', `${event.pageY + 10}px`)
                               .html(`Value: ${(colorpolicy).toFixed(4)}`);
                    })
                    .on('mousemove', function(event) {
                        tooltip.style('left', `${event.pageX + 10}px`)
                               .style('top',`${event.pageY + 10}px`);
                    })
                    .on('mouseout', function() {
                        tooltip.style('display', 'none');
                    });
            }
        }
    }

    // Draw the board grid
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            svg.append('rect')
                .attr('x', (j + 1) * gridSize) 
                .attr('y', i * gridSize) 
                .attr('width', gridSize)
                .attr('height', gridSize)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
        }
    }

    // Draw the stones based on the boardData
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (boardData[i][j] === 1) {
                // black
                svg.append('circle')
                    .attr('cx', (j + 1) * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'black');
                if (currentData[i][j] === 1) {
                    // black
                    svg.append('circle')
                        .attr('cx', (j + 1) * gridSize + gridSize / 2)
                        .attr('cy', i * gridSize + gridSize / 2)
                        .attr('r', gridSize / 6)
                        .attr('fill', 'green');
                }
            } else if (boardData[i][j] === -1) {
                // white 
                svg.append('circle')
                    .attr('cx', (j + 1) * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);
                if (currentData[i][j] === 1) {
                    // black
                    svg.append('circle')
                        .attr('cx', (j + 1) * gridSize + gridSize / 2)
                        .attr('cy', i * gridSize + gridSize / 2)
                        .attr('r', gridSize / 6)
                        .attr('fill', 'green');
                }
            }
        }
    }

    // Draw the labels
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const numbers = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];

    // Left label(numbers)
    for (let i = 0; i < boardSize; i++) {
        svg.append('text')
            .attr('x', padding / 2) 
            .attr('y', i * gridSize + gridSize / 2) 
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(numbers[i]);
    }

    // Bottom label(letters)
    for (let j = 0; j < boardSize; j++) {
        svg.append('text')
            .attr('x', (j + 1) * gridSize + gridSize / 2) 
            .attr('y', size + padding / 2) 
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('front-family', 'Times New Romans, serif')
            .text(letters[j]);
    }
}

function generateHeatmapBoards(actions) {
    const initialBoard = Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0)); // Empty 9x9 board
    // console.log(initialBoard)
    const boards = [JSON.parse(JSON.stringify(initialBoard))];
    actions.forEach(action => {
        if (action === "W[PASS]" || action === "B[PASS]") return; // 跳过 Pass 动作

        // 从上一个棋盘状态复制
        const heatmapBoard = JSON.parse(JSON.stringify(boards[boards.length - 1]));

        // 解析动作，更新棋盘
        const { color, row, col } = parseSGFAction(action);
        heatmapBoard[row][col] = color; // 黑棋 = 1, 白棋 = -1

        // 将更新后的棋盘状态添加到 boards 数组
        boards.push(heatmapBoard);
    });

    return boards;
}

function generateColorBoards(actions, Value) {
    const initialBoard = Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0)); // Empty 9x9 board
    // console.log(initialBoard)
    const boards = [JSON.parse(JSON.stringify(initialBoard))];
    actions.forEach((action,i) => {
        if (action === "W[PASS]" || action === "B[PASS]") return; // 跳过 Pass 动作

        // 从上一个棋盘状态复制
        const policycolorBoard = JSON.parse(JSON.stringify(boards[boards.length - 1]));

        // 解析动作，更新棋盘
        const { color, row, col } = parseSGFAction(action);
        policycolorBoard[row][col] = Value[i]; // policycolor
        // console.log(row, col, color)

        // 将更新后的棋盘状态添加到 boards 数组
        boards.push(policycolorBoard);
    });

    return boards;
}

function generateCurrentColorBoard(action, fixedValue) {
    const initialBoard = Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0)); // Empty 9x9 board

    if (action === "W[PASS]" || action === "B[PASS]" || action === "W[]" || action === "B[]") return initialBoard; // Skip Pass action and return empty board

    // Parse the action to determine the position
    const { color, row, col } = parseSGFAction(action);
    console.log(action)
    // Update the board with the fixed value at the specified position
    initialBoard[row][col] = fixedValue;

    return initialBoard;
}
