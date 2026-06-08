const screenData = {
    dashboard: {
        title: "Dashboard",
        desc: "Central hub for tracking daily sustainability goals and environmental impact metrics. Includes quick-view widgets for carbon saved, water used, and community rankings."
    },
    logging: {
        title: "Habit Logging",
        desc: "Streamlined entry for daily activities. Categorized by Transport, Waste, Food, and Energy. Designed for high efficiency and minimal user friction."
    },
    stats: {
        title: "Analytics",
        desc: "In-depth visualization of historical performance. Users can toggle between weekly, monthly, and yearly views to see long-term sustainability trends."
    }
};

function showScreen(screenId) {
    // Update active screen item in sidebar
    document.querySelectorAll('.screen-item').forEach(item => {
        item.classList.remove('active');
        if (item.innerText.toLowerCase().includes(screenId)) {
            item.classList.add('active');
        }
    });

    // Switch wireframe screen in phone mockup
    document.querySelectorAll('.wireframe-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`screen-${screenId}`).classList.add('active');

    // Update descriptions
    document.getElementById('screen-title').innerText = screenData[screenId].title;
    document.getElementById('screen-desc').innerText = screenData[screenId].desc;
}

function switchView(viewId) {
    // Update top nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === viewId) {
            btn.classList.add('active');
        }
    });

    // Update view visibility
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewId}-view`).classList.add('active');
}

// Initial state
window.onload = () => {
    showScreen('dashboard');
};
