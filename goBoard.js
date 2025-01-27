// goBoard.js

function drawGoBoard(container, boardData) {
    const gridSize = 50;
    const boardSize = 9;

    // Create or select the SVG container
    let svg = container.select('svg');
    if (svg.empty()) {
        svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${boardSize * gridSize} ${boardSize * gridSize}`)
            .style('max-width', '100px')
            .style('max-height', '100px')
            .style('border', '1px solid black');
    } else {
        svg.selectAll('*').remove(); // Clear existing elements
    }

    // Draw the board grid
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            svg.append('rect')
                .attr('x', j * gridSize)
                .attr('y', i * gridSize)
                .attr('width', gridSize)
                .attr('height', gridSize)
                .attr('fill', 'none')
                .attr('stroke', 'black');
        }
    }

    // Draw the stones based on the boardData
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (boardData[i][j] === 1) {
                // Draw black stone
                svg.append('circle')
                    .attr('cx', j * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'black');
            } else if (boardData[i][j] === -1) {
                // Draw white stone
                svg.append('circle')
                    .attr('cx', j * gridSize + gridSize / 2)
                    .attr('cy', i * gridSize + gridSize / 2)
                    .attr('r', gridSize / 3)
                    .attr('fill', 'white')
                    .attr('stroke', 'black');
            }
        }
    }
}

// Parse SGF action (e.g., B[H9] or W[A1])
function parseSGFAction(action) {
    const color = action[0] === 'B' ? 1 : -1; // Black = 1, White = -1
    const position = action.slice(2, -1); // Extract position (e.g., "H9")

    // SGF positions use letters for columns (A = 0, B = 1, ..., I = 8)
    var col = position.charCodeAt(0) - 'A'.charCodeAt(0); // Column (A = 0, B = 1, ..., I = 8)
    if (col == 9) {
        col -= 1; // Adjust for skipping "I"
    }

    // Rows are represented as numbers from 1 to 9 (1 = bottom row, 9 = top row)
    const row = 9 - parseInt(position[1], 10); // Convert to zero-based (9 = 0, 1 = 8)

    return { color, row, col };
}

function applyAction(boardData, action) {
    //console.log(action);
    if (action === "W[]" || action === "B[]") return; // Empty action
    if (action === "W[PASS]" || action === "B[PASS]") return; // Pass action

    const { color, row, col } = parseSGFAction(action);
    //console.log(row + " " + col);

    // Check if the move is valid
    // if (!isValidMove(boardData, color, row, col)) {
    //     console.log(`Invalid move at (${row}, ${col})`);
    //     return; // Skip invalid moves
    // }

    // Place the stone
    boardData[row][col] = color;

    // Remove captured stones
    removeCapturedStones(boardData, color, row, col);
}

// Check if a move is valid
function isValidMove(boardData, color, row, col) {
    // Move must be within bounds and on an empty spot
    if (row < 0 || row >= boardData.length || col < 0 || col >= boardData[0].length) return false;
    if (boardData[row][col] !== 0) return false; // Spot already occupied

    // Simulate placing the stone
    boardData[row][col] = color;

    // Check if the move is suicidal
    const liberties = countLiberties(boardData, row, col);
    boardData[row][col] = 0; // Revert simulation
    if (liberties === 0) {
        // Check if it results in capturing opponent stones
        if (capturesOpponent(boardData, color, row, col)) return true;
        return false; // Otherwise, it's a suicide
    }

    return true; // Valid move
}

// Count liberties for a stone or group
function countLiberties(boardData, row, col) {
    const visited = new Set();
    return dfsCountLiberties(boardData, row, col, visited);
}

function dfsCountLiberties(boardData, row, col, visited) {
    const key = `${row},${col}`;
    if (visited.has(key)) return 0; // Already visited
    visited.add(key);

    const color = boardData[row][col];
    let liberties = 0;

    // Check all four adjacent points
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
    ];
    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) continue;

        if (boardData[r][c] === 0) {
            liberties += 1; // Empty spot (liberty)
        } else if (boardData[r][c] === color) {
            liberties += dfsCountLiberties(boardData, r, c, visited); // Same color (part of group)
        }
    }

    return liberties;
}

// Check if the move captures opponent stones
function capturesOpponent(boardData, color, row, col) {
    const opponentColor = -color;
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
    ];
    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) continue;

        if (boardData[r][c] === opponentColor) {
            const liberties = countLiberties(boardData, r, c);
            if (liberties === 0) return true; // Opponent group has no liberties
        }
    }
    return false;
}

// Remove captured opponent stones
function removeCapturedStones(boardData, color, row, col) {
    const opponentColor = -color;
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
    ];
    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) continue;

        if (boardData[r][c] === opponentColor) {
            const liberties = countLiberties(boardData, r, c);
            if (liberties === 0) {
                removeGroup(boardData, r, c); // Remove the captured group
            }
        }
    }
}

// Remove a group of stones
function removeGroup(boardData, row, col) {
    const color = boardData[row][col];
    const visited = new Set();
    dfsRemoveGroup(boardData, row, col, color, visited);
}

function dfsRemoveGroup(boardData, row, col, color, visited) {
    const key = `${row},${col}`;
    if (visited.has(key)) return;
    visited.add(key);

    if (boardData[row][col] !== color) return;

    boardData[row][col] = 0; // Remove the stone

    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
    ];
    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) continue;
        dfsRemoveGroup(boardData, r, c, color, visited);
    }
}

