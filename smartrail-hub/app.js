// ==========================================================================
// SmartRail Hub – Core Application Engine
// ==========================================================================

// Global App State
let STATE = {
    halls: [],
    trains: [],
    tickets: [],
    transactions: [],
    ads: [],
    shops: [],
    systemTime: new Date("2026-06-10T14:00:00+05:30"), // Fixed local time to start simulation
    emergencyActive: false,
    activePassengerPnr: "PNR-4829103", // Default active passenger
    selectedGateDirection: "entry",
    activeAdIndex: 0
};

// Seed Database Definition
const SEED_DATA = {
    halls: [
        { id: "hall-1", name: "Premium Executive Lounge (A)", class: "Executive", capacity: 60, occupancy: 12, comfort_index: 0.2, platform_near: "PF-1" },
        { id: "hall-2", name: "Sleeper Waiting Hall (B)", class: "Sleeper", capacity: 150, occupancy: 95, comfort_index: 0.63, platform_near: "PF-2" },
        { id: "hall-3", name: "General Waiting Arena (C)", class: "General", capacity: 250, occupancy: 210, comfort_index: 0.84, platform_near: "PF-4" },
        { id: "hall-4", name: "Royal Platform Lounge (D)", class: "Executive", capacity: 40, occupancy: 8, comfort_index: 0.2, platform_near: "PF-5" },
        { id: "hall-5", name: "East Sleeper Lounge (E)", class: "Sleeper", capacity: 120, occupancy: 42, comfort_index: 0.35, platform_near: "PF-6" }
    ],
    trains: [
        { train_no: "12626", name: "Kerala Express", source: "NDLS", destination: "TVC", platform: "PF-2", departure_time: "14:40", status: "On Time", delay_mins: 0 },
        { train_no: "12002", name: "Bhopal Shatabdi", source: "NDLS", destination: "HBJ", platform: "PF-1", departure_time: "15:10", status: "On Time", delay_mins: 0 },
        { train_no: "12424", name: "NDLS DBRG Rajdhani", source: "NDLS", destination: "DBRG", platform: "PF-4", departure_time: "16:10", status: "Delayed", delay_mins: 25 },
        { train_no: "14006", name: "Lichchavi Express", source: "ANVT", destination: "SMI", platform: "PF-3", departure_time: "17:30", status: "On Time", delay_mins: 0 },
        { train_no: "22416", name: "AP Express", source: "NDLS", destination: "VSKP", platform: "PF-5", departure_time: "18:15", status: "On Time", delay_mins: 0 }
    ],
    tickets: [
        { pnr: "PNR-4829103", passenger_name: "Rajesh Kumar", train_no: "12626", ticket_class: "Executive", coach: "H1", seat: 12, allocated_hall_id: "hall-1", status: "Booked", ticket_type: "Mobile", qr_data: '{"pnr":"PNR-4829103","class":"Executive","hall":"hall-1"}' },
        { pnr: "PNR-8830192", passenger_name: "Sunita Sharma", train_no: "12424", ticket_class: "Sleeper", coach: "S3", seat: 45, allocated_hall_id: "hall-5", status: "Checked In", ticket_type: "Printed", qr_data: '{"pnr":"PNR-8830192","class":"Sleeper","hall":"hall-5"}' },
        { pnr: "PNR-3029108", passenger_name: "Amit Patel", train_no: "12002", ticket_class: "General", coach: "GEN", seat: 89, allocated_hall_id: "hall-3", status: "Booked", ticket_type: "Mobile", qr_data: '{"pnr":"PNR-3029108","class":"General","hall":"hall-3"}' },
        { pnr: "PNR-5928104", passenger_name: "Vikram Singh", train_no: "12626", ticket_class: "Sleeper", coach: "S1", seat: 4, allocated_hall_id: "hall-2", status: "Booked", ticket_type: "Printed", qr_data: '{"pnr":"PNR-5928104","class":"Sleeper","hall":"hall-2"}' },
        { pnr: "PNR-1049281", passenger_name: "Priya Sharma", train_no: "22416", ticket_class: "Executive", coach: "A1", seat: 22, allocated_hall_id: "hall-4", status: "Checked In", ticket_type: "Mobile", qr_data: '{"pnr":"PNR-1049281","class":"Executive","hall":"hall-4"}' }
    ],
    transactions: [
        { id: "tx-101", type: "Advertisement", source_name: "Coca-Cola Ad Campaign", amount: 450.00, timestamp: "2026-06-10T11:30:00Z" },
        { id: "tx-102", type: "Shop Rent", source_name: "IRCTC Food Plaza (Rent)", amount: 1500.00, timestamp: "2026-06-10T12:00:00Z" },
        { id: "tx-103", type: "Vending Machine", source_name: "Snack Machine PF-1 (Sale)", amount: 80.00, timestamp: "2026-06-10T13:15:00Z" },
        { id: "tx-104", type: "Advertisement", source_name: "Tanishq Diamonds", amount: 920.00, timestamp: "2026-06-10T13:45:00Z" },
        { id: "tx-105", type: "Vending Machine", source_name: "Tea Machine Hall B (Sale)", amount: 40.00, timestamp: "2026-06-10T13:50:00Z" }
    ],
    ads: [
        { id: "ad-1", campaign_name: "Coca-Cola Summer Chill", advertiser: "Coca-Cola India", target_demographic: "All", description: "Refresh your journey with ice-cold Coca-Cola!", revenue_per_impression: 1.50, impressions: 840, status: "Active" },
        { id: "ad-2", campaign_name: "Tanishq Royal Heritage", advertiser: "Tanishq Diamonds", target_demographic: "Premium", description: "Exquisite diamonds for special moments. Buy at Lounge counter.", revenue_per_impression: 8.00, impressions: 115, status: "Active" },
        { id: "ad-3", campaign_name: "MakeMyTrip Travel Deals", advertiser: "MakeMyTrip", target_demographic: "General", description: "Get flat 15% off on hotel bookings using code SMARTRAIL.", revenue_per_impression: 2.20, impressions: 412, status: "Active" },
        { id: "ad-4", campaign_name: "Dell XPS Laptop Series", advertiser: "Dell Technologies", target_demographic: "Premium", description: "Empower your work on-the-go with Dell XPS. Intel Core Ultra.", revenue_per_impression: 6.50, impressions: 184, status: "Active" }
    ],
    shops: [
        { id: "shop-1", name: "Chai Point", category: "Food & Beverage", rent_monthly: 25000, commission_rate: 0.08, sales_today: 4200.00 },
        { id: "shop-2", name: "Higginbothams Bookstall", category: "Retail", rent_monthly: 12000, commission_rate: 0.05, sales_today: 1850.00 },
        { id: "shop-3", name: "IRCTC Food Plaza", category: "Food & Beverage", rent_monthly: 50000, commission_rate: 0.10, sales_today: 18200.00 }
    ]
};

// Initialize DB and state from localStorage
function initDB() {
    for (const key of Object.keys(SEED_DATA)) {
        if (!localStorage.getItem(`smartrail_${key}`)) {
            localStorage.setItem(`smartrail_${key}`, JSON.stringify(SEED_DATA[key]));
        }
    }
    loadStateFromStorage();
}

function loadStateFromStorage() {
    STATE.halls = JSON.parse(localStorage.getItem("smartrail_halls"));
    STATE.trains = JSON.parse(localStorage.getItem("smartrail_trains"));
    STATE.tickets = JSON.parse(localStorage.getItem("smartrail_tickets"));
    STATE.transactions = JSON.parse(localStorage.getItem("smartrail_transactions"));
    STATE.ads = JSON.parse(localStorage.getItem("smartrail_ads"));
    STATE.shops = JSON.parse(localStorage.getItem("smartrail_shops"));
    
    // Check if emergency evacuation state is active in sessionStorage
    STATE.emergencyActive = sessionStorage.getItem("smartrail_emergency") === "true";
}

function updateStorageItem(key) {
    localStorage.setItem(`smartrail_${key}`, JSON.stringify(STATE[key]));
}

// System Time Increment simulator (Tick 1 minute every 5 seconds)
function startClock() {
    setInterval(() => {
        if (STATE.emergencyActive) return; // Freeze time progression in emergency
        STATE.systemTime.setMinutes(STATE.systemTime.getMinutes() + 1);
        document.getElementById("nav-clock").innerText = formatTime(STATE.systemTime);
        
        // Randomly trigger ad impressions increment on active displays
        triggerAdImpression();
        
        // Check train countdowns and update displays
        checkTrainAlerts();
    }, 5000);
}

function formatTime(date) {
    let hh = String(date.getHours()).padStart(2, '0');
    let mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

// --------------------------------------------------------------------------
// 1. QR-based Ticket Verification & Gate Management
// --------------------------------------------------------------------------

// Scan Event Handler
function triggerScan(pnr, direction) {
    const logContainer = document.getElementById("admin-log-feed");
    const timestampStr = formatTime(STATE.systemTime);
    
    // 1. Handle Emergency Mode Override
    if (STATE.emergencyActive) {
        logEvent(timestampStr, `EMERGENCY OPEN SCAN - Passenger scanned. Turnstile open (Bypassed PNR check)`, "success");
        animateGateState(direction, true);
        return { success: true, message: "EMERGENCY - Gate Unlocked" };
    }

    // 2. Fetch Ticket
    const ticketIndex = STATE.tickets.findIndex(t => t.pnr === pnr);
    if (ticketIndex === -1) {
        logEvent(timestampStr, `SCAN FAILED - PNR ${pnr} not found in database`, "danger");
        animateGateState(direction, false);
        return { success: false, message: "Invalid ticket QR code" };
    }
    
    const ticket = STATE.tickets[ticketIndex];
    const train = STATE.trains.find(t => t.train_no === ticket.train_no);

    if (direction === "entry") {
        // Validation 1: Already Checked In
        if (ticket.status === "Checked In" || ticket.status === "Boarded") {
            logEvent(timestampStr, `ENTRY REJECTED - PNR ${ticket.pnr} already inside station`, "warning");
            animateGateState(direction, false);
            return { success: false, message: "Already checked in" };
        }

        // Validation 2: Time restriction (Check in allowed max 4 hours before departure)
        const trainTimeParts = train.departure_time.split(":");
        const trainHours = parseInt(trainTimeParts[0]);
        const trainMins = parseInt(trainTimeParts[1]);
        
        const depTimeToday = new Date(STATE.systemTime);
        depTimeToday.setHours(trainHours, trainMins, 0);
        
        // Add delays if applicable
        if (train.delay_mins > 0) {
            depTimeToday.setMinutes(depTimeToday.getMinutes() + train.delay_mins);
        }

        const diffMs = depTimeToday - STATE.systemTime;
        const diffHrs = diffMs / (1000 * 60 * 60);

        if (diffHrs < 0) {
            logEvent(timestampStr, `ENTRY REJECTED - Train ${train.name} departed`, "danger");
            animateGateState(direction, false);
            return { success: false, message: "Train has already departed" };
        }
        
        if (diffHrs > 4) {
            logEvent(timestampStr, `ENTRY REJECTED - PNR ${ticket.pnr} scanned too early (Departure > 4h)`, "warning");
            animateGateState(direction, false);
            return { success: false, message: "Too early. Access allowed 4 hrs prior to departure." };
        }

        // 3. Dynamic Waiting Hall Crowd Balancing upon entry check-in
        const originalHallId = ticket.allocated_hall_id;
        const finalHallId = balanceCrowdOnCheckIn(ticket.ticket_class, train.platform, originalHallId);
        
        if (finalHallId !== originalHallId) {
            ticket.allocated_hall_id = finalHallId;
            ticket.qr_data = `{"pnr":"${ticket.pnr}","class":"${ticket.ticket_class}","hall":"${finalHallId}"}`;
            logEvent(timestampStr, `CROWD BALANCING - Re-allocated PNR ${ticket.pnr} to ${getHallName(finalHallId)} due to high crowd in original hall`, "warning");
        }

        // Increment Hall occupancy
        const hall = STATE.halls.find(h => h.id === finalHallId);
        if (hall) {
            hall.occupancy = Math.min(hall.capacity, hall.occupancy + 1);
            hall.comfort_index = parseFloat((hall.occupancy / hall.capacity).toFixed(2));
            updateStorageItem("halls");
        }

        // Update Ticket Status
        ticket.status = "Checked In";
        updateStorageItem("tickets");
        
        logEvent(timestampStr, `ENTRY APPROVED - Passenger ${ticket.passenger_name} (PNR ${ticket.pnr}) checked in. Allocated: ${getHallName(finalHallId)}`, "success");
        animateGateState(direction, true);
        
        // Update dashboard views if on active view
        refreshActiveViews();
        return { success: true, message: `Access Granted. Waiting Hall: ${getHallName(finalHallId)}` };

    } else {
        // Exit Gate Scan
        if (ticket.status === "Checked Out") {
            logEvent(timestampStr, `EXIT REJECTED - PNR ${ticket.pnr} already checked out`, "warning");
            animateGateState(direction, false);
            return { success: false, message: "Ticket already checked out" };
        }

        // Decrease Hall occupancy if checked in
        if (ticket.status === "Checked In") {
            const hall = STATE.halls.find(h => h.id === ticket.allocated_hall_id);
            if (hall) {
                hall.occupancy = Math.max(0, hall.occupancy - 1);
                hall.comfort_index = parseFloat((hall.occupancy / hall.capacity).toFixed(2));
                updateStorageItem("halls");
            }
        }

        ticket.status = "Checked Out";
        updateStorageItem("tickets");
        
        logEvent(timestampStr, `EXIT APPROVED - Passenger ${ticket.passenger_name} (PNR ${ticket.pnr}) exited station.`, "success");
        animateGateState(direction, true);
        refreshActiveViews();
        return { success: true, message: "Goodbye. Have a safe journey!" };
    }
}

// Animate Gate opening and closing (LED flappers)
function animateGateState(direction, isApproved) {
    const gateCard = document.getElementById(`gate-card-${direction}`);
    const statusLed = gateCard.querySelector(".gate-status-indicator");
    
    if (isApproved) {
        gateCard.classList.add("open");
        statusLed.style.backgroundColor = "var(--success)";
        statusLed.style.boxShadow = "0 0 12px var(--success)";
        
        // Clear after 3 seconds
        setTimeout(() => {
            gateCard.classList.remove("open");
            statusLed.style.backgroundColor = "var(--danger)";
            statusLed.style.boxShadow = "0 0 8px rgba(239, 68, 68, 0.6)";
        }, 3000);
    } else {
        gateCard.classList.remove("open");
        statusLed.style.backgroundColor = "var(--danger)";
        statusLed.style.boxShadow = "0 0 15px var(--danger)";
        
        // Blink red 3 times
        let blinks = 0;
        const interval = setInterval(() => {
            statusLed.style.opacity = statusLed.style.opacity === "0" ? "1" : "0";
            blinks++;
            if (blinks > 6) {
                clearInterval(interval);
                statusLed.style.opacity = "1";
            }
        }, 150);
    }
}

// --------------------------------------------------------------------------
// 2. Waiting Hall Allocation & Crowd Balancing Engine
// --------------------------------------------------------------------------

function getHallName(id) {
    const h = STATE.halls.find(h => h.id === id);
    return h ? h.name : "N/A";
}

// Logic: Balance crowd during ticket checking
function balanceCrowdOnCheckIn(ticketClass, trainPlatform, originalHallId) {
    const originalHall = STATE.halls.find(h => h.id === originalHallId);
    
    // Check if original hall is overcrowded (comfort index >= 0.8)
    if (originalHall && (originalHall.occupancy / originalHall.capacity) < 0.8) {
        return originalHallId; // Keep original hall, comfortable
    }
    
    // Search alternative waiting halls with the same class, closest to the platform
    const candidates = STATE.halls.filter(h => h.class === ticketClass && h.id !== originalHallId);
    
    if (candidates.length === 0) return originalHallId; // No other halls of this class

    // Sort candidates by lowest comfort index (available crowd capacity)
    candidates.sort((a, b) => (a.occupancy / a.capacity) - (b.occupancy / b.capacity));
    
    // If the least crowded alternative is comfortable (under 80% occupancy), route there
    const bestAlternative = candidates[0];
    if ((bestAlternative.occupancy / bestAlternative.capacity) < 0.8) {
        return bestAlternative.id;
    }
    
    return originalHallId; // If all options are packed, keep the default allocation
}

// Manual Booking feature from Admin/Passenger panel
function bookNewTicket(passengerName, trainNo, ticketClass, ticketType) {
    const randomPnr = "PNR-" + Math.floor(1000000 + Math.random() * 9000000);
    const train = STATE.trains.find(t => t.train_no === trainNo);
    
    if (!train) return null;

    // Automatic allocation during booking
    // 1. Filter halls by ticket class
    const validHalls = STATE.halls.filter(h => h.class === ticketClass);
    
    // 2. Prioritize halls near scheduled train platform
    let allocatedHall = null;
    let closestHalls = validHalls.filter(h => h.platform_near === train.platform);
    
    if (closestHalls.length > 0) {
        // Pick least occupied close hall
        closestHalls.sort((a,b) => (a.occupancy/a.capacity) - (b.occupancy/b.capacity));
        allocatedHall = closestHalls[0];
    } else {
        // Pick any least occupied hall in class
        validHalls.sort((a,b) => (a.occupancy/a.capacity) - (b.occupancy/b.capacity));
        allocatedHall = validHalls[0];
    }

    const newTicket = {
        pnr: randomPnr,
        passenger_name: passengerName,
        train_no: trainNo,
        ticket_class: ticketClass,
        coach: ticketClass === "Executive" ? "A1" : (ticketClass === "Sleeper" ? "S2" : "GEN"),
        seat: Math.floor(1 + Math.random() * 72),
        allocated_hall_id: allocatedHall.id,
        status: "Booked",
        ticket_type: ticketType,
        qr_data: `{"pnr":"${randomPnr}","class":"${ticketClass}","hall":"${allocatedHall.id}"}`
    };

    STATE.tickets.push(newTicket);
    updateStorageItem("tickets");
    
    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, `NEW BOOKING - PNR ${randomPnr} booked for ${passengerName}. Auto Allocated: ${allocatedHall.name}`, "info");
    
    refreshActiveViews();
    return newTicket;
}

// --------------------------------------------------------------------------
// 3. Train Tracking, Delays & Alerts Engine
// --------------------------------------------------------------------------

function updateTrainDelay(trainNo, delayMins) {
    const train = STATE.trains.find(t => t.train_no === trainNo);
    if (!train) return;
    
    train.delay_mins = parseInt(delayMins);
    train.status = delayMins > 0 ? "Delayed" : "On Time";
    updateStorageItem("trains");

    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, `TRAIN STATUS UPDATE - Train ${trainNo} (${train.name}) delay updated to ${delayMins} mins. Status: ${train.status}`, "warning");
    
    // Notify passengers (Show immediately inside passenger app simulator)
    notifyPassengerOfDelay(trainNo, delayMins);
    refreshActiveViews();
}

function notifyPassengerOfDelay(trainNo, delayMins) {
    // Search active tickets matching delayed train
    const affectedTickets = STATE.tickets.filter(t => t.train_no === trainNo && t.status === "Checked In");
    affectedTickets.forEach(ticket => {
        // If this is the active simulated passenger, trigger visual alert
        if (ticket.pnr === STATE.activePassengerPnr) {
            triggerPhoneNotification("⚠️ Train Delay Alert", `Your Train ${trainNo} is delayed by ${delayMins} minutes. Updated departure: ${calculateNewDeparture(trainNo)}`);
        }
    });
}

function calculateNewDeparture(trainNo) {
    const train = STATE.trains.find(t => t.train_no === trainNo);
    if (!train) return "";
    if (train.delay_mins === 0) return train.departure_time;

    const parts = train.departure_time.split(":");
    let h = parseInt(parts[0]);
    let m = parseInt(parts[1]) + train.delay_mins;
    
    h += Math.floor(m / 60);
    m = m % 60;
    h = h % 24;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Check if train departures are near (10-20 minutes alert trigger)
function checkTrainAlerts() {
    STATE.trains.forEach(train => {
        if (train.status === "Departed") return;

        const depParts = train.departure_time.split(":");
        const depTime = new Date(STATE.systemTime);
        depTime.setHours(parseInt(depParts[0]), parseInt(depParts[1]), 0);
        
        if (train.delay_mins > 0) {
            depTime.setMinutes(depTime.getMinutes() + train.delay_mins);
        }

        const timeDiffMins = Math.round((depTime - STATE.systemTime) / 60000);
        
        // Alert 1: Departure countdown alert (10 - 20 mins before)
        if (timeDiffMins >= 10 && timeDiffMins <= 20) {
            // Find checked in passengers for this train
            STATE.tickets.forEach(ticket => {
                if (ticket.train_no === train.train_no && ticket.status === "Checked In") {
                    if (ticket.pnr === STATE.activePassengerPnr) {
                        triggerPhoneNotification("📢 Departure Boarding Notice", `Train ${train.name} departs in ${timeDiffMins} mins on ${train.platform}. Please proceed to gate.`);
                    }
                }
            });
        }
        
        // Auto depart if time matches
        if (timeDiffMins <= 0 && timeDiffMins > -5) {
            train.status = "Departed";
            updateStorageItem("trains");
            
            // Mark checked-in passengers as boarded
            STATE.tickets.forEach(t => {
                if (t.train_no === train.train_no && t.status === "Checked In") {
                    t.status = "Boarded";
                    // Deduct hall occupancy
                    const hall = STATE.halls.find(h => h.id === t.allocated_hall_id);
                    if (hall) {
                        hall.occupancy = Math.max(0, hall.occupancy - 1);
                        hall.comfort_index = parseFloat((hall.occupancy / hall.capacity).toFixed(2));
                    }
                }
            });
            updateStorageItem("halls");
            updateStorageItem("tickets");
            logEvent(formatTime(STATE.systemTime), `TRAIN DEPARTED - Train ${train.train_no} (${train.name}) departed on schedule. Platform ${train.platform}.`, "info");
            refreshActiveViews();
        }
    });
}

// --------------------------------------------------------------------------
// 4. Evacuation & Emergency Control
// --------------------------------------------------------------------------

function triggerEmergencyEvacuation() {
    STATE.emergencyActive = true;
    sessionStorage.setItem("smartrail_emergency", "true");
    
    // Set all gates to unlock open
    document.getElementById("gate-card-entry").classList.add("open");
    document.getElementById("gate-card-exit").classList.add("open");

    // Add alert status to all displays
    document.body.classList.add("emergency-mode-active");

    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, "🚨 CRITICAL: EMERGENCY EVACUATION PROTOCOL INITIATED. ALL SMART GATES SET TO OPEN. PUBLIC DISPLAYS DISPLAYING EXIT ROUTES.", "danger");

    // Clear waiting halls occupancy simulation over time
    const evacTimer = setInterval(() => {
        if (!STATE.emergencyActive) {
            clearInterval(evacTimer);
            return;
        }
        let totalRemaining = 0;
        STATE.halls.forEach(hall => {
            if (hall.occupancy > 0) {
                hall.occupancy = Math.max(0, hall.occupancy - Math.floor(Math.random() * 8 + 3));
                hall.comfort_index = parseFloat((hall.occupancy / hall.capacity).toFixed(2));
                totalRemaining += hall.occupancy;
            }
        });
        updateStorageItem("halls");
        refreshActiveViews();

        if (totalRemaining === 0) {
            logEvent(formatTime(STATE.systemTime), "🚨 INFO: Station fully evacuated. Hall occupancy stands at zero.", "success");
            clearInterval(evacTimer);
        }
    }, 2000);

    // Alert simulated passenger phone
    triggerPhoneNotification("🚨 STATION EVACUATION WARNING", "IMMEDIATE EVACUATION DIRECTIVE: Sirens activated. Leave waiting halls and follow platform exit markers immediately.");
    refreshActiveViews();
}

function resetEmergencyEvacuation() {
    STATE.emergencyActive = false;
    sessionStorage.setItem("smartrail_emergency", "false");
    
    document.getElementById("gate-card-entry").classList.remove("open");
    document.getElementById("gate-card-exit").classList.remove("open");
    document.body.classList.remove("emergency-mode-active");

    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, "🟢 NOTICE: Emergency protocol cleared. Smart Gates reset to normal verification mode.", "success");
    refreshActiveViews();
}

// --------------------------------------------------------------------------
// 5. Advertisement Management
// --------------------------------------------------------------------------

function triggerAdImpression() {
    if (STATE.ads.length === 0) return;
    
    // Rotate ads index
    STATE.activeAdIndex = (STATE.activeAdIndex + 1) % STATE.ads.length;
    const activeAd = STATE.ads[STATE.activeAdIndex];
    
    // Calculate impressions increment
    activeAd.impressions += 1;
    updateStorageItem("ads");

    // Log transaction revenue
    const revenueAmount = activeAd.revenue_per_impression;
    const randomTxId = "tx-" + Math.floor(1000 + Math.random() * 9000);
    const newTx = {
        id: randomTxId,
        type: "Advertisement",
        source_name: `${activeAd.campaign_name} (Impression)`,
        amount: parseFloat(revenueAmount.toFixed(2)),
        timestamp: new Date().toISOString()
    };
    
    STATE.transactions.push(newTx);
    updateStorageItem("transactions");

    // Dynamic ad updates on Station Displays
    const adImage = document.getElementById("public-ad-banner");
    const adText = document.getElementById("public-ad-text");
    const adImpressions = document.getElementById("ad-impressions-count");

    if (adImage && adText) {
        // Since we don't have external assets, we use placeholder patterns using inline SVG shapes or text
        adImage.style.backgroundColor = getAdColor(activeAd.id);
        adText.innerHTML = `<h3>${activeAd.campaign_name}</h3><p>${activeAd.description}</p>`;
    }
}

function getAdColor(id) {
    const colors = {
        "ad-1": "#b91c1c", // red coca cola
        "ad-2": "#78350f", // amber gold jewelry
        "ad-3": "#0369a1", // blue travel
        "ad-4": "#0f172a"  // black tech
    };
    return colors[id] || "#1e293b";
}

// --------------------------------------------------------------------------
// 6. Retail & Vending machine Transactions
// --------------------------------------------------------------------------

function purchaseVendingSnack(itemName, price) {
    const txId = "tx-" + Math.floor(10000 + Math.random() * 90000);
    const newTx = {
        id: txId,
        type: "Vending Machine",
        source_name: `${itemName} Purchase`,
        amount: price,
        timestamp: new Date().toISOString()
    };
    
    STATE.transactions.push(newTx);
    updateStorageItem("transactions");

    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, `REVENUE RECEIVED - Vending machine purchase: ${itemName} ($${price}) logged.`, "success");
    
    triggerPhoneNotification("🥤 Kiosk Order Placed", `Bought ${itemName} successfully for $${price}. Pick it up from the slot.`);
    refreshActiveViews();
}

function purchaseShopFood(shopId, amount) {
    const shop = STATE.shops.find(s => s.id === shopId);
    if (!shop) return;
    
    shop.sales_today += amount;
    updateStorageItem("shops");

    // Station earns commission percentage on sales
    const commissionEarned = amount * shop.commission_rate;
    const txId = "tx-" + Math.floor(10000 + Math.random() * 90000);
    
    const newTx = {
        id: txId,
        type: "Shop Rent", // Treated as commission/rent stream
        source_name: `${shop.name} Comm (${Math.round(shop.commission_rate * 100)}%)`,
        amount: parseFloat(commissionEarned.toFixed(2)),
        timestamp: new Date().toISOString()
    };
    
    STATE.transactions.push(newTx);
    updateStorageItem("transactions");

    const timestampStr = formatTime(STATE.systemTime);
    logEvent(timestampStr, `REVENUE RECEIVED - Commision of $${commissionEarned.toFixed(2)} received from ${shop.name} sale ($${amount}).`, "success");
    
    triggerPhoneNotification("🍔 Shop Order Confirmed", `Placed food order at ${shop.name} for $${amount}. Your ticket shows platform delivery.`);
    refreshActiveViews();
}

// --------------------------------------------------------------------------
// 7. Simulated UI Renderers
// --------------------------------------------------------------------------

// Logger
function logEvent(time, message, type = "info") {
    const logsFeed = document.getElementById("admin-log-feed");
    if (!logsFeed) return;

    // Remove placeholder text on first log
    if (logsFeed.children[0] && logsFeed.children[0].className === "log-placeholder") {
        logsFeed.innerHTML = "";
    }

    const row = document.createElement("div");
    row.className = "logger-row";
    
    const timeSpan = document.createElement("span");
    timeSpan.className = "logger-time";
    timeSpan.innerText = `[${time}]`;

    const msgSpan = document.createElement("span");
    msgSpan.className = `logger-msg ${type}`;
    msgSpan.innerText = message;

    row.appendChild(timeSpan);
    row.appendChild(msgSpan);
    
    logsFeed.insertBefore(row, logsFeed.firstChild);

    // Cap logs at 30 items
    if (logsFeed.children.length > 30) {
        logsFeed.removeChild(logsFeed.lastChild);
    }
}

// Active Notification trigger on Phone Frame
function triggerPhoneNotification(title, message) {
    const notifyPanel = document.getElementById("phone-notification-banner");
    if (!notifyPanel) return;

    document.getElementById("phone-notify-title").innerText = title;
    document.getElementById("phone-notify-text").innerText = message;
    
    notifyPanel.style.display = "block";
    notifyPanel.style.animation = "slideDown 0.3s forwards";

    // Play virtual notification beep console log
    console.log(`[Virtual BEEP] Phone Alert: ${title} - ${message}`);
}

function dismissPhoneNotification() {
    const notifyPanel = document.getElementById("phone-notification-banner");
    if (notifyPanel) {
        notifyPanel.style.display = "none";
    }
}

// Dynamic dashboard charts on Canvas
function drawAnalyticsCharts() {
    const canvas = document.getElementById("analytics-chart-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // AI Prediction Line Drawing (Grid lines background)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
        let y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Sinusoidal Peak Prediction data curve (Representing crowd occupancy)
    const points = [];
    const peakHours = [6, 12, 17, 21];
    
    ctx.beginPath();
    ctx.strokeStyle = "var(--secondary)";
    ctx.lineWidth = 3;
    
    // Gradient filling under line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.3)");
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

    for (let x = 0; x <= width; x += 10) {
        // Calculate crowd metric: Base sine wave representing passenger flow peaks
        const hour = (x / width) * 24;
        let val = Math.sin((hour - 8) * Math.PI / 6) * 35; // Principal peaks
        val += Math.sin((hour - 14) * Math.PI / 3) * 10;   // secondary peaks
        val += 60; // offset floor
        
        let y = height - (val / 120) * height; // normalize to canvas bounds
        points.push({ x, y });
    }

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Fill gradient
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw active vertical line indicating current system hour (14:00 corresponds to 14/24 position)
    const currentHour = STATE.systemTime.getHours() + (STATE.systemTime.getMinutes() / 60);
    const activeX = (currentHour / 24) * width;
    
    ctx.strokeStyle = "var(--danger)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(activeX, 0);
    ctx.lineTo(activeX, height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw alert dot on line
    ctx.fillStyle = "var(--danger)";
    ctx.beginPath();
    ctx.arc(activeX, height - (75 / 120) * height, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Draw simple Bar graphic representing Revenue splits
function drawRevenueBarCharts() {
    // Collect financial transactions sums
    let adRevenue = STATE.transactions.filter(t => t.type === "Advertisement").reduce((a,b) => a + b.amount, 0);
    let rentRevenue = STATE.transactions.filter(t => t.type === "Shop Rent").reduce((a,b) => a + b.amount, 0);
    let vendingRevenue = STATE.transactions.filter(t => t.type === "Vending Machine").reduce((a,b) => a + b.amount, 0);

    document.getElementById("rev-ad-total").innerText = `$${adRevenue.toFixed(2)}`;
    document.getElementById("rev-rent-total").innerText = `$${rentRevenue.toFixed(2)}`;
    document.getElementById("rev-vending-total").innerText = `$${vendingRevenue.toFixed(2)}`;

    const totalRev = adRevenue + rentRevenue + vendingRevenue;
    document.getElementById("rev-all-total").innerText = `$${totalRev.toFixed(2)}`;

    // Draw visual bars ratio
    const barAd = document.getElementById("rev-bar-ad");
    const barRent = document.getElementById("rev-bar-rent");
    const barVending = document.getElementById("rev-bar-vending");

    if (barAd && barRent && barVending && totalRev > 0) {
        barAd.style.height = `${(adRevenue / totalRev) * 100}%`;
        barRent.style.height = `${(rentRevenue / totalRev) * 100}%`;
        barVending.style.height = `${(vendingRevenue / totalRev) * 100}%`;

        barAd.setAttribute("data-val", `$${adRevenue.toFixed(0)}`);
        barRent.setAttribute("data-val", `$${rentRevenue.toFixed(0)}`);
        barVending.setAttribute("data-val", `$${vendingRevenue.toFixed(0)}`);
    }
}

// Refresh all UI elements dynamically based on current tab state
function refreshActiveViews() {
    // 1. Refresh System header details
    document.getElementById("nav-clock").innerText = formatTime(STATE.systemTime);

    // 2. Render Admin stats
    let totalPassengersInStation = STATE.tickets.filter(t => t.status === "Checked In").length;
    document.getElementById("stat-passengers").innerText = totalPassengersInStation;
    
    let activeAlerts = STATE.trains.filter(t => t.status === "Delayed").length;
    document.getElementById("stat-alerts").innerText = activeAlerts;
    if (STATE.emergencyActive) {
        document.getElementById("stat-alerts").innerText = "🚨 EVAC";
    }

    // 3. Render Halls Cards
    const hallsBox = document.getElementById("halls-list-grid");
    if (hallsBox) {
        hallsBox.innerHTML = "";
        STATE.halls.forEach(hall => {
            const pct = Math.round((hall.occupancy / hall.capacity) * 100);
            let stateClass = "badge-general";
            let progColor = "var(--success)";
            if (pct >= 80) {
                stateClass = "badge-executive";
                progColor = "var(--danger)";
            } else if (pct >= 50) {
                stateClass = "badge-sleeper";
                progColor = "var(--warning)";
            }

            hallsBox.innerHTML += `
                <div class="hall-card">
                    <div class="hall-card-header">
                        <span class="hall-title">${hall.name}</span>
                        <span class="hall-type-badge ${stateClass}">${hall.class}</span>
                    </div>
                    <div class="hall-metrics-row">
                        <span>Platform: <strong>${hall.platform_near}</strong></span>
                        <span>Occupancy: <strong>${hall.occupancy}/${hall.capacity} (${pct}%)</strong></span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${progColor};"></div>
                    </div>
                </div>
            `;
        });
    }

    // 4. Render Train Scheduler Table
    const trainTableBody = document.querySelector("#train-scheduler-table tbody");
    if (trainTableBody) {
        trainTableBody.innerHTML = "";
        STATE.trains.forEach(t => {
            let statusBadge = `<span class="text-success">${t.status}</span>`;
            if (t.status === "Delayed") {
                statusBadge = `<span class="text-warning">${t.status} (+${t.delay_mins}m)</span>`;
            } else if (t.status === "Departed") {
                statusBadge = `<span class="text-muted">Departed</span>`;
            }

            trainTableBody.innerHTML += `
                <tr>
                    <td><strong>${t.train_no}</strong></td>
                    <td>${t.name}</td>
                    <td>${t.source} ➔ ${t.destination}</td>
                    <td><span class="ticket-pnr">${t.platform}</span></td>
                    <td>${t.departure_time}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="scheduler-action-btn" onclick="openDelayModal('${t.train_no}')">Modify</button>
                    </td>
                </tr>
            `;
        });
    }

    // 5. Render active ads impressions in admin panel
    const adsContainer = document.getElementById("admin-ads-list");
    if (adsContainer) {
        adsContainer.innerHTML = "";
        STATE.ads.forEach(ad => {
            adsContainer.innerHTML += `
                <div class="ad-card-row">
                    <div>
                        <strong style="color: #fff;">${ad.campaign_name}</strong>
                        <div style="font-size: 0.75rem; color:#9ca3af;">Advertiser: ${ad.advertiser}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="ticket-pnr">${ad.target_demographic} Target</span>
                        <div style="font-size: 0.75rem; color: var(--success); font-weight: 500;">Views: ${ad.impressions}</div>
                    </div>
                </div>
            `;
        });
    }

    // 6. Draw dynamic charts
    drawAnalyticsCharts();
    drawRevenueBarCharts();

    // 7. Render passenger simulator details
    renderPassengerViewDetails();

    // 8. Render Public displays
    renderPublicBoardDetails();
    
    // 9. Update options in Gate selectors
    renderGateSelectorOptions();
}

function renderPassengerViewDetails() {
    const passenger = STATE.tickets.find(t => t.pnr === STATE.activePassengerPnr);
    if (!passenger) return;

    const train = STATE.trains.find(t => t.train_no === passenger.train_no);
    const hall = STATE.halls.find(h => h.id === passenger.allocated_hall_id);

    // Update boarding pass card contents
    document.getElementById("phone-pass-name").innerText = passenger.passenger_name;
    document.getElementById("phone-pass-pnr").innerText = passenger.pnr;
    document.getElementById("phone-pass-train").innerText = `${train.train_no} - ${train.name}`;
    document.getElementById("phone-pass-platform").innerText = train.platform;
    document.getElementById("phone-pass-hall").innerText = hall ? hall.name : "Unassigned";
    document.getElementById("phone-pass-status").innerText = passenger.status;
    document.getElementById("phone-pass-seat").innerText = `${passenger.coach} / Seat ${passenger.seat}`;
    
    // Draw QR canvas
    drawTicketQrCode("phone-qr-canvas", passenger.pnr);

    // Render Live train location text
    let trackingText = "Train Stabled at platform depot.";
    if (train.status === "On Time") {
        trackingText = `Approaching platform ${train.platform} shortly. Boarding active.`;
    } else if (train.status === "Delayed") {
        trackingText = `Delayed by ${train.delay_mins} mins. Expected: ${calculateNewDeparture(train.train_no)}`;
    } else if (train.status === "Departed") {
        trackingText = "Departed Station. Thank you for using Indian Railways.";
    }
    document.getElementById("phone-train-status-text").innerText = trackingText;

    // Redraw map navigator marker
    const pin = document.getElementById("phone-map-pin");
    if (pin && hall) {
        // Mock coordinate spots on grid maps
        const coordinates = {
            "hall-1": { x: "20%", y: "40%" },
            "hall-2": { x: "75%", y: "30%" },
            "hall-3": { x: "50%", y: "70%" },
            "hall-4": { x: "30%", y: "60%" },
            "hall-5": { x: "80%", y: "65%" }
        };
        const coord = coordinates[hall.id] || { x: "50%", y: "50%" };
        pin.style.left = coord.x;
        pin.style.top = coord.y;
    }

    // Render A4 printed ticket layout simulator
    document.getElementById("print-pnr").innerText = passenger.pnr;
    document.getElementById("print-name").innerText = passenger.passenger_name.toUpperCase();
    document.getElementById("print-train").innerText = `${train.train_no} / ${train.name.toUpperCase()}`;
    document.getElementById("print-date").innerText = "10/06/2026";
    document.getElementById("print-class").innerText = passenger.ticket_class.toUpperCase();
    document.getElementById("print-seat").innerText = `${passenger.coach} / SEAT ${passenger.seat}`;
    document.getElementById("print-hall").innerText = hall ? hall.name.toUpperCase() : "UNASSIGNED";
    drawTicketQrCode("print-qr-canvas", passenger.pnr);
}

// Simple Bar/Line grid generation for mock QR code using HTML Canvas
function drawTicketQrCode(canvasId, pnr) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    ctx.clearRect(0,0,size,size);

    // Render three corners anchor squares like standard QR codes
    ctx.fillStyle = "#000000";
    
    // Top-Left corner anchor
    ctx.fillRect(5, 5, 30, 30);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 10, 20, 20);
    ctx.fillStyle = "#000000";
    ctx.fillRect(15, 15, 10, 10);

    // Top-Right corner anchor
    ctx.fillRect(size - 35, 5, 30, 30);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(size - 30, 10, 20, 20);
    ctx.fillStyle = "#000000";
    ctx.fillRect(size - 25, 15, 10, 10);

    // Bottom-Left corner anchor
    ctx.fillRect(5, size - 35, 30, 30);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, size - 30, 20, 20);
    ctx.fillStyle = "#000000";
    ctx.fillRect(15, size - 25, 10, 10);

    // Draw random block matrices mapping PNR letters (pseudo QR data hash)
    let pnrSum = 0;
    for(let i=0; i<pnr.length; i++) {
        pnrSum += pnr.charCodeAt(i);
    }
    
    ctx.fillStyle = "#000000";
    for(let x=40; x < size - 40; x += 8) {
        for(let y=40; y < size - 40; y += 8) {
            let hashVal = (x * y + pnrSum) % 7;
            if (hashVal < 3) {
                ctx.fillRect(x, y, 6, 6);
            }
        }
    }
    // Also draw random noise on side margins
    for(let x=5; x < size - 5; x += 10) {
        let hash = (x * pnrSum) % 5;
        if (hash < 2) {
            ctx.fillRect(x, 40, 5, 5);
            ctx.fillRect(40, x, 5, 5);
        }
    }
}

function renderPublicBoardDetails() {
    // Render public timetable board
    const tableBody = document.querySelector("#public-board-table tbody");
    if (tableBody) {
        tableBody.innerHTML = "";
        STATE.trains.forEach(t => {
            let statusText = t.status;
            let statusColor = "text-success";
            if (t.status === "Delayed") {
                statusText = `DELAY ${t.delay_mins} MINS`;
                statusColor = "text-warning";
            } else if (t.status === "Departed") {
                statusColor = "text-muted";
            }
            
            tableBody.innerHTML += `
                <tr style="border-bottom: 1px solid #1a2233; height: 45px;">
                    <td style="font-family: monospace; color: var(--secondary); font-size: 1.1rem; padding: 0.5rem;"><strong>${t.train_no}</strong></td>
                    <td style="color:#ffffff; font-weight:600; padding: 0.5rem;">${t.name.toUpperCase()}</td>
                    <td style="padding: 0.5rem;">${t.source} ➔ ${t.destination}</td>
                    <td style="padding: 0.5rem;"><span style="background: #111827; padding: 2px 8px; border-radius: 4px; border:1px solid #2d3748;">${t.platform}</span></td>
                    <td style="font-family: monospace; padding: 0.5rem;">${t.departure_time}</td>
                    <td style="padding: 0.5rem;" class="${statusColor}">${statusText.toUpperCase()}</td>
                </tr>
            `;
        });
    }

    // Render public Waiting Hall occupancy display
    const boardHalls = document.getElementById("public-board-halls");
    if (boardHalls) {
        boardHalls.innerHTML = "";
        STATE.halls.forEach(hall => {
            const pct = Math.round((hall.occupancy / hall.capacity) * 100);
            let statusText = "NORMAL";
            let color = "var(--success)";
            if (pct >= 85) {
                statusText = "FULL (BALANCING ACTIVE)";
                color = "var(--danger)";
            } else if (pct >= 60) {
                statusText = "MODERATE CROWD";
                color = "var(--warning)";
            }

            boardHalls.innerHTML += `
                <div style="background: #090c12; border: 1px solid #1a2233; padding: 0.75rem; border-radius: 6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color: #ffffff; font-size: 0.95rem;">${hall.name}</strong>
                        <div style="font-size: 0.75rem; color:#9ca3af;">Nearest Platform: ${hall.platform_near} &bull; Class: ${hall.class}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: ${color}; font-weight:700; font-size: 0.85rem;">${statusText}</span>
                        <div style="font-size: 0.75rem; color:#d1d5db; margin-top: 0.2rem;">Capacity Occupied: ${pct}% (${hall.occupancy}/${hall.capacity})</div>
                    </div>
                </div>
            `;
        });
    }
}

function renderGateSelectorOptions() {
    const selector = document.getElementById("gate-pnr-selector");
    if (selector) {
        const currentVal = selector.value;
        selector.innerHTML = "";
        STATE.tickets.forEach(ticket => {
            selector.innerHTML += `<option value="${ticket.pnr}">${ticket.pnr} - ${ticket.passenger_name} (${ticket.ticket_class} class, Status: ${ticket.status})</option>`;
        });
        if (currentVal) {
            selector.value = currentVal;
        }
    }
}

// --------------------------------------------------------------------------
// 8. Event Bindings / View Navigation Setup
// --------------------------------------------------------------------------

function switchAppView(viewId, buttonEl) {
    // Hide all panels
    document.querySelectorAll(".app-view-panel").forEach(panel => {
        panel.classList.remove("active");
    });
    
    // Show active panel
    document.getElementById(viewId).classList.add("active");

    // Clear active button styles
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    buttonEl.classList.add("active");

    // Redraw charts if switching back to dashboard to handle canvas sizing resets
    if (viewId === "view-admin") {
        drawAnalyticsCharts();
        drawRevenueBarCharts();
    }
}

// Dialog management
function openDelayModal(trainNo) {
    const train = STATE.trains.find(t => t.train_no === trainNo);
    if (!train) return;

    document.getElementById("modal-train-no").innerText = train.train_no;
    document.getElementById("modal-train-name").innerText = train.name;
    document.getElementById("modal-delay-input").value = train.delay_mins;
    
    document.getElementById("delay-config-modal").style.display = "flex";
}

function closeDelayModal() {
    document.getElementById("delay-config-modal").style.display = "none";
}

function submitDelayUpdate() {
    const trainNo = document.getElementById("modal-train-no").innerText;
    const delayVal = document.getElementById("modal-delay-input").value;
    updateTrainDelay(trainNo, delayVal);
    closeDelayModal();
}

// Passenger phone selector switcher
function switchActivePassenger(pnr) {
    STATE.activePassengerPnr = pnr;
    renderPassengerViewDetails();
}

// Interactive Gate Scan trigger from simulator UI
function executeGateScanSimulation() {
    const pnr = document.getElementById("gate-pnr-selector").value;
    const direction = STATE.selectedGateDirection;
    
    const result = triggerScan(pnr, direction);
    
    // Display result overlay
    const overlay = document.getElementById(`scan-result-${direction}`);
    overlay.style.display = "block";
    if (result.success) {
        overlay.className = "scan-alert-overlay success";
        overlay.innerHTML = `<span style="font-size: 2rem;">✓</span><div style="font-size: 0.85rem; font-weight:600;">PASS APPROVED</div><p style="font-size: 0.75rem;">${result.message}</p>`;
    } else {
        overlay.className = "scan-alert-overlay error";
        overlay.innerHTML = `<span style="font-size: 2rem;">✕</span><div style="font-size: 0.85rem; font-weight:600;">SCAN DENIED</div><p style="font-size: 0.75rem;">${result.message}</p>`;
    }

    setTimeout(() => {
        overlay.style.display = "none";
    }, 3000);
}

// Global hookups
window.onload = function() {
    initDB();
    startClock();
    
    // Draw initial charts
    drawAnalyticsCharts();
    drawRevenueBarCharts();
    
    // Initial Render
    refreshActiveViews();

    // Bind phone select switcher change
    document.getElementById("passenger-select-profile").addEventListener("change", function(e) {
        switchActivePassenger(e.target.value);
    });

    // Bind book ticket form on Admin Console
    document.getElementById("admin-booking-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("book-pass-name").value;
        const train = document.getElementById("book-train-select").value;
        const ticketClass = document.getElementById("book-class-select").value;
        const type = document.getElementById("book-type-select").value;
        
        const ticket = bookNewTicket(name, train, ticketClass, type);
        if (ticket) {
            alert(`Ticket booked successfully!\nPNR: ${ticket.pnr}\nAllocated Hall: ${getHallName(ticket.allocated_hall_id)}`);
            document.getElementById("admin-booking-form").reset();
        }
    });
};

// Window actions registration to bypass ES Modules scoping exports issues
window.switchAppView = switchAppView;
window.openDelayModal = openDelayModal;
window.closeDelayModal = closeDelayModal;
window.submitDelayUpdate = submitDelayUpdate;
window.triggerEmergencyEvacuation = triggerEmergencyEvacuation;
window.resetEmergencyEvacuation = resetEmergencyEvacuation;
window.purchaseVendingSnack = purchaseVendingSnack;
window.purchaseShopFood = purchaseShopFood;
window.executeGateScanSimulation = executeGateScanSimulation;
window.setGateDirection = function(dir) {
    STATE.selectedGateDirection = dir;
    document.getElementById("gate-tab-entry").className = dir === "entry" ? "nav-tab-btn active" : "nav-tab-btn";
    document.getElementById("gate-tab-exit").className = dir === "exit" ? "nav-tab-btn active" : "nav-tab-btn";
};
window.dismissPhoneNotification = dismissPhoneNotification;
window.switchActivePassenger = switchActivePassenger;
