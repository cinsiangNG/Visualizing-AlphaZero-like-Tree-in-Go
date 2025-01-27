
const interval = 2000;
// Global timer object
const globalTimer = {
    move: 0,
    step: 0,
    maxSteps: 200,
    maxMoves: 97,
    interval: null,
};

// API to load JSON data for a specific move and step
async function loadSimulationData(move, step) {
    const filePath = `output_json/game0_move${move.toString().padStart(2, "0")}_step${step.toString().padStart(3, "0")}.json`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load JSON file: ${filePath}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to calculate board state from JSON data
async function calculateBoardState(move) {
    // Provided actions list
    const actions = [
        "B[E5]","W[E7]","B[G6]","W[G7]","B[C6]","W[F6]","B[F5]","W[G5]","B[H6]",
        "W[G4]","B[H7]","W[G8]","B[C7]","W[H8]","B[F3]","W[G3]","B[G2]","W[F4]",
        "B[E4]","W[F2]","B[E3]","W[H2]","B[E6]","W[F7]","B[E2]","W[G1]","B[D8]",
        "W[E8]","B[E1]","W[D7]","B[C8]","W[D6]","B[D5]","W[E9]","B[F1]","W[G2]",
        "B[J8]","W[H5]","B[D9]","W[J6]","B[B2]","W[J7]","B[B4]","W[C5]","B[C4]",
        "W[G6]","B[F9]","W[G9]","B[B6]","W[D3]","B[A8]","W[F8]","B[J1]","W[H3]",
        "B[B8]","W[J5]","B[J9]","W[H9]","B[B3]","W[B7]","B[C3]","W[H1]","B[C2]",
        "W[J3]","B[A3]","W[J2]","B[A6]","W[H4]","B[A2]","W[B1]","B[A7]","W[F9]",
        "B[C9]","W[J9]","B[D4]","W[B5]","B[H6]","W[B9]","B[A9]","W[PASS]","B[A5]",
        "W[C5]","B[B9]","W[PASS]","B[C1]","W[PASS]","B[D2]","W[PASS]","B[A1]","W[H7]",
        "B[B5]","W[PASS]","B[D1]","W[J4]","B[B1]","W[PASS]","B[PASS]"
    ];
    let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0)); // Initialize an empty board
    for (var i = 0 ; i < move; i++){
        applyAction(board, actions[i]);
    }
    return board
}


// Trigger globalTimerChange event
async function triggerGlobalTimerChangeEvent() {
    const { move, step } = globalTimer;

    // Calculate the board state
    const board = await calculateBoardState(move);
    if (!board) return;
    const data = await loadSimulationData(move, step);

    const event = new CustomEvent("globalTimerChange", {
        detail: {
            data :  data[0],
            initialBoard : board
        },
    });
    console.log(data,board)
    eventTarget.dispatchEvent(event);

}

// Start the global timer
function startGlobalTimer(intervalTime) {
    changeWinrateChart(globalTimer.move);
    globalTimer.interval = setInterval(() => {
        globalTimer.step += 1;

        if (globalTimer.step >= globalTimer.maxSteps) {
            globalTimer.step = 0;
            globalTimer.move += 1;
            changeWinrateChart(globalTimer.move);
            if (globalTimer.move >= globalTimer.maxMoves) {
                clearInterval(globalTimer.interval);
                console.log("Timer stopped: Maximum moves reached.");
                return;
            }
        }

        triggerGlobalTimerChangeEvent();
    }, intervalTime);
}



// Stop the timer
function stopGlobalTimer() {
    if (globalTimer.interval) {
        clearInterval(globalTimer.interval);
        globalTimer.interval = null;
    }
}

// Resume the timer
function resumeGlobalTimer() {
    globalTimer.isPaused = false;
    startGlobalTimer(interval);
}

// Set move and step
function setMoveAndStep(move, step) {
    stopGlobalTimer();
    globalTimer.move = Math.min(Math.max(0, move), globalTimer.maxMoves - 1); // Clamp move to valid range
    globalTimer.step = Math.min(Math.max(0, step), globalTimer.maxSteps - 1); // Clamp step to valid range
    triggerGlobalTimerChangeEvent();
    changeWinrateChart(globalTimer.move);
}

// Move to the previous move
function previousMove() {
    stopGlobalTimer();
    if (globalTimer.move > 0) {
        globalTimer.move -= 1;
        globalTimer.step = 0; // Reset step to 0 for new move
        triggerGlobalTimerChangeEvent();
    }
    changeWinrateChart(globalTimer.move);
}

// Move to the next move
function nextMove() {
    stopGlobalTimer();
    if (globalTimer.move < globalTimer.maxMoves - 1) {
        globalTimer.move += 1;
        globalTimer.step = 0; // Reset step to 0 for new move
        triggerGlobalTimerChangeEvent();
    }
    changeWinrateChart(globalTimer.move);
}

// Move to the previous step
function previousStep() {
    stopGlobalTimer();
    if (globalTimer.step > 0) {
        globalTimer.step -= 1;
    } else if (globalTimer.move > 0) {
        globalTimer.move -= 1;
        globalTimer.step = globalTimer.maxSteps - 1; // Move to the last step of the previous move
    }
    triggerGlobalTimerChangeEvent();
    changeWinrateChart(globalTimer.move);
}

// Move to the next step
function nextStep() {
    stopGlobalTimer();
    if (globalTimer.step < globalTimer.maxSteps - 1) {
        globalTimer.step += 1;
    } else if (globalTimer.move < globalTimer.maxMoves - 1) {
        globalTimer.move += 1;
        globalTimer.step = 0; // Move to the first step of the next move
    }
    triggerGlobalTimerChangeEvent();
    changeWinrateChart(globalTimer.move);
}



// Start the timer with 1-second intervals
startGlobalTimer(interval);