// Zenith Finance - UI Redesign & Case Study Interactive Logic

// Current State variables
let currentLiquidReserve = 399190.45;
let currentNetWorth = 1248390.45;
let isOriginalUI = false;

// 1. Tab Switching System
function switchTab(tabId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active-content');
    });

    // Remove active state from all tab buttons
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected content
    const targetContent = document.getElementById(`content-${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active-content');
    }

    // Set tab button active
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Special trigger: re-draw the SVG path to trigger drawing animation on sandbox switch
    if (tabId === 'sandbox') {
        const line = document.getElementById('spark-line');
        if (line) {
            line.style.animation = 'none';
            line.offsetHeight; // Trigger reflow
            line.style.animation = 'drawPath 2s ease-out forwards';
        }
    }
}

// 2. Toggle Modern/Original Interface System (Comparison Sandbox)
function toggleInterfaceVersion() {
    isOriginalUI = !isOriginalUI;
    const modernView = document.getElementById('modern-view');
    const originalView = document.getElementById('original-view');
    const toggleLabel = document.getElementById('toggle-label-text');
    const toggleBtn = document.getElementById('ui-comparison-toggle');
    const viewport = document.getElementById('dashboard-viewport');

    if (isOriginalUI) {
        // Switch to Original (flawed) UI
        modernView.style.display = 'none';
        originalView.style.display = 'block';
        toggleLabel.textContent = 'Viewing: Original UI';
        toggleBtn.classList.add('view-original');
        viewport.classList.add('view-original');
    } else {
        // Switch to Redesigned (modern) UI
        modernView.style.display = 'flex';
        originalView.style.display = 'none';
        toggleLabel.textContent = 'Viewing: Redesigned UI';
        toggleBtn.classList.remove('view-original');
        viewport.classList.remove('view-original');
        
        // Re-run path animation
        const line = document.getElementById('spark-line');
        if (line) {
            line.style.animation = 'none';
            line.offsetHeight; 
            line.style.animation = 'drawPath 2s ease-out forwards';
        }
    }
}

// 3. Search Filter in Transaction Table (Heuristic 7: Flexibility & Efficiency)
function filterTransactions(query) {
    const tableRows = document.querySelectorAll('#tx-table-body tbody tr');
    const cleanQuery = query.toLowerCase().trim();

    tableRows.forEach(row => {
        const nameField = row.querySelector('.tx-name');
        const metaField = row.querySelector('.tx-meta');
        const typeField = row.querySelector('.badge-type');

        if (nameField || metaField || typeField) {
            const nameText = nameField ? nameField.textContent.toLowerCase() : '';
            const metaText = metaField ? metaField.textContent.toLowerCase() : '';
            const typeText = typeField ? typeField.textContent.toLowerCase() : '';

            if (nameText.includes(cleanQuery) || metaText.includes(cleanQuery) || typeText.includes(cleanQuery)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// 4. Set MAX Amount Helper (Heuristic 7: Flexibility & Efficiency)
function setMaxTransfer() {
    const amountInput = document.getElementById('transfer-amount');
    // Set to integer portion of available reserves
    const maxVal = Math.floor(currentLiquidReserve);
    amountInput.value = maxVal;
}

// 5. Execute Redesigned Transfer (Heuristic 1: System Status, Heuristic 5: Error Prevention)
function executeQuickTransfer(event) {
    event.preventDefault();

    const destSelect = document.getElementById('destination-acc');
    const amountInput = document.getElementById('transfer-amount');
    const alertBanner = document.getElementById('transfer-alert');
    const alertMsg = document.getElementById('transfer-alert-msg');
    const submitBtn = document.getElementById('transfer-submit-btn');
    const spinner = document.getElementById('transfer-spinner');
    const form = event.target;

    // Reset warnings
    alertBanner.style.display = 'none';

    // Parse values
    const amount = parseFloat(amountInput.value);
    const destination = destSelect.options[destSelect.selectedIndex].text;

    // Validation (Heuristic 5: Error Prevention)
    if (isNaN(amount) || amount <= 0) {
        alertMsg.textContent = "Please enter a valid transfer amount greater than $0.";
        alertBanner.style.display = 'flex';
        return;
    }

    if (amount > currentLiquidReserve) {
        alertMsg.textContent = `Insufficient cash reserves. You requested $${amount.toLocaleString()} but only have $${currentLiquidReserve.toLocaleString()} available.`;
        alertBanner.style.display = 'flex';
        return;
    }

    // Disable button & show system spinner (Heuristic 1: System Status)
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    spinner.style.display = 'inline-block';

    // Simulate async network delay (1.5 seconds)
    setTimeout(() => {
        // Calculate new reserves
        currentLiquidReserve -= amount;
        currentNetWorth -= amount;

        // Update UI Dashboard figures with animations
        updateMetricDisplays();

        // Add Transaction Row dynamically
        addNewTransactionRow(destination, amount);

        // Hide form contents & Show success panel
        form.style.display = 'none';
        const successState = document.getElementById('transfer-success');
        const txIdSpan = document.getElementById('success-tx-id');
        
        // Generate random Tx ID
        const randomTx = 'ZTX-' + Math.floor(1000000 + Math.random() * 9000000);
        txIdSpan.textContent = randomTx;
        successState.style.display = 'block';

        // Re-enable form button for future usage
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        spinner.style.display = 'none';
    }, 1500);
}

// Helper: update dashboard text metrics
function updateMetricDisplays() {
    // Modern displays
    const netWorthTexts = document.querySelectorAll('.overview-grid .metric-value');
    if (netWorthTexts[0]) netWorthTexts[0].textContent = '$' + currentNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (netWorthTexts[2]) netWorthTexts[2].textContent = '$' + currentLiquidReserve.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Update input help indicator
    const helpText = document.querySelector('.input-help strong');
    if (helpText) helpText.textContent = '$' + currentLiquidReserve.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Original displays (to keep sync in simulation comparison)
    const oldValCells = document.querySelectorAll('.old-cell-val');
    if (oldValCells[0]) oldValCells[0].textContent = '$' + currentNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
    if (oldValCells[2]) oldValCells[2].textContent = '$' + currentLiquidReserve.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
}

// Helper: Append new row to table
function addNewTransactionRow(destination, amount) {
    const tableBody = document.querySelector('#tx-table-body tbody');
    if (!tableBody) return;

    // Create a new table row element
    const tr = document.createElement('tr');
    tr.className = 'tx-row';

    // Format destination label
    let shortName = "Transfer Outflow";
    if (destination.includes("Citibank")) shortName = "Citibank Transfer";
    else if (destination.includes("Chase")) shortName = "Chase Savings Transfer";
    else if (destination.includes("IRA")) shortName = "Zenith IRA Contribution";

    const dateToday = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    tr.innerHTML = `
        <td>
            <div class="tx-desc">
                <div class="tx-avatar bg-tx-purple">TF</div>
                <div>
                    <span class="tx-name">${shortName}</span>
                    <span class="tx-meta">Liquid capital settlement</span>
                </div>
            </div>
        </td>
        <td><span class="badge-type type-transfer">Transfer</span></td>
        <td class="tx-date">${dateToday}</td>
        <td class="text-right tx-amt neg-amt">-$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td><span class="badge-status status-completed">Completed</span></td>
    `;

    // Insert at the top of table body
    tableBody.insertBefore(tr, tableBody.firstChild);

    // Sync old UI table as well for alignment proof
    const oldTableBody = document.querySelector('.old-data-grid tbody');
    if (oldTableBody) {
        const oldTr = document.createElement('tr');
        const randomRef = Math.floor(80000 + Math.random() * 9000);
        oldTr.innerHTML = `
            <td>${randomRef}</td>
            <td>${shortName} Logged Record</td>
            <td>Transfer</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td style="color: #FF5555;">-$${amount.toFixed(2)}</td>
            <td>Wire</td>
            <td>Success</td>
            <td><button class="old-action-btn" onclick="alert('Transaction receipt requested. Sent to JonathanSterling1984@hotmail.com')">Request Receipt</button></td>
        `;
        oldTableBody.insertBefore(oldTr, oldTableBody.firstChild);
    }
}

// 6. Reset Form State after successful transfer
function resetTransferForm() {
    const form = document.querySelector('.transfer-form');
    const successState = document.getElementById('transfer-success');
    
    successState.style.display = 'none';
    form.style.display = 'flex';
    form.reset();
}

// 7. Destructive actions in old design (Heuristic Violation demonstration)
function executeOldDestructiveAction() {
    const oldDestVal = document.getElementById('old-dest').value.trim();
    const oldAmountVal = document.getElementById('old-val').value.trim();

    // Zero validation (Heuristic 5 violation)
    if (!oldDestVal || !oldAmountVal) {
        alert("CRITICAL SYSTEM MESSAGE:\nError in database execution. Empty fields not processed! Please try re-submitting immediately.");
        return;
    }

    // Jarring alerts with zero verification step (Heuristic 5 & 1 violation)
    alert(`[SYSTEM ACTION TRACE]:\nSuccessfully routed transaction to account "${oldDestVal}" for value amount of "${oldAmountVal}". Liquid reserve deducted immediately. Zero cancellation requested. Transaction finalized!`);

    const numericAmount = parseFloat(oldAmountVal);
    if (!isNaN(numericAmount) && numericAmount > 0) {
        currentLiquidReserve -= numericAmount;
        currentNetWorth -= numericAmount;
        updateMetricDisplays();
        addNewTransactionRow(oldDestVal, numericAmount);
    }
}
