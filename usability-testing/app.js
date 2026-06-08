// Zenith Usability Testing Hub - Calculator & Interactions Script

// 1. Tab Navigation Controller
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active-content');
    });

    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const targetContent = document.getElementById(`content-${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active-content');
    }

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 2. Interactive System Usability Scale (SUS) Calculator
document.addEventListener("DOMContentLoaded", () => {
    const surveyForm = document.getElementById("sus-survey-form");
    if (surveyForm) {
        // Register change listeners on all radio buttons
        const radioButtons = surveyForm.querySelectorAll("input[type='radio']");
        radioButtons.forEach(radio => {
            radio.addEventListener("change", calculateSUSRating);
        });
        
        // Initial run
        calculateSUSRating();
    }
});

function calculateSUSRating() {
    let oddSum = 0;   // Questions: 1, 3, 5, 7, 9
    let evenSum = 0;  // Questions: 2, 4, 6, 8, 10
    let fullyAnswered = true;

    for (let i = 1; i <= 10; i++) {
        const selectedRadio = document.querySelector(`input[name="sus-q${i}"]:checked`);
        
        if (!selectedRadio) {
            fullyAnswered = false;
            break;
        }

        const scoreVal = parseInt(selectedRadio.value);

        if (i % 2 !== 0) {
            // Odd question (Positive statements): score contribution = response - 1
            oddSum += (scoreVal - 1);
        } else {
            // Even question (Negative statements): score contribution = 5 - response
            evenSum += (5 - scoreVal);
        }
    }

    if (!fullyAnswered) {
        document.getElementById("sus-score-number").textContent = "--";
        document.getElementById("sus-adjective-text").textContent = "Awaiting input...";
        document.getElementById("sus-grade-text").textContent = "--";
        return;
    }

    // SUS Scale Multiplier: total sum multiplied by 2.5
    const totalScore = (oddSum + evenSum) * 2.5;

    // Display SUS Score
    document.getElementById("sus-score-number").textContent = totalScore.toFixed(1);

    // Compute grades & adjectives descriptors
    let adjective = "";
    let grade = "";
    let colorClass = "";

    const adjectiveTextEl = document.getElementById("sus-adjective-text");
    const gradeTextEl = document.getElementById("sus-grade-text");

    // Clear class lists
    adjectiveTextEl.className = "desc-val";
    gradeTextEl.className = "desc-val";

    if (totalScore >= 90) {
        adjective = "Best Imaginable";
        grade = "Grade A+";
        colorClass = "text-success";
    } else if (totalScore >= 80.3) {
        adjective = "Excellent";
        grade = "Grade A";
        colorClass = "text-success";
    } else if (totalScore >= 68) {
        adjective = "Good";
        grade = "Grade B";
        colorClass = "text-success";
    } else if (totalScore >= 51) {
        adjective = "OK / Marginal";
        grade = "Grade C";
        colorClass = "text-primary";
    } else if (totalScore >= 38) {
        adjective = "Poor";
        grade = "Grade D";
        colorClass = "text-danger";
    } else {
        adjective = "Worst Imaginable";
        grade = "Grade F";
        colorClass = "text-danger";
    }

    adjectiveTextEl.textContent = adjective;
    adjectiveTextEl.classList.add(colorClass);
    
    gradeTextEl.textContent = grade;
    gradeTextEl.classList.add(colorClass);
}

// 3. Search filter for testing remarks table
function filterRemarks(query) {
    const tableRows = document.querySelectorAll("#registry-table-body tbody tr");
    const cleanQuery = query.toLowerCase().trim();

    tableRows.forEach(row => {
        const participantCell = row.querySelector("td:nth-child(1)");
        const remarkCell = row.querySelector(".remark-text");

        if (participantCell || remarkCell) {
            const pText = participantCell ? participantCell.textContent.toLowerCase() : "";
            const rText = remarkCell ? remarkCell.textContent.toLowerCase() : "";

            if (pText.includes(cleanQuery) || rText.includes(cleanQuery)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    });
}
