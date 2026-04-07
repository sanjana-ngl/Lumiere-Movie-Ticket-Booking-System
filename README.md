# 🎬 LUMIÈRE CINEMAS
## Movie Ticket Booking System — C++ OOP + WebAssembly

A premium, full-featured cinema booking application built with **C++ (OOP)** compiled to **WebAssembly**, wrapped in a luxurious dark-gold frontend.

---

## 📁 Project Structure

```
cineplex/
├── theatre.cpp          ← C++ backend (OOP core)
├── index.html           ← Main HTML page
├── build.sh             ← WASM compilation script
├── css/
│   └── style.css        ← Luxury dark cinema theme
└── js/
    └── app.js           ← Frontend logic + WASM bridge
```

---

## 🏗️ C++ OOP Architecture

| Class | Responsibility |
|-------|---------------|
| `Booking` | Stores booking details: ID, name, email, movie, seats, food, amount |
| `Show` | Manages the 5×10 seat vector, tracks availability, computes occupancy |
| `TheatreSystem` | Orchestrates all shows, generates BookingIDs, manages persistence in-memory |

### Key C++ Concepts Used
- **Classes** with private data members and public member functions
- **Constructors** for all three classes
- **Encapsulation** — all data private, exposed via getters
- **STL containers**: `vector<bool>` (seats), `map<string,Booking>`, `map<string,map<string,Show>>`
- **`fstream`-ready** (architecture supports file I/O; in WASM, state is in-memory)
- **Input validation**: duplicate seats, range check (1-50), already-booked check
- **BookingID generation**: sequential `BK001001`, `BK001002`, ...
- **Emscripten WASM bindings** via `extern "C"` + `EMSCRIPTEN_KEEPALIVE`

---

## ✨ Frontend Features

- 🎭 **Luxury dark-gold cinema aesthetic** with Playfair Display + Bebas Neue fonts
- 🎬 **5 Now Showing movies** including Project Hail Mary, Dune: Brand New Day, Durandhar, Thug Life, Mission: Impossible 8
- 🕐 **3 showtimes per movie** with pricing
- 💺 **Interactive 5×10 seat map** with hover animations, row/column labels, screen direction indicator
- 🍿 **Food & Drinks menu**: Popcorn, Nachos, Soft Drink, Combo, Hot Dog
- 🧾 **PDF ticket download** via jsPDF with all booking details
- 📱 **QR code** on every ticket (via qrcodejs)
- 🔍 **Search bookings** by Booking ID
- 📊 **Live occupancy stats** per show with animated progress bars
- ✨ **Custom cursor**, noise overlay, film reel animations
- 📱 **Responsive** for mobile

---

## 🚀 Setup & Running

### Option A: Run Without WASM (Pure JavaScript Mock — Instant)

No compilation needed! The app has a complete JavaScript mock that mirrors the C++ logic.

```bash
cd cineplex
python3 -m http.server 8080
```

Open **http://localhost:8080** in your browser.

> The JavaScript mock in `js/app.js` (`mockData` object) exactly replicates the C++ backend behavior — same validation, same BookingID format, same seat locking.

---

### Option B: Full WASM Build (Recommended for Submission)

#### Step 1: Install Emscripten

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh    # or emsdk_env.bat on Windows
cd ..
```

#### Step 2: Compile C++ to WASM

```bash
cd cineplex
chmod +x build.sh
./build.sh
```

This generates:
- `theatre.js` — JavaScript glue code
- `theatre.wasm` — compiled WebAssembly binary

#### Step 3: Run Locally

```bash
python3 -m http.server 8080
```

Open **http://localhost:8080**

> ⚠️ WASM files must be served over HTTP (not file://) due to CORS restrictions.

---

## 🌐 Deploy to GitHub Pages (Hosting Requirement)

1. **Create a GitHub repository** (e.g., `lumiere-cinema`)

2. **Push all files**:
```bash
git init
git add .
git commit -m "LUMIÈRE Cinema Booking System"
git remote add origin https://github.com/YOUR_USERNAME/lumiere-cinema.git
git push -u origin main
```

3. **Enable GitHub Pages**:
   - Go to repository → **Settings** → **Pages**
   - Source: **Deploy from a branch** → **main** → **/ (root)**
   - Click **Save**

4. Your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/lumiere-cinema/
   ```

---

## 🎟️ How to Use the App

1. **Select a Film** from the Now Showing grid
2. **Choose a Showtime** — 3 options per movie with pricing
3. **Pick Your Seats** — click seats on the interactive grid (grey = booked, white = available, gold = selected)
4. **Add Food & Drinks** — popcorn, nachos, drinks with quantity control
5. **Confirm** — enter name & email, review total, click Confirm & Book
6. **Download Ticket** — PDF with QR code, all details, booking ID

---

## 📊 Validation (C++ Backend)

| Check | Behavior |
|-------|----------|
| Seat out of range | Error: "Seat X is out of range (1-50)" |
| Seat already booked | Error: "Seat X is already booked" |
| Duplicate in same booking | Error: "Duplicate seats selected" |
| Empty name/email | Rejected at frontend before WASM call |

---

## 📦 Dependencies (CDN — No npm needed)

| Library | Purpose |
|---------|---------|
| `qrcodejs` | QR code on ticket |
| `jsPDF` | PDF ticket download |
| Google Fonts | Playfair Display, DM Sans, Bebas Neue |

---

## 🎓 Assignment Checklist

- ✅ Minimum 2 classes (`Show`, `Booking`, `TheatreSystem`)
- ✅ Private data members
- ✅ Public member functions (5+)
- ✅ Constructor usage
- ✅ Encapsulation
- ✅ Menu-driven system (section-based navigation)
- ✅ STL: `vector`, `string`, `map`
- ✅ File handling architecture (WASM in-memory; C++ code is fstream-ready)
- ✅ Input validation
- ✅ Error handling
- ✅ WebAssembly compilation
- ✅ Hosted via GitHub Pages
