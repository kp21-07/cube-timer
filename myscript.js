let startTime, running = false, interval;
let scramble = generateScramble();

let keyDownTime = 0;
let spaceHeldEnough = false;
let waitTime = 300;

// THEME CHANGE
function applyTheme(themeName) {
    document.body.className = themeName; // Overwrites previous class
    localStorage.setItem("theme", themeName);
}

document.getElementById("theme-selector").addEventListener("change", (e) => {
    applyTheme(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const Ao5 = localStorage.getItem("last-ao5") || "--:--"
    applyTheme(savedTheme);
    document.getElementById("theme-selector").value = savedTheme;
    document.getElementById("ao5-label").innerHTML = `Ao5 : <span style = "font-size: 3rem; color: var(--accent-color);">${Ao5}</span>`;
});

//HANDLING TIMER_START/STOP
// Handle key press (start timing hold)
document.body.addEventListener("keydown", (e) => {
// if (document.activeElement.tagName === "SELECT") return;
if (e.code === "Space" && !running && keyDownTime === 0) {
    e.preventDefault();
    keyDownTime = Date.now();
    // Check after {waitTime}ms if still holding

    const timerDisplay = document.getElementById("timer");
    timerDisplay.classList.add("not-ready");
    timerDisplay.classList.remove("ready");

    setTimeout(() => {
        if (keyDownTime !== 0) {
            spaceHeldEnough = true;
            timerDisplay.classList.remove("not-ready");
            timerDisplay.classList.add("ready");
        }
    }, waitTime);
}
});

// Handle key release (start or stop timer)
document.body.addEventListener("keyup", (e) => {
if (e.code === "Space") {
    e.preventDefault();
    const holdTime = Date.now() - keyDownTime;

    const timerDisplay = document.getElementById("timer");

    if (running) {
        stopTimer();
    } else if (spaceHeldEnough && holdTime >= waitTime) {
        startTimer();
    }

    // Reset for next press
    keyDownTime = 0;
    spaceHeldEnough = false;
    timerDisplay.classList.remove("ready", "not-ready");
}
});

function formatTime(ms, short = false) {
    const min = Math.floor(ms/60000)
    const sec = Math.floor((ms%60000)/1000);
    const milli = ms % 1000;

    const paddedSec = min > 0 ? String(sec).padStart(2, '0') : sec;
    const paddedMilli = String(milli).padStart(3, '0');
    if (short) {
        return min > 0 
            ? `${min}:${paddedSec}.${paddedMilli[0]}` 
            : `${paddedSec}.${paddedMilli[0]}`;
    } else {
        return min > 0 
            ? `${min}:${paddedSec}.${paddedMilli}` 
            : `${paddedSec}.${paddedMilli}`;
    }
    
}

function startTimer() {
    running = true;
    startTime = Date.now();
    interval = setInterval(() => {
        const parts = formatTime((Date.now() - startTime), true).split(".");
        document.getElementById("timer").innerHTML = `${parts[0]}.<span class="millis">${parts[1]}</span>`;
    }, 10);
}

function stopTimer() {
    running = false;
    clearInterval(interval);
    const finalTime = formatTime(Date.now()-startTime);
    const parts = finalTime.split(".");
    document.getElementById("timer").innerHTML = `${parts[0]}.<span class="millis">${parts[1]}</span>`;
    saveSolve(finalTime);
}

// SCRAMBLE GENERATOR
function generateScramble() {
    const n = parseInt(localStorage.getItem("selectedCube") || "3");
    // console.log(n);
    let moves, scramLength;
    if (n === 3) {
        moves = ["R", "L", "U", "D", "F", "B"];
        scramLength = 20;
    } else if (n === 2) {
        moves = ["R", "U", "F"];
        scramLength = 10;
    } else if (n === 4) {
        moves = ["R", "L", "U", "D", "F", "B", "Rw", "Fw", "Uw"];
        scramLength = 45;
    }
    
    const modifiers = ["", "'", "2"];
    let scramble = "", lastMove = "";

    while (scramble.split(" ").length < scramLength) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    if ((move === lastMove) || (move === lastMove + "'") || (move === lastMove + "2")) continue;
    lastMove = move;
    scramble += move + modifiers[Math.floor(Math.random() * 3)] + " ";
    }

    scramble = scramble.trim();
    document.getElementById("scramble").textContent = scramble;
    return scramble;
}

function handleCubeChange(value) {
    localStorage.setItem("selectedCube", value);
    const scrambleEl = document.getElementById("scramble");
    if (value === "4") {
        scrambleEl.style.fontSize = "1.6rem"; // Smaller font for 2x2
    } else if (value === "2") {
        scrambleEl.style.fontSize = "2.4rem"; // Default for 3x3
    } else {
        scrambleEl.style.fontSize = "1.8rem"; // Fallback
    }
    scramble = generateScramble();
}

// Calculating Ao5
function getMillisecondsFromTimeString(timeStr) {
    const [main, millisStr] = timeStr.split(".");
    const millis = parseInt((millisStr || "000").padEnd(3, "0"));

    const parts = main.split(":").map(Number);
    if (parts.length === 2) {
        // mm:ss
        return (parts[0] * 60 + parts[1]) * 1000 + millis;
    } else {
        // ss
        return parts[0] * 1000 + millis;
    }
}

function calculateAo5(index) {
    const solves = JSON.parse(localStorage.getItem("solves")) || [];
    if (index < 4) return "--:--"; // Or return null / show warning

    // Get last 5 solve times
    let last5 = solves.slice(index-4, index+1).map(s => getMillisecondsFromTimeString(s.time));
    // Sort and remove best and worst
    const sorted = [...last5].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, 4); // drop lowest and highest

    const averageMs = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const Ao5 = formatTime(Math.round(averageMs));
    return Ao5; // Use your formatTime function
}

// SAVING SOLVES
function saveSolve(finalTime) {
    const time = finalTime || document.getElementById("timer").textContent;
    // const note = document.getElementById("note").value.trim();
    const note = "";
    const ao5 = "";
    const solve = { time, ao5, scramble, note };

    let solves = JSON.parse(localStorage.getItem("solves")) || [];
    solves.push(solve);
    localStorage.setItem("solves", JSON.stringify(solves));

    updateHistory();
    scramble = generateScramble();
    // document.getElementById("note").value = "";
    // document.getElementById("timer").textContent = "0.00";
}

// UPDATES
function updateHistory() {
    const solves = JSON.parse(localStorage.getItem("solves")) || [];
    const table = document.getElementById("history");
    table.innerHTML = "<tr><th>#</th><th>Time(s)</th><th>Ao5</th><th>Scramble</th><th>Note</th></tr>";
    solves.slice().reverse().forEach((s, i) => {
        const index = solves.length - 1 - i;
        s.ao5 = calculateAo5(index)
        table.innerHTML += `
            <tr>
                <td>${solves.length - i}</td>
                <td>${s.time}</td>
                <td>${s.ao5}</td>
                <td>${s.scramble}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input 
                        type="text" 
                        value="${s.note}" 
                        data-index="${index}" 
                        onblur="updateNote(this)"
                        placeholder="Click to add note"
                        style="background-color: var(--bg-color); color: var(--text-color); border: none; width: 95%; padding: 4px;"
                        >
                        <button onclick="deleteSolve(${index})" title="Delete Solve"
                                style="color: var(--text-color); border: none; background: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
    const Ao5 = solves.slice().reverse()[0]?.ao5 || "--:--";
    localStorage.setItem("last-ao5", Ao5);
    document.getElementById("ao5-label").innerHTML = `Ao5 : <span style = "font-size: 3rem; color: var(--accent-color);">${Ao5}</span>`;
}

function updateNote(input, index) {
//   const index = parseInt(input.dataset.index);
    const newNote = input.value.trim();

    let solves = JSON.parse(localStorage.getItem("solves")) || [];
    solves[index].note = newNote;
    localStorage.setItem("solves", JSON.stringify(solves));
}

function deleteSolve(index) {
    if (confirm(`Delete this solve (#${index+1})?`)) {
    let solves = JSON.parse(localStorage.getItem("solves")) || [];
    solves.splice(index, 1); // Remove 1 item at the specified index
    localStorage.setItem("solves", JSON.stringify(solves));
    updateHistory(); // Refresh table
    }
}

function clearSolves() {
    const confirmClear = confirm("Are you sure you want to delete all solves?");
    if (confirmClear) {
    localStorage.removeItem("solves");  // Delete from storage
    updateHistory();                    // Refresh table
    document.getElementById("timer").innerHTML = `0.<span class="millis">00</span>`;
    }
    localStorage.setItem("last-ao5", "--:--");
    document.getElementById("ao5-label").innerHTML = `Ao5 : <span style = "font-size: 3rem; color: var(--accent-color);">--:--</span>`;
}

window.onload = updateHistory;