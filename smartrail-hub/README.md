# SmartRail Hub – Intelligent Passenger Management & Revenue Generation System

SmartRail Hub is an innovative passenger management and station analytics system designed for Indian Railways. It optimizes passenger experiences, automates waiting hall allocations, mitigates platform overcrowding, handles emergency evacuations, and maximizes revenue streams from advertisements and vendor kiosks.

---

## 🌟 Key Features

1. **QR-Based Access Management**: Unified gate turnstile verification supporting mobile app QR codes (online passengers) and printed paper-based QR tickets (offline passengers).
2. **Dynamic Waiting Hall Allocation**: Automatic placement in waiting halls based on ticket class (Executive, Sleeper, General) and scheduled boarding platforms.
3. **AI Crowd Balancing**: Dynamically reroutes passengers to adjacent comfortable halls upon station check-in if their primary lounge exceeds **80% occupancy**.
4. **Live Train Tracking & Delays**: Real-time notifications of delay updates. Automatically recalculates ETAs, count-downs, and triggers boarding alerts **10–20 minutes before train departure**.
5. **Emergency Evacuation Override**: One-click override button instantly opens all gates (evacuation mode), sounds siren overlays, halts timer progressions, and directs waiting hall occupants toward safe exit platforms.
6. **Station Revenue Analytics**: Tracks advertising campaigns impressions, retail shops transactions, and smart vending machines sales, visualising revenue splits in real-time.
7. **Public Station Bulletin Display**: Digital arrivals/departures timetable coupled with wait hall comfort indices and context-targeted advertisements.

---

## 🛠️ Technology Stack

* **Front-end bundler**: Vite (Fast HMR development environment)
* **Logic Core**: Vanilla ES6+ Javascript
* **Design & Animations**: High-fidelity custom CSS with Glassmorphism styles and Neon cue variables.
* **Database Layer**: Persistent Client-side SQL-like structures synced with `localStorage`.
* **Data Visualizations**: Responsive canvas drawings rendering sinusoidal crowd forecasts and revenue breakdowns.

---

## 💾 Database Schema

The database model leverages JSON relations representing database structures:

### Waiting Halls (`halls`)
* `id` (String): Hall identifier.
* `name` (String): Full descriptive name.
* `class` (String): Class level (`Executive`, `Sleeper`, `General`).
* `capacity` (Integer): Maximum count limits.
* `occupancy` (Integer): Real-time passenger count inside.
* `comfort_index` (Float): Occupancy ratio (`occupancy / capacity`).
* `platform_near` (String): Closest boarding platform.

### Train Schedules (`trains`)
* `train_no` (String): Railway train number.
* `name` (String): Train identifier.
* `source` / `destination` (String): Route coordinates.
* `platform` (String): Departure platform assignment.
* `departure_time` (String): Scheduled departure (`HH:MM`).
* `status` (String): `On Time`, `Delayed`, `Departed`.
* `delay_mins` (Integer): Active delays.

### Passenger Tickets (`tickets`)
* `pnr` (String): Unique 10-digit Passenger Name Record.
* `passenger_name` (String): Full name.
* `train_no` (String): Associated train number.
* `ticket_class` (String): Class level.
* `coach` / `seat` (String/Integer): Seat allocations.
* `allocated_hall_id` (String): Waiting lounge target.
* `status` (String): `Booked`, `Checked In`, `Boarded`, `Checked Out`.
* `ticket_type` (String): `Mobile` or `Printed`.

### Revenue Transactions (`transactions`)
* `id` (String): Transaction ID.
* `type` (String): `Advertisement`, `Shop Rent`, or `Vending Machine`.
* `source_name` (String): Product or campaign reference.
* `amount` (Decimal): Financial gains.
* `timestamp` (ISOString): Execution time.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
Make sure you have Node.js installed on your local system.

### Installation & Launch
1. Open your terminal shell and install the package dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the local host address:
   `http://localhost:3005` (or the port specified in your console logs).

---

## 🧪 Verification Scenarios to Try

1. **Verify Check-in Access**:
   * Navigate to the **Passenger App** view. Note down the PNR (e.g. `PNR-4829103`).
   * Switch to the **Smart Gates** tab. Choose `PNR-4829103` from the selector dropdown. Keep "Entry Scanner" selected.
   * Click **SCAN CREDENTIALS AT TURNSTILE**.
   * Observe the turnstile visualizer: Gate flappers rotate open, status indicator turns GREEN, and PNR status becomes `Checked In`. 
   * Swap to **Admin Console**. Check the live logs feed at the bottom right; a check-in event will have been registered. Hall A occupancy will have increased.

2. **Test Retail Revenue Commission Streams**:
   * Open the **Shopping Zone** tab.
   * Under Vending Express, click on **Masala Chai ($15.00)**.
   * Under Station Shopping Zone, click on **Order Meal ($250)** at Chai Point.
   * Return to the **Admin Console**.
   * Observe the Revenue stats card: the overall amount increases immediately, and the vertical bar chart heights automatically recalculate to reflect the new vending and shop commission revenue distributions.

3. **Initiate Evacuation Procedure**:
   * Click on the red **🚨 TRIGGER EVACUATION** button on the top right header.
   * Notice that the whole station console activates flashing sirens, and all smart gate barriers swing open.
   * View the **Public Displays** board: all waiting halls display evac routes, and timetables log warnings.
   * Check the Admin logs: waiting hall occupancies start decreasing progressively towards zero as station evacuations complete.
   * Press **Reset Siren** on the red header banner to return the station back to normal operations.
