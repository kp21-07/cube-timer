let startTime, running = false, interval;
let scramble = generateScramble();

let keyDownTime = 0;
let spaceHeldEnough = false;
let waitTime = 300;

// --- Theme Management Variables and Preset Definitions ---

// Get all relevant DOM elements
const body = document.body;
const themeSelector = document.getElementById("themeSelector");
const textColorPicker = document.getElementById("textColorPicker");
const backgroundColorPicker = document.getElementById("backgroundColorPicker");
const accentColorPicker = document.getElementById("accentColorPicker");
const highlightColorPicker = document.getElementById("highlightColorPicker");
const errorColorPicker = document.getElementById("errorColorPicker");
const successColorPicker = document.getElementById("successColorPicker");

const presetThemes = {
    "light": {
        textColor: "#111111",
        bgColor: "#ffffff",
        accentColor: "#007bff",
        highlightColor: "#e0f0ff",
        errorColor: "#d9534f",
        successColor: "#5cb85c"
    },
    "dark": {
        textColor: "#e0e0e0",
        bgColor: "#121212",
        accentColor: "#00bcd4",
        highlightColor: "#1f2a30",
        errorColor: "#ff6b6b",
        successColor: "#81c784"
    },
    "solarized-light": {
        textColor: "hsl(196, 13%, 25%)",
        bgColor: "#fdf6e3",
        accentColor: "#268bd2",
        highlightColor: "#eee8d5",
        errorColor: "#dc322f",
        successColor: "#859900"
    },
    "solarized-dark": {
        textColor: "hsl(179, 28%, 51%)",
        bgColor: "hsl(192, 100%, 17%)",
        accentColor: "#b58900",
        highlightColor: "#748f9862",
        errorColor: "#dc322f",
        successColor: "#859900"
    },
    "cyan-orange": {
        textColor: "#00bcd4",
        bgColor: "#121212",
        accentColor: "#ff9600",
        highlightColor: "#1f2a30",
        errorColor: "#ff6b6b",
        successColor: "#81c784"
    },
};

// --- Get the new toggle button and the wrapper for theme controls ---
const toggleThemeControlsBtn = document.getElementById("toggleThemeControlsBtn");
const themeControlsWrapper = document.getElementById("theme-controls-wrapper");


// --- Helper Function to apply inline styles (for custom theme) ---
function applyInlineColors(colors) {
    body.style.setProperty("--text-color", colors.textColor);
    body.style.setProperty("--bg-color", colors.bgColor);
    body.style.setProperty("--accent-color", colors.accentColor);
    body.style.setProperty("--highlight-color", colors.highlightColor);
    body.style.setProperty("--error-color", colors.errorColor);
    body.style.setProperty("--success-color", colors.successColor);
}

// --- Function to remove preset classes and inline styles ---
function clearPresetClasses() {
    for (const themeName in presetThemes) {
        body.classList.remove(themeName);
    }
    // Clear all inline styles from the body, ensuring custom colors are gone when switching to preset
    body.removeAttribute('style');
}

// --- Function to apply a preset theme ---
function applyPresetTheme(themeName) {
    clearPresetClasses(); // Remove any existing theme classes or inline styles

    if (presetThemes[themeName]) {
        body.classList.add(themeName); // Add the new preset class
        // Update color pickers to reflect the preset's colors
        const theme = presetThemes[themeName];
        if (textColorPicker) textColorPicker.value = theme.textColor;
        if (backgroundColorPicker) backgroundColorPicker.value = theme.bgColor;
        if (accentColorPicker) accentColorPicker.value = theme.accentColor;
        if (highlightColorPicker) highlightColorPicker.value = theme.highlightColor;
        if (errorColorPicker) errorColorPicker.value = theme.errorColor;
        if (successColorPicker) successColorPicker.value = theme.successColor;

        // Save the active theme name
        localStorage.setItem("activeTheme", themeName);
        // Clear individual custom colors from localStorage when a preset is selected
        localStorage.removeItem("customTextColor");
        localStorage.removeItem("customBgColor");
        localStorage.removeItem("customAccentColor");

        console.log(`Applied preset theme: ${themeName}`);
    } else if (themeName === "custom") {
        // If "custom" is selected from the dropdown, try to load saved custom colors
        loadCustomTheme();
    }
}

// --- Function to load and apply custom theme ---
function loadCustomTheme() {
    console.log("Loading custom theme...");
    clearPresetClasses(); // Remove any preset classes

    const customTextColor = localStorage.getItem("customTextColor");
    const customBgColor = localStorage.getItem("customBgColor");
    const customAccentColor = localStorage.getItem("customAccentColor");
    const customHighlightColor = localStorage.getItem("customHighlightColor");
    const customErrorColor = localStorage.getItem("customErrorColor");
    const customSuccessColor = localStorage.getItem("customSuccessColor");

    // Use saved custom colors, or fall back to the default preset's colors if not saved
    // This provides a starting point for custom if no custom colors were set yet
    const initialTheme = presetThemes["light"]; // Or any other default preset for fallback
    const finalColors = {
        textColor: customTextColor || initialTheme.textColor,
        bgColor: customBgColor || initialTheme.bgColor,
        accentColor: customAccentColor || initialTheme.accentColor,
        highlightColor: customHighlightColor || initialTheme.highlightColor,
        errorColor: customErrorColor || initialTheme.errorColor,
        successColor: customSuccessColor || initialTheme.successColor};

    applyInlineColors(finalColors); // Apply colors directly as inline styles

    // Update color pickers
    if (textColorPicker) textColorPicker.value = finalColors.textColor;
    if (backgroundColorPicker) backgroundColorPicker.value = finalColors.bgColor;
    if (accentColorPicker) accentColorPicker.value = finalColors.accentColor;
    if (highlightColorPicker) highlightColorPicker.value = finalColors.highlightColor;
    if (errorColorPicker) errorColorPicker.value = finalColors.errorColor;
    if (successColorPicker) successColorPicker.value = finalColors.successColor;

    localStorage.setItem("activeTheme", "custom"); // Ensure active theme is "custom"
    if (themeSelector) themeSelector.value = "custom"; // Set dropdown
    console.log("Custom theme loaded.");
}

// --- Functions for individual color picker updates (for "custom" mode) ---
function updateTextColor(event) {
    const color = event.target.value;
    body.style.setProperty("--text-color", color);
    localStorage.setItem("customTextColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom text color updated to:", color);
}   

function updateBackgroundColor(event) {
    const color = event.target.value;
    body.style.setProperty("--bg-color", color);
    localStorage.setItem("customBgColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom background color updated to:", color);
}

function updateAccentColor(event) {
    const color = event.target.value;
    body.style.setProperty("--accent-color", color);
    localStorage.setItem("customAccentColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom accent color updated to:", color);
}
function updateHighlightColor(event) {
    const color = event.target.value;
    body.style.setProperty("--highlight-color", color);
    localStorage.setItem("customHighlightColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom highlight color updated to:", color);
}   
function updateErrorColor(event) {
    const color = event.target.value;
    body.style.setProperty("--error-color", color);
    localStorage.setItem("customErrorColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom error color updated to:", color);
}
function updateSuccessColor(event) {
    const color = event.target.value;
    body.style.setProperty("--success-color", color);
    localStorage.setItem("customSuccessColor", color);
    localStorage.setItem("activeTheme", "custom"); // Mark as custom
    if (themeSelector) themeSelector.value = "custom"; // Update dropdown
    console.log("Custom success color updated to:", color);
}


// --- Initialization on Window Load ---
window.onload = () => {
    console.log("Window loaded. Initializing themes and timer.");

    // 1. Populate Theme Selector Dropdown
    if (themeSelector) {
        for (const themeName in presetThemes) {
            const option = document.createElement("option");
            option.value = themeName;
            option.textContent = themeName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            themeSelector.appendChild(option);
        }
        const customOption = document.createElement("option");
        customOption.value = "custom";
        customOption.textContent = "Custom Colors";
        themeSelector.appendChild(customOption);
    }

    // 2. Load the active theme based on localStorage
    const activeTheme = localStorage.getItem("activeTheme");
    console.log("Found active theme in localStorage:", activeTheme);

    if (activeTheme === "custom") {
        loadCustomTheme();
    } else if (activeTheme && presetThemes[activeTheme]) {
        applyPresetTheme(activeTheme);
    } else {
        console.log("No valid theme found, defaulting to 'light'.");
        applyPresetTheme("light");
    }

    // 3. Set the dropdown to the active theme
    if (themeSelector) themeSelector.value = localStorage.getItem("activeTheme") || "light";


    // 4. Attach Event Listeners for theme controls and the new toggle button
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            applyPresetTheme(selectedTheme);
        });
    }

    if (textColorPicker) textColorPicker.addEventListener('input', updateTextColor);
    if (backgroundColorPicker) backgroundColorPicker.addEventListener('input', updateBackgroundColor);
    if (accentColorPicker) accentColorPicker.addEventListener('input', updateAccentColor);
    if (highlightColorPicker) highlightColorPicker.addEventListener('input', updateHighlightColor);
    if (errorColorPicker) errorColorPicker.addEventListener('input', updateErrorColor);
    if (successColorPicker) successColorPicker.addEventListener('input', updateSuccessColor);

    // --- NEW: Event listener for the toggle button ---
    if (toggleThemeControlsBtn && themeControlsWrapper) {
        toggleThemeControlsBtn.addEventListener('click', () => {
            themeControlsWrapper.classList.toggle('show');
            // Optional: Hide the controls if user clicks outside of them
            // You might need a more complex click-outside handler if you want this
        });
    }

    updateHistory(); // Initial call to populate history on load
};

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