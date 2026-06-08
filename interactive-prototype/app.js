// Zenith Prototyping Studio & Usability Test Console - Interaction Script

// 1. Initial State Variables
let activeStudySession = false;
let studyStartTime = null;
let studyTimerInterval = null;
let misclickCount = 0;
let currentTaskIndex = 0; // Tasks: 0 to 3
let currentOnboardingSlide = 0;
let showHotspotsActive = false;
let transitionSpeed = 400; // milliseconds

let currentScreenId = "screen-splash";
const screenHistory = [];

// Onboarding titles & copy array
const onboardingSlides = [
    {
        title: "Maximize Your Returns",
        body: "Zenith Wealth utilizes machine intelligence to reallocate your portfolio dynamically for optimal growth."
    },
    {
        title: "Global Stock Search",
        body: "Instantly trade top equities across US, European, and Asian indices with fractional shares starting at $1."
    },
    {
        title: "Advanced Usability",
        body: "A clean dashboard built to minimize cognitive strain and prioritize rapid information accessibility."
    }
];

// Tasks checklist guidelines
const tasks = [
    {
        title: "Task 1: Complete Onboarding & Start App",
        desc: "Review onboarding slides, advance through the carousel, and click the final 'Get Started' button to load the authentication screen.",
        successAction: "onboarding-next",
        targetScreen: "screen-login"
    },
    {
        title: "Task 2: Enter Password & Sign In",
        desc: "Type a security code (e.g. '1234') in the account security code box and click the 'Login Securely' action button to enter the main dashboard.",
        successAction: "login",
        targetScreen: "screen-dashboard"
    },
    {
        title: "Task 3: Locate Apple (AAPL) Stock",
        desc: "Find the Apple Inc (AAPL) stock listing inside the market watchlist and click it to open the asset statistics page.",
        successAction: "stock-detail",
        targetScreen: "screen-stock-details"
    },
    {
        title: "Task 4: Confirm Buy Order",
        desc: "Click 'Buy Apple Shares', input a trade amount (e.g., $100), click 'Execute Buy Order', and then select 'Return to Dashboard' to settle the order.",
        successAction: "complete",
        targetScreen: "screen-dashboard"
    }
];

// 2. Auto-run Splash Loader on boot
document.addEventListener("DOMContentLoaded", () => {
    runSplashLoader();
});

function runSplashLoader() {
    const loaderBar = document.querySelector(".splash-loading-bar");
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += 4;
        if (loaderBar) loaderBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                navigateToScreen("screen-onboarding", "fade");
                logSystemEvent("App splash screen auto-loaded onboarding slides.", "system");
            }, 300);
        }
    }, 60);
}

// 3. Prototyping Screen Navigation Engine
function navigateToScreen(targetScreenId, transitionType = "slide-left") {
    const currentScreen = document.getElementById(currentScreenId);
    const targetScreen = document.getElementById(targetScreenId);

    if (!targetScreen || currentScreenId === targetScreenId) return;

    // Save history
    screenHistory.push(currentScreenId);

    // Apply Transition classes
    currentScreen.className = "prototype-screen";
    targetScreen.className = "prototype-screen active-screen";

    // Speed setting
    const speedClass = getSpeedClassName();

    if (transitionType === "slide-left") {
        currentScreen.classList.add("slide-out-left", speedClass);
        targetScreen.classList.add("slide-in-right", speedClass);
    } else if (transitionType === "slide-right") {
        currentScreen.classList.add("slide-out-right", speedClass);
        targetScreen.classList.add("slide-in-left", speedClass);
    } else if (transitionType === "fade") {
        targetScreen.classList.add("fade-in-screen", speedClass);
    }

    // Update screen tracking
    currentScreenId = targetScreenId;

    // Reset transition animation cleanups
    setTimeout(() => {
        // Clear animation classes
        const screens = document.querySelectorAll(".prototype-screen");
        screens.forEach(scr => {
            scr.classList.remove("slide-in-right", "slide-out-left", "slide-in-left", "slide-out-right", "fade-in-screen", "speed-normal", "speed-fast", "speed-slow");
        });
    }, transitionSpeed);

    logSystemEvent(`Navigated screen: #${targetScreenId}`, "system");
}

function getSpeedClassName() {
    const selectVal = document.getElementById("speed-select").value;
    if (selectVal === "fast") return "speed-fast";
    if (selectVal === "slow") return "speed-slow";
    return "speed-normal";
}

function updateTransitionSpeed(val) {
    if (val === "fast") transitionSpeed = 200;
    else if (val === "slow") transitionSpeed = 800;
    else transitionSpeed = 400;

    logSystemEvent(`Transition speed modified to: ${transitionSpeed}ms`, "system");
}

// 4. Onboarding slide carousel controls
function setOnboardingSlide(slideIndex) {
    currentOnboardingSlide = slideIndex;
    const titleText = document.getElementById("onboarding-title");
    const bodyText = document.getElementById("onboarding-body");
    const dots = document.querySelectorAll(".carousel-dots .dot");
    const nextBtn = document.getElementById("hotspot-onboarding-next");

    // Update carousel content text
    titleText.textContent = onboardingSlides[slideIndex].title;
    bodyText.textContent = onboardingSlides[slideIndex].body;

    // Update carousel slider dots
    dots.forEach((dot, idx) => {
        dot.className = idx === slideIndex ? "dot active" : "dot";
    });

    // Update Next button action labels
    if (slideIndex === 2) {
        nextBtn.textContent = "Get Started";
        nextBtn.setAttribute("data-flow-step", "onboarding-next");
    } else {
        nextBtn.textContent = "Next";
        nextBtn.setAttribute("data-flow-step", "carousel-slide");
    }

    logSystemEvent(`Onboarding slide set to index: ${slideIndex}`, "system");
}

function advanceOnboarding() {
    if (currentOnboardingSlide < 2) {
        setOnboardingSlide(currentOnboardingSlide + 1);
    } else {
        // Successful task navigation
        validateUserFlowStep("onboarding-next");
        navigateToScreen("screen-login", "slide-left");
    }
}

// 5. Auth / Login forms
function handleLoginSubmit(event) {
    event.preventDefault();
    const pwdInput = document.getElementById("login-pwd");

    if (!pwdInput.value.trim()) {
        logSystemEvent("[Auth Error] Empty passcode block submitted.", "error");
        alert("Please enter any passcode (e.g. 1234) to advance the login prototype.");
        return;
    }

    // Success login flow
    validateUserFlowStep("login");
    navigateToScreen("screen-dashboard", "slide-left");
}

// 6. Navigation Actions inside Dashboard
function navigateToDashboardSubTab(tab) {
    logSystemEvent(`Dashboard tab click: ${tab}`, "system");
    
    if (tab === "markets") {
        validateUserFlowStep("nav-markets");
        // For simulation purposes, markets opens stock directly or sets state
        logSystemEvent("Opened market directory list.", "system");
    }
}

function openStockDetail(ticker) {
    logSystemEvent(`Selected stock details: ${ticker}`, "system");
    
    if (ticker === "AAPL") {
        validateUserFlowStep("stock-detail");
        navigateToScreen("screen-stock-details", "slide-left");
    } else {
        alert(`Interactive flow only preloaded for Apple (AAPL). Please select AAPL to perform the usability study task.`);
    }
}

function goBackToDashboard() {
    navigateToScreen("screen-dashboard", "slide-right");
}

function openOrderModal() {
    validateUserFlowStep("buy-amount");
    navigateToScreen("screen-buy-form", "slide-left");
}

function goBackToStockDetails() {
    navigateToScreen("screen-stock-details", "slide-right");
}

function executeBuyOrder() {
    const buyInput = document.getElementById("buy-amount-input");
    const amount = parseFloat(buyInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid stock purchase amount.");
        return;
    }

    // Complete transaction flow
    document.getElementById("receipt-total-amt").textContent = `$${amount.toFixed(2)} USD`;
    validateUserFlowStep("order-success");
    navigateToScreen("screen-success", "fade");
}

function finalizeStudyFlow() {
    validateUserFlowStep("complete");
    // Return to clean dashboard state
    navigateToScreen("screen-dashboard", "slide-right");
}

// 7. Usability Study & Testing Console Engine
function toggleStudySession() {
    const controlBtn = document.getElementById("study-control-btn");
    const resetBtn = document.getElementById("study-reset-btn");
    const statusText = document.getElementById("session-status-text");

    if (!activeStudySession) {
        // Start study session
        activeStudySession = true;
        studyStartTime = Date.now();
        misclickCount = 0;
        currentTaskIndex = 0;

        // Reset UI stats
        document.getElementById("misclick-display").textContent = "0";
        document.getElementById("progress-display").textContent = "0/4";
        document.getElementById("timer-display").textContent = "00:00.0";
        
        // Reset checklist checkmarks
        const items = document.querySelectorAll(".task-checklist .checklist-item");
        items.forEach(item => item.classList.remove("task-completed"));

        // Setup timer interval
        studyTimerInterval = setInterval(updateStopwatchDisplay, 100);

        // Update active task panel
        updateActiveTaskCard();

        // Update button states
        controlBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" class="btn-icon"><rect x="4" y="4" width="16" height="16"></rect></svg>
            Stop Study Session
        `;
        controlBtn.className = "action-btn-primary text-danger";
        resetBtn.disabled = false;
        
        statusText.textContent = "Study Mode: Recording...";
        statusText.className = "session-badge active";

        // Reset phone prototype to Onboarding screen
        resetPrototypeToStart();

        logSystemEvent("=== Usability Study Session Started ===", "system");
        logSystemEvent("Initial task instructions loaded into checklist panel.", "system");

    } else {
        // Stop study session
        stopStudyTimer();
        activeStudySession = false;

        controlBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" class="btn-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Start Testing Session
        `;
        controlBtn.className = "action-btn-primary";
        
        statusText.textContent = "Study Mode: Idle";
        statusText.className = "session-badge idle";

        logSystemEvent("=== Usability Study Session Interrupted ===", "error");
    }
}

function stopStudyTimer() {
    if (studyTimerInterval) {
        clearInterval(studyTimerInterval);
    }
}

function resetStudySession() {
    stopStudyTimer();
    activeStudySession = false;
    misclickCount = 0;
    currentTaskIndex = 0;

    document.getElementById("timer-display").textContent = "00:00.0";
    document.getElementById("misclick-display").textContent = "0";
    document.getElementById("progress-display").textContent = "0/4";

    const items = document.querySelectorAll(".task-checklist .checklist-item");
    items.forEach(item => item.classList.remove("task-completed"));

    const controlBtn = document.getElementById("study-control-btn");
    controlBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" class="btn-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Start Testing Session
    `;
    controlBtn.className = "action-btn-primary";

    const statusText = document.getElementById("session-status-text");
    statusText.textContent = "Study Mode: Idle";
    statusText.className = "session-badge idle";

    const taskCard = document.getElementById("active-task-card");
    taskCard.className = "task-card-active";
    taskCard.innerHTML = `<p class="task-placeholder-text">Session not started. Click "Start Testing Session" to initialize participant task checklist.</p>`;

    resetPrototypeToStart();
    document.getElementById("study-reset-btn").disabled = true;

    logSystemEvent("Usability Study Session hard-reset. Stats cleared.", "system");
}

function resetPrototypeToStart() {
    // Hide screens, show splash then onboarding
    const screens = document.querySelectorAll(".prototype-screen");
    screens.forEach(s => s.classList.remove("active-screen"));
    
    const onboarding = document.getElementById("screen-onboarding");
    if (onboarding) {
        onboarding.classList.add("active-screen");
        currentScreenId = "screen-onboarding";
        setOnboardingSlide(0);
    }
}

// Stopwatch calculations
function updateStopwatchDisplay() {
    const elapsed = Date.now() - studyStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const tenths = Math.floor((elapsed % 1000) / 100);

    const minStr = String(minutes).padStart(2, "0");
    const secStr = String(seconds).padStart(2, "0");
    
    document.getElementById("timer-display").textContent = `${minStr}:${secStr}.${tenths}`;
}

// Update Active Task Instruction Card display
function updateActiveTaskCard() {
    const card = document.getElementById("active-task-card");
    
    if (currentTaskIndex < tasks.length) {
        const activeTask = tasks[currentTaskIndex];
        card.innerHTML = `
            <div style="font-weight: 700; color: #8B5CF6; margin-bottom: 4px;">${activeTask.title}</div>
            <p>${activeTask.desc}</p>
        `;
    } else {
        // Study Completed
        card.className = "task-card-active study-complete-theme";
        card.innerHTML = `
            <div style="font-weight: 700; color: var(--color-success); margin-bottom: 4px;">🎉 Study Completed!</div>
            <p>Participant completed all navigational checkpoints successfully. Logs and durations have been written to files.</p>
        `;
    }
}

// Action validator checking user interactions
function validateUserFlowStep(actionStep) {
    if (!activeStudySession) return;

    const currentTask = tasks[currentTaskIndex];
    
    if (currentTask && currentTask.successAction === actionStep) {
        // Mark checklist task active checklist item as finished
        const taskItem = document.getElementById(`task-item-${currentTaskIndex + 1}`);
        if (taskItem) taskItem.classList.add("task-completed");

        logSystemEvent(`[Success] Completed ${currentTask.title} in ${document.getElementById("timer-display").textContent}s.`, "success");

        // Go to next task
        currentTaskIndex++;
        document.getElementById("progress-display").textContent = `${currentTaskIndex}/4`;
        
        updateActiveTaskCard();

        if (currentTaskIndex >= tasks.length) {
            // Overall success
            stopStudyTimer();
            activeStudySession = false;
            
            const elapsed = Date.now() - studyStartTime;
            const finalTimeSec = (elapsed / 1000).toFixed(1);
            
            logSystemEvent(`🏆 SUCCESS! Usability study completed successfully in ${finalTimeSec}s with ${misclickCount} misclicks.`, "success");
            
            // Add user record to panel
            addNewParticipantRecord(finalTimeSec, misclickCount);
            
            // Re-label buttons
            const statusText = document.getElementById("session-status-text");
            statusText.textContent = "Study Mode: Finished";
            statusText.className = "session-badge idle";

            const controlBtn = document.getElementById("study-control-btn");
            controlBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" class="btn-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Start Testing Session
            `;
            controlBtn.className = "action-btn-primary";
        }
    }
}

// Click recorder tracking hotspots misses
function recordViewportClick(event) {
    // If hotspots display checked
    const toggleHotspotsCheckbox = document.getElementById("toggle-hotspots");
    const viewport = document.getElementById("viewport-container");

    // Check if target is a hotspot target
    let target = event.target;
    let isHotspot = false;

    // Search up parent tree to see if inside simulated hotspot buttons
    while (target && target !== viewport) {
        if (target.classList.contains("hotspot-target") || target.tagName === "BUTTON" || target.onclick) {
            isHotspot = true;
            break;
        }
        target = target.parentNode;
    }

    // Record Click coordinates
    const rect = viewport.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    if (isHotspot) {
        logSystemEvent(`Target click registered at coords (${x}px, ${y}px)`, "system");
    } else {
        if (activeStudySession) {
            // Misclick counted!
            misclickCount++;
            document.getElementById("misclick-display").textContent = misclickCount;
            
            // Flash simulated screen red for visual validation of misclick
            flashScreenError();
            
            logSystemEvent(`[Friction] Participant click missed target hotspot at (${x}px, ${y}px).`, "error");
        } else {
            logSystemEvent(`Click recorded outside active hotspots at (${x}px, ${y}px)`, "system");
        }
    }
}

function flashScreenError() {
    const screen = document.getElementById(currentScreenId);
    if (screen) {
        screen.style.transition = "none";
        screen.style.boxShadow = "inset 0 0 20px rgba(239, 68, 68, 0.4)";
        setTimeout(() => {
            screen.style.transition = "box-shadow 0.3s ease";
            screen.style.boxShadow = "none";
        }, 100);
    }
}

function toggleHotspots(checked) {
    showHotspotsActive = checked;
    const device = document.getElementById("simulated-device");
    if (checked) {
        device.classList.add("hotspots-active");
        logSystemEvent("Interactive hotspots visual overlay enabled.", "system");
    } else {
        device.classList.remove("hotspots-active");
        logSystemEvent("Interactive hotspots visual overlay disabled.", "system");
    }
}

// 8. Dynamic Log Streams to the Studio UI
function logSystemEvent(message, type = "system") {
    const list = document.getElementById("event-logs-list");
    if (!list) return;

    // Remove placeholder
    const placeholder = list.querySelector(".log-placeholder");
    if (placeholder) placeholder.remove();

    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    
    entry.className = "log-entry";
    if (type === "success") entry.classList.add("log-success");
    else if (type === "error") entry.classList.add("log-error");
    else if (type === "system") entry.classList.add("log-system");

    entry.textContent = `[${timestamp}] ${message}`;

    list.appendChild(entry);
    list.scrollTop = list.scrollHeight;
}

function clearEventLogs() {
    const list = document.getElementById("event-logs-list");
    if (list) {
        list.innerHTML = `<p class="log-placeholder">Log is empty. Start a session and click elements inside the device to capture metrics.</p>`;
    }
}

// Add User testing record row
function addNewParticipantRecord(timeSec, errors) {
    const historyList = document.getElementById("participant-history-list");
    if (!historyList) return;

    const recordCount = historyList.querySelectorAll(".participant-row").length + 1;
    const newRow = document.createElement("div");
    newRow.className = "participant-row";
    
    newRow.innerHTML = `
        <div class="part-avatar">#${recordCount}</div>
        <div class="part-info">
            <span class="part-name">Participant #${recordCount} (Self Test)</span>
            <span class="part-meta">TTC: ${timeSec}s &bull; Misclicks: ${errors}</span>
        </div>
        <span class="badge-success">Pass</span>
    `;

    historyList.appendChild(newRow);
}

// 9. Observer/Coordinator feedback logger
function saveCoordinatorNotes(event) {
    event.preventDefault();
    const input = document.getElementById("coordinator-notes-input");
    const noteText = input.value.trim();

    if (!noteText) return;

    logSystemEvent(`[Note Added] "${noteText}"`, "system");
    input.value = "";
    
    alert("Coordinator note recorded to live study log session. Thank you!");
}
