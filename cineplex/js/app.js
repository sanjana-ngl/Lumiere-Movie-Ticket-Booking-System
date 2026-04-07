console.log("I AM EDITING THE CORRECT FILE");
'use strict';
// ─── PERSISTENT USER STORAGE ──────────────────────────────────────────────────
function loadUsers() {
  try {
    const saved = localStorage.getItem('lumiere_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(mockState.users_data, parsed);
    }
  } catch(e) {}
}

function saveUsers() {
  try {
    // Save only registered users (exclude seed accounts)
    localStorage.setItem('lumiere_users', JSON.stringify(mockState.users_data));
  } catch(e) {}
}
// ─── LUMIÈRE CINEMA APP v2 ────────────────────────────────────────────────────

// ─── STATE ────────────────────────────────────────────────────────────────────
const state = {
  user: null,
  location: null,
  selectedDate: null,
  currentMovie: null,
  currentLanguage: null,
  currentShowtime: null,
  selectedSeats: new Set(),
  foodCart: {},
  paymentMethod: null,
  selectedWallet: null,
  lastBooking: null,
  allMovies: [],
  activeGenre: 'All',
  activeFoodCat: 'All',
};

// ─── MOVIE CATALOG (with poster images from public sources) ───────────────────
const MOVIE_DATA = {
  'Project Hail Mary': {
    emoji:'🚀',
    posterUrl:'https://m.media-amazon.com/images/M/MV5BNTkwNzJiYTctNzI3NC00NjE1LTlhYjktY2Q5MTdmMWFmNzcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    bg:'linear-gradient(135deg,#0a1628,#1a3a6a,#0a1628)',
    genre:'Sci-Fi/Adventure',
    year:2026
  },

  'Avatar: Fire and Ash': {
    emoji:'🔥',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
    bg:'linear-gradient(135deg,#1a0800,#5a1500,#1a0800)',
    genre:'Sci-Fi/Epic',
    year:2025
  },

  'Superman': {
    emoji:'🦸',
    posterUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQvSa8Kq9cGS1MvoTCZJkRuSi4a_Eqk64J6Q&s',
    bg:'linear-gradient(135deg,#0a0020,#1a0060,#0a0020)',
    genre:'Superhero',
    year:2025
  },

  'Mission: Impossible – The Final Reckoning': {
    emoji:'💣',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/1/1f/Mission_Impossible_%E2%80%93_The_Final_Reckoning_Poster.jpg',
    bg:'linear-gradient(135deg,#0a0a0a,#1a1a2a,#0a0a0a)',
    genre:'Action/Spy',
    year:2025
  },

  'The Fantastic Four: First Steps': {
    emoji:'⚡',
    posterUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu5GIa_Sn2zwqluHuEKfJOBBquurrbcPzAfA&s',
    bg:'linear-gradient(135deg,#0a1a10,#0a3a20,#0a1a10)',
    genre:'Superhero',
    year:2025
  },
  'Dhurandhar: The Revenge': {
    emoji:'⚔️',
    posterUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQRZ2mLWU9CyyJ9-x4HxmQMRsHkmbki1DcPg&s',
    bg:'linear-gradient(135deg,#1a0a00,#3a1500,#1a0a00)',
    genre:'Action/Thriller',
    year:2025
  },
  'Thunderbolts*': {
    emoji:'⚡',
    posterUrl:'https://variety.com/wp-content/uploads/2022/07/FYZDF2qUsAARFTi.jpeg?w=1000&h=667&crop=1&resize=1000%2C667',
    bg:'linear-gradient(135deg,#1a1a0a,#3a3a00,#1a1a0a)',
    genre:'Superhero',
    year:2025
  },

  'Ballerina': {
    emoji:'🩰',
    posterUrl:'https://meanjin.com.au/wp-content/uploads/2022/07/Grove.jpeg',
    bg:'linear-gradient(135deg,#1a0a1a,#3a0a3a,#1a0a1a)',
    genre:'Action/Thriller',
    year:2025
  },

  'Zootopia 2': {
    emoji:'🦊',
    posterUrl:'https://www.theskylineview.com/wp-content/uploads/2025/12/zootopia2-button-replacement-1759237213360.jpg',
    bg:'linear-gradient(135deg,#0a1a0a,#1a3a1a,#0a1a0a)',
    genre:'Animation',
    year:2025
  },

  'Elio': {
    emoji:'👽',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/4/4e/Elio_film_poster.jpg',
    bg:'linear-gradient(135deg,#0a0a1a,#101040,#0a0a1a)',
    genre:'Animation',
    year:2025
  },
'Final Destination: Bloodlines': {
    emoji:'💀',
    posterUrl:'https://i0.wp.com/troubledproductions.com/wp-content/uploads/2020/10/maxresdefault.jpg?fit=1200%2C675&ssl=1&w=640',
    bg:'linear-gradient(135deg,#1a0000,#3a0000,#1a0000)',
    genre:'Thriller/Horror',
    year:2025
  },
  'How to Train Your Dragon': {
    emoji:'🐉',
    posterUrl:'https://ca-times.brightspotcdn.com/dims4/default/a78617d/2147483647/strip/true/crop/9871x6579+4256+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F3c%2F32%2F5495eef44de794bcd32c1a684566%2F2569-fp-01025.jpg',
    bg:'linear-gradient(135deg,#0a1010,#0a2a2a,#0a1010)',
    genre:'Adventure',
    year:2025
  },

  'The Smurfs': {
    emoji:'🔵',
    posterUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXSp6l7b_pAL1acjgMsVi3pFMeU5AQDK_q1xvMnVgPlg&s',
    bg:'linear-gradient(135deg,#001020,#002050,#001020)',
    genre:'Animation',
    year:2025
  },

  'Snow White': {
    emoji:'🍎',
    posterUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1S9m85JoA69xAbjllvJV2uTAqBOdYXEW8Eg&s',
    bg:'linear-gradient(135deg,#1a0a1a,#2a1020,#1a0a1a)',
    genre:'Fantasy',
    year:2025
  },

  
  'Wolf Man': {
    emoji:'🐺',
    posterUrl:'https://m.media-amazon.com/images/M/MV5BOWU3ZjRmMGMtMzhmZi00YTZmLWJkODItZjE2ZmM3NjEzMGUyXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
    bg:'linear-gradient(135deg,#0a0a0a,#1a1010,#0a0a0a)',
    genre:'Thriller/Horror',
    year:2025
  },


  'War 2': {
    emoji:'💥',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/0/08/War_%282019_film%29_poster.jpg',
    bg:'linear-gradient(135deg,#0a0a1a,#1a0a3a,#0a0a1a)',
    genre:'Action/Thriller',
    year:2025
  },

  'Sitaare Zameen Par': {
    emoji:'⭐',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/3/3f/Taare_Zameen_Par_poster.jpg',
    bg:'linear-gradient(135deg,#0a1a0a,#0a2a15,#0a1a0a)',
    genre:'Drama/Family',
    year:2025
  },

  'Raid 2': {
    emoji:'🔫',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/2/2c/Raid_2018_film_poster.jpg',
    bg:'linear-gradient(135deg,#1a1a00,#2a2a00,#1a1a00)',
    genre:'Action/Thriller',
    year:2025
  },

  'Good Bad Ugly': {
    emoji:'🎭',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/4/45/The_Good%2C_the_Bad_and_the_Ugly_poster.jpg',
    bg:'linear-gradient(135deg,#1a0a00,#2a1500,#1a0a00)',
    genre:'Action/Comedy',
    year:2025
  },

  'Vidaamuyarchi': {
    emoji:'👊',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/6/6c/Valimai_poster.jpg',
    bg:'linear-gradient(135deg,#0a0a1a,#100a2a,#0a0a1a)',
    genre:'Action/Thriller',
    year:2025
  },

  'Thug Life': {
    emoji:'🎬',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/7/7d/Nayakan_poster.jpg',
    bg:'linear-gradient(135deg,#1a0505,#3a0f0f,#1a0505)',
    genre:'Action/Drama',
    year:2025
  },

  'Dude': {
    emoji:'😎',
    posterUrl:'https://upload.wikimedia.org/wikipedia/en/9/9a/Yes_Man_poster.jpg',
    bg:'linear-gradient(135deg,#0a0a0a,#151515,#0a0a0a)',
    genre:'Comedy/Drama',
    year:2025
  }
};

const LANG_META = {
  English: { icon:'🇬🇧', native:'English' },
  Hindi:   { icon:'🇮🇳', native:'हिन्दी' },
  Tamil:   { icon:'🏛️',  native:'தமிழ்' },
};

const LOCATIONS = [
  { name:'Chennai',   emoji:'🌊', count:'22 Screens' },
  { name:'Mumbai',    emoji:'🌆', count:'35 Screens' },
  { name:'Bangalore', emoji:'💻', count:'28 Screens' },
  { name:'Delhi',     emoji:'🕌', count:'40 Screens' },
  { name:'Hyderabad', emoji:'💎', count:'25 Screens' },
];

// ─── FOOD MENU ────────────────────────────────────────────────────────────────
const FOOD_MENU = [
  // Popcorn
  { name:'Popcorn (Regular)',    emoji:'🍿', price:120, cat:'Popcorn' },
  { name:'Popcorn (Large)',      emoji:'🍿', price:200, cat:'Popcorn' },
  { name:'Caramel Popcorn',      emoji:'🍯', price:180, cat:'Popcorn' },
  // Snacks
  { name:'Nachos with Cheese',   emoji:'🧀', price:200, cat:'Snacks' },
  { name:'Nachos with Salsa',    emoji:'🌮', price:180, cat:'Snacks' },
  { name:'Peri-Peri Nachos',     emoji:'🌶️', price:210, cat:'Snacks' },
  { name:'French Fries',         emoji:'🍟', price:130, cat:'Snacks' },
  { name:'Loaded Fries (Cheese+Jalapeño)', emoji:'🔥', price:190, cat:'Snacks' },
  { name:'Samosa (2 pcs)',        emoji:'🥟', price:80,  cat:'Snacks' },
  { name:'Vada Pav',             emoji:'🫓', price:70,  cat:'Snacks' },
  // Meals
  { name:'Hot Dog',              emoji:'🌭', price:160, cat:'Meals' },
  { name:'Chicken Burger',       emoji:'🍔', price:240, cat:'Meals' },
  { name:'Veg Burger',           emoji:'🥙', price:200, cat:'Meals' },
  // Drinks
  { name:'Soft Drink (Regular)', emoji:'🥤', price:100, cat:'Drinks' },
  { name:'Soft Drink (Large)',   emoji:'🥤', price:140, cat:'Drinks' },
  { name:'Fresh Lime Soda',      emoji:'🍋', price:90,  cat:'Drinks' },
  { name:'Cold Coffee',          emoji:'☕', price:130, cat:'Drinks' },
  { name:'Masala Chai',          emoji:'🫖', price:80,  cat:'Drinks' },
  { name:'Filter Coffee',        emoji:'☕', price:90,  cat:'Drinks' },
  { name:'Energy Drink',         emoji:'⚡', price:150, cat:'Drinks' },
  { name:'Mineral Water',        emoji:'💧', price:60,  cat:'Drinks' },
  // Combos
  { name:'Combo (Popcorn+Drink)',      emoji:'🎬', price:280, cat:'Combos' },
  { name:'Mega Combo (2×Popcorn+2×Drinks)', emoji:'🎉', price:500, cat:'Combos' },
  // Desserts
  { name:'Chocolate Brownie',    emoji:'🍫', price:120, cat:'Desserts' },
  { name:'Vanilla Ice Cream',    emoji:'🍦', price:100, cat:'Desserts' },
];

const PAYMENT_METHODS = [
  { id:'upi',    label:'UPI',         icon:'📱' },
  { id:'card',   label:'Credit/Debit Card', icon:'💳' },
  { id:'net',    label:'Net Banking', icon:'🏦' },
  { id:'wallet', label:'Wallet',      icon:'👝' },
];

const WALLETS = ['PhonePe','GPay','Paytm','Amazon Pay','Mobikwik','CRED'];

// ─── MOCK DATA (mirrors C++ logic exactly) ────────────────────────────────────
const mockState = { users:{}, seatMaps:{}, bookings:{}, counter:1001,
  users_data:{ demo:{username:'demo',passwordHash:'demo123h',email:'demo@lumiere.com',fullName:'Demo User'},
               admin:{username:'admin',passwordHash:'admin123h',email:'admin@lumiere.com',fullName:'Admin'} } };
function toMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return h * 60 + m;
}
const mockData = {
  loginUser(u, p) {
    if (!u || !p) return { success:false, error:'Please enter username and password' };
    const existing = mockState.users_data[u];
    if (!existing) return { success:false, error:'User not found. Please register first.' };
    if (existing.password !== p) return { success:false, error:'Incorrect password' };
    return { success:true, user: existing };
  },
  registerUser(u, p, e, n) {
    if (mockState.users_data[u]) return { success:false, error:'Username already taken' };
    if (u.length < 3) return { success:false, error:'Username too short (min 3)' };
    // Store password plaintext in mock (C++ backend hashes it)
    mockState.users_data[u] = { username:u, password:p, email:e, fullName:n };
    saveUsers();
    return { success:true, user: mockState.users_data[u] };
  },
  getMoviesForLocation(loc) {
    return Object.entries(MOVIE_DATA).map(([name, d]) => {
      // determine languages
      const langMap = {
        'English':['Project Hail Mary','Superman','Mission: Impossible – The Final Reckoning','The Fantastic Four: First Steps','Thunderbolts*','Ballerina','Wolf Man','Final Destination: Bloodlines','Avatar: Fire and Ash','Zootopia 2','Elio','How to Train Your Dragon','The Smurfs','Snow White'],
        'Hindi':['Avatar: Fire and Ash','Superman','The Fantastic Four: First Steps','Thunderbolts*','Zootopia 2','Elio','How to Train Your Dragon','The Smurfs','Snow White','Dhurandhar: The Revenge','War 2','Sitaare Zameen Par','Raid 2','Vidaamuyarchi','Thug Life'],
        'Tamil':['Avatar: Fire and Ash','Superman','Zootopia 2','Elio','How to Train Your Dragon','The Smurfs','Snow White','War 2','Good Bad Ugly','Vidaamuyarchi','Thug Life','Dude','Dhurandhar: The Revenge'],
      };
      const langs = Object.entries(langMap).filter(([l,ms])=>ms.includes(name)).map(([l])=>l);
      if (!langs.length) langs.push('English');
      const prices = { 'Project Hail Mary':320,'Avatar: Fire and Ash':400,'Superman':360,'Mission: Impossible – The Final Reckoning':420,'The Fantastic Four: First Steps':370,'Thunderbolts*':340,'Ballerina':330,'Wolf Man':300,'Final Destination: Bloodlines':310,'Zootopia 2':280,'Elio':260,'How to Train Your Dragon':320,'The Smurfs':250,'Snow White':290,'Dhurandhar: The Revenge':350,'War 2':380,'Sitaare Zameen Par':280,'Raid 2':300,'Good Bad Ugly':280,'Vidaamuyarchi':300,'Thug Life':290,'Dude':260 };
      return { name, genre:d.genre, minPrice: prices[name]||280, languages:langs };
    });
  },
  
  getShowtimes(loc, movie, lang, date) {
  const basePrices = { /* your object */ };
  const base = basePrices[movie] || 280;

  const slots = [
    { time:'10:00 AM', mult:1.0 },
    { time:'01:00 PM', mult:1.0 },
    { time:'04:00 PM', mult:1.1 },
    { time:'07:00 PM', mult:1.2 },
    { time:'10:00 PM', mult:1.1 }
  ];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.map(s => {
    const key = `${loc}|${movie}|${lang}|${s.time}|${date}`;
    if (!mockState.seatMaps[key]) mockState.seatMaps[key] = new Array(50).fill(0);

    const booked = mockState.seatMaps[key].filter(x => x).length;

    const showMinutes = toMinutes(s.time);
    const isPast = (date === todayStr) && (showMinutes <= currentMinutes);

    return {
      time: s.time,
      price: Math.round(base * s.mult / 10) * 10,
      available: 50 - booked,
      isPast: isPast // 🔥 THIS IS CRITICAL
    };
  });
},
  getShow(loc, movie, lang, time, date) {
    const basePrices = { 'Project Hail Mary':320,'Avatar: Fire and Ash':400,'Superman':360,'Mission: Impossible – The Final Reckoning':420,'The Fantastic Four: First Steps':370,'Thunderbolts*':340,'Ballerina':330,'Wolf Man':300,'Final Destination: Bloodlines':310,'Zootopia 2':280,'Elio':260,'How to Train Your Dragon':320,'The Smurfs':250,'Snow White':290,'Dhurandhar: The Revenge':350,'War 2':380,'Sitaare Zameen Par':280,'Raid 2':300,'Good Bad Ugly':280,'Vidaamuyarchi':300,'Thug Life':290,'Dude':260 };
    const base = basePrices[movie] || 280;
    const mult = { '10:00 AM':1,'01:00 PM':1,'04:00 PM':1.1,'07:00 PM':1.2,'10:00 PM':1.1 }[time] || 1;
    const key = `${loc}|${movie}|${lang}|${time}|${date}`;
    if (!mockState.seatMaps[key]) mockState.seatMaps[key] = new Array(50).fill(0);
    return {
      movieName:movie, showTime:time, language:lang,
      genre: MOVIE_DATA[movie]?.genre || '',
      ticketPrice: Math.round(base*mult/10)*10,
      seatMap: mockState.seatMaps[key],
      availableSeats: mockState.seatMaps[key].filter(x=>!x).length,
    };
  },
  bookSeats(name, email, loc, movie, lang, time, date, seatsStr, foodStr, payMethod) {
    const key = `${loc}|${movie}|${lang}|${time}|${date}`;
    if (!mockState.seatMaps[key]) mockState.seatMaps[key] = new Array(50).fill(0);
    const seats = seatsStr.split(',').filter(Boolean).map(Number);
    const food = foodStr.split('|').filter(Boolean);
    const unique = [...new Set(seats)];
    if (unique.length !== seats.length) return { success:false, error:'Duplicate seats selected' };
    for (const s of seats) {
      if (s < 1 || s > 50) return { success:false, error:`Seat ${s} out of range` };
      if (mockState.seatMaps[key][s-1]) return { success:false, error:`Seat ${s} already booked` };
    }
    for (const s of seats) mockState.seatMaps[key][s-1] = 1;
    const show = this.getShow(loc, movie, lang, time, date);
    const ticketAmt = seats.length * show.ticketPrice;
    const foodAmt = food.reduce((sum,f) => { const item=FOOD_MENU.find(x=>x.name===f); return sum+(item?.price||0); }, 0);
    const id = `BK${String(mockState.counter++).padStart(6,'0')}`;
    const bdate = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    const booking = { bookingID:id, customerName:name, customerEmail:email,
      movieName:movie, showTime:time, showDate:date, location:loc, language:lang,
      seats, foodItems:food, amount:ticketAmt+foodAmt, bookingDate:bdate, paymentMethod:payMethod };
    mockState.bookings[id] = booking;
    return { success:true, booking };
  },
  searchBooking(id) {
    const b = mockState.bookings[id.toUpperCase()];
    return b ? { found:true, booking:b } : { found:false, error:'Booking not found' };
  },
  getStats() {
    return { totalBookings: Object.keys(mockState.bookings).length };
  }
};

// ─── WASM BRIDGE ──────────────────────────────────────────────────────────────
function wasm(fn, ...args) {
  if (typeof Module !== 'undefined' && Module[fn]) {
    try { return JSON.parse(Module[fn](...args)); } catch(e) {}
  }
  return mockData[fn]?.(...args) ?? null;
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function initCursor() {
  const c = document.getElementById('cursor');
  const f = document.getElementById('cursorFollower');
  let fx=0,fy=0,mx=0,my=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; c.style.left=mx+'px'; c.style.top=my+'px'; });
  (function anim(){ fx+=(mx-fx)*.12; fy+=(my-fy)*.12; f.style.left=fx+'px'; f.style.top=fy+'px'; requestAnimationFrame(anim); })();
  document.addEventListener('mousedown',()=>{ c.style.transform='translate(-50%,-50%) scale(.6)'; f.style.width='48px'; f.style.height='48px'; });
  document.addEventListener('mouseup',()=>{ c.style.transform='translate(-50%,-50%) scale(1)'; f.style.width='32px'; f.style.height='32px'; });
}

function initNav() {
  window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>80));
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('loginForm').style.display    = tab==='login'    ? '' : 'none';
  document.getElementById('registerForm').style.display = tab==='register' ? '' : 'none';
  document.getElementById('authError').classList.add('hidden');
}

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if (!u || !p) { showAuthError('Please fill in all fields'); return; }
  const r = wasm('loginUser', u, p);
  if (r?.success) { loginSuccess(r.user); }
  else showAuthError(r?.error || 'Login failed');
}

function validatePassword(p) {
  const errors = [];
  if (p.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(p)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(p)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(p)) errors.push('One number');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) errors.push('One special character (!@#$% etc)');
  return errors;
}

function doRegister() {
  const n = document.getElementById('regName').value.trim();
  const e = document.getElementById('regEmail').value.trim();
  const u = document.getElementById('regUser').value.trim();
  const p = document.getElementById('regPass').value;
  if (!n||!e||!u||!p) { showAuthError('Please fill in all fields'); return; }
  const pwErrors = validatePassword(p);
  if (pwErrors.length) { showAuthError('Password must have: ' + pwErrors.join(', ')); return; }
  if (!e.includes('@')) { showAuthError('Enter a valid email address'); return; }
  const r = wasm('registerUser', u, p, e, n);
  if (r?.success) { loginSuccess(r.user); }
  else showAuthError(r?.error || 'Registration failed');
}

function loginSuccess(user) {
  state.user = user;
  document.getElementById('authOverlay').style.display = 'none';
  document.getElementById('navUserName').textContent = user.fullName || user.username;
  document.getElementById('inputName').value  = user.fullName || '';
  document.getElementById('inputEmail').value = user.email || '';
  showToast(`Welcome, ${user.fullName || user.username}! 🎬`, 'success');
  showHero();
}

function signOut() {
  state.user = null;
  document.getElementById('authOverlay').style.display = 'flex';
  document.getElementById('mainContainer').style.display = 'none';
  document.getElementById('heroSection').style.display = 'none';
  // Clear all auth fields
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regUser').value = '';
  document.getElementById('regPass').value = '';
  document.getElementById('authError').classList.add('hidden');
  switchAuthTab('login');
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function showHero() {
  document.getElementById('heroSection').style.display = 'flex';
  document.getElementById('mainContainer').style.display = 'none';
}

// ─── SECTION NAV ──────────────────────────────────────────────────────────────
const BOOKING_STEPS = { location:1, movies:2, language:3, showtimes:3, seats:4, food:5, confirm:6, payment:6, success:6 };

function showSection(name) {
  document.getElementById('heroSection').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
  window.scrollTo({ top:0, behavior:'smooth' });

  const all = ['location','movies','language','showtimes','seats','food','confirm','payment','success','search','stats'];
  all.forEach(id => { const el=document.getElementById(id+'Section'); if(el) el.classList.add('hidden'); });
  const target = document.getElementById(name+'Section');
  if (target) { target.classList.remove('hidden'); target.style.animation='none'; target.offsetHeight; target.style.animation=''; }

  const isFlow = BOOKING_STEPS[name] !== undefined;
  document.getElementById('stepTrack').style.display = isFlow ? 'flex' : 'none';
  const step = BOOKING_STEPS[name] || 1;
  for (let i=1;i<=6;i++) {
    const el = document.getElementById('step'+i);
    if (!el) continue;
    el.classList.remove('active','done');
    if (i===step) el.classList.add('active');
    else if (i<step) el.classList.add('done');
  }

  // Content loaders
  if (name==='location')  renderLocations();
  if (name==='movies')    renderMovies();
  if (name==='language')  renderLanguages();
  if (name==='showtimes') renderShowtimes();
  if (name==='seats')     renderSeats();
  if (name==='food')      renderFood();
  if (name==='confirm')   renderConfirm();
  if (name==='stats')     renderStats();
}

// ─── LOCATION ─────────────────────────────────────────────────────────────────
function renderLocations() {
  document.getElementById('locationGrid').innerHTML = LOCATIONS.map(l => `
    <div class="location-card" onclick="selectLocation('${l.name}')">
      <span class="location-emoji">${l.emoji}</span>
      <div class="location-name">${l.name}</div>
      <div class="location-count">${l.count}</div>
    </div>`).join('');
}

function selectLocation(loc) {
  state.location = loc;
  state.currentMovie = null; state.currentLanguage = null; state.currentShowtime = null;
  state.selectedSeats.clear(); state.foodCart = {};
  document.getElementById('moviesTitle').textContent = `Now Showing in ${loc}`;
  showSection('movies');
}

// ─── DATE PICKER ──────────────────────────────────────────────────────────────
function renderDatePicker() {
  const today = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let html = '';
  for (let i=0;i<4;i++) {
    const d = new Date(today); d.setDate(today.getDate()+i);
    const label = i===0 ? 'Today' : i===1 ? 'Tomorrow' : days[d.getDay()];
    const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    const isActive = state.selectedDate === dateStr;
    html += `<button class="date-chip ${isActive?'active':''}" onclick="selectDate('${dateStr}')">
      <span class="chip-day">${label}</span>
      <span class="chip-date">${d.getDate()} ${months[d.getMonth()]}</span>
    </button>`;
  }
  document.getElementById('datePicker').innerHTML = html;
}

function selectDate(dateStr) {
  state.selectedDate = dateStr;
  document.querySelectorAll('.date-chip').forEach(c => c.classList.toggle('active', c.onclick.toString().includes(dateStr)));
  filterMovies();
}

// ─── MOVIES ───────────────────────────────────────────────────────────────────
function renderMovies() {
  if (!state.selectedDate) {
    const today = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    state.selectedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  }
  renderDatePicker();

  const movies = wasm('getMoviesForLocation', state.location);
  state.allMovies = movies || [];

  // Genre filter
  const genres = ['All', ...new Set(state.allMovies.map(m => m.genre.split('/')[0]))];
  document.getElementById('genreFilter').innerHTML = genres.map(g =>
    `<button class="genre-pill ${state.activeGenre===g?'active':''}" onclick="filterByGenre('${g}')">${g}</button>`
  ).join('');

  renderMovieCards();
}

function renderMovieCards() {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = state.allMovies.map(m => {
    const p = MOVIE_DATA[m.name] || { 
      emoji: '🎬', 
      bg: 'linear-gradient(135deg,#1a1208,#2d2010)' 
    };

    const hidden = state.activeGenre !== 'All' && !m.genre.startsWith(state.activeGenre);

    return `
    <div class="movie-card ${hidden ? 'filtered-out' : ''}" onclick="selectMovie('${m.name.replace(/'/g, "\\'")}')">
      <div class="movie-poster">
        <div class="movie-poster-fallback" style="--poster-bg:${p.bg}">
          ${
            p.posterUrl
              ? `<img src="${p.posterUrl}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=&quot;poster-emoji&quot;>${p.emoji}</span>';">`
              : `<span class="poster-emoji">${p.emoji}</span>`
          }
        </div>
        <div class="movie-genre-tag">${m.genre.split('/')[0]}</div>
      </div>

      <div class="movie-info">
        <div class="movie-title">${m.name}</div>
        <div class="movie-meta">${m.genre} · ${MOVIE_DATA[m.name]?.year || 2025}</div>
        <div class="movie-langs">${m.languages.map(l => `<span class="lang-badge">${l}</span>`).join('')}</div>
        <div class="movie-price">From ₹${m.minPrice}</div>
      </div>
    </div>`;
  }).join('');
}

function filterByGenre(genre) {
  state.activeGenre = genre;
  document.querySelectorAll('.genre-pill').forEach(p => p.classList.toggle('active', p.textContent === genre));
  document.querySelectorAll('.movie-card').forEach((card, i) => {
    const m = state.allMovies[i];
    if (!m) return;
    card.classList.toggle('filtered-out', genre !== 'All' && !m.genre.startsWith(genre));
  });
}

function filterMovies() { renderMovieCards(); }

function selectMovie(name) {
  state.currentMovie = name;
  state.currentLanguage = null;
  state.currentShowtime = null;
  state.selectedSeats.clear();
  document.getElementById('langMovieTitle').textContent = name;
  showSection('language');
}

// ─── LANGUAGE ─────────────────────────────────────────────────────────────────
function renderLanguages() {
  const movie = state.allMovies.find(m => m.name === state.currentMovie);
  const langs = movie?.languages || ['English'];
  document.getElementById('langGrid').innerHTML = langs.map(l => {
    const meta = LANG_META[l] || { icon:'🌐', native:l };
    return `<div class="lang-card" onclick="selectLanguage('${l}')">
      <div class="lang-icon">${meta.icon}</div>
      <div class="lang-name">${l}</div>
      <div class="lang-native">${meta.native}</div>
    </div>`;
  }).join('');
}

function selectLanguage(lang) {
  state.currentLanguage = lang;
  document.getElementById('showtimesTitle').textContent = state.currentMovie;
  document.getElementById('showtimesSub').textContent = `${lang} · ${state.selectedDate} · ${state.location}`;
  showSection('showtimes');
}

// ─── SHOWTIMES ────────────────────────────────────────────────────────────────
function selectShowtime(time, price) {
  state.currentShowtime = { time, price };
  state.selectedSeats.clear();
  document.getElementById('seatsShowInfo').textContent =
    `${state.currentMovie} · ${state.currentLanguage} · ${time} · ${state.selectedDate} · ₹${price}/seat`;
  showSection('seats');
}

window.selectShowtime = selectShowtime;

function toMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return h * 60 + m;
}

function renderShowtimes() {
  const showtimes = wasm(
    'getShowtimes',
    state.location,
    state.currentMovie,
    state.currentLanguage,
    state.selectedDate
  );
  if (!showtimes) return;

  const now = new Date();

  document.getElementById('showtimesGrid').innerHTML = showtimes.map(s => {
    const low = s.available < 10;

    // convert showtime to today's date object
    const [time, period] = s.time.split(' ');
    let [h, m] = time.split(':').map(Number);

    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    const showDateTime = new Date(state.selectedDate);
    showDateTime.setHours(h, m, 0, 0);

    // 🔥 THIS FIXES EVERYTHING
    const isPast = showDateTime <= now;

    return `
    <div class="showtime-card ${isPast ? 'disabled' : ''}"
         ${isPast ? '' : `onclick="selectShowtime('${s.time}',${s.price})"`}>
      
      <div class="showtime-time">${s.time}</div>
      <div class="showtime-price">₹${s.price} / seat</div>

      <div class="showtime-avail ${low ? 'low' : ''}">
        ${isPast
          ? '⛔ Show started'
          : `${low ? '⚠ Only ' : ''}${s.available} seats available`}
      </div>

    </div>`;
  }).join('');
}

// ─── SEATS ────────────────────────────────────────────────────────────────────
function renderSeats() {
  const show = wasm('getShow', state.location, state.currentMovie, state.currentLanguage,
                    state.currentShowtime.time, state.selectedDate);
  if (!show) return;
  document.getElementById('rowLabels').innerHTML = ['A','B','C','D','E'].map(r=>`<div class="row-label">${r}</div>`).join('');
  const grid = document.getElementById('seatGrid');
  grid.innerHTML = '';
  for (let i=0;i<50;i++) {
    const num = i+1;
    const booked = show.seatMap[i]===1;
    const selected = state.selectedSeats.has(num);
    const div = document.createElement('div');
    div.className = `seat ${booked?'booked':selected?'selected':'available'}`;
    div.setAttribute('data-num', num);
    if (!booked) div.onclick = () => toggleSeat(num, div);
    grid.appendChild(div);
  }
  
  const colLabels = document.getElementById('colLabels');
colLabels.innerHTML = `
  <div class="col-spacer"></div>
  ${Array.from({ length: 10 }, (_, i) => `<div class="col-label">${i + 1}</div>`).join('')}
`;
  updateSeatSummary();
}

function toggleSeat(num, el) {
  if (state.selectedSeats.has(num)) { state.selectedSeats.delete(num); el.className='seat available'; }
  else { state.selectedSeats.add(num); el.className='seat selected'; }
  updateSeatSummary();
}

function updateSeatSummary() {
  const count = state.selectedSeats.size;
  const total = count * (state.currentShowtime?.price||0);
  document.getElementById('summaryText').textContent =
    count===0 ? 'Select seats to continue' :
    `${count} seat${count>1?'s':''} · ₹${total.toLocaleString('en-IN')} tickets`;
  document.getElementById('btnProceedFood').disabled = count===0;
}

function proceedToFood() {
  if (!state.selectedSeats.size) { showToast('Select at least one seat','error'); return; }
  showSection('food');
}

// ─── FOOD ──────────────────────────────────────────────────────────────────────
function renderFood() {
  // Category filter
  const cats = ['All', ...new Set(FOOD_MENU.map(f=>f.cat))];
  document.getElementById('foodCategories').innerHTML = cats.map(c=>
    `<button class="food-cat-btn ${state.activeFoodCat===c?'active':''}" onclick="filterFood('${c}')">${c}</button>`
  ).join('');

  document.getElementById('foodGrid').innerHTML = FOOD_MENU.map(item => {
    const qty = state.foodCart[item.name] || 0;
    const hidden = state.activeFoodCat !== 'All' && item.cat !== state.activeFoodCat;
    const key = item.name.replace(/[^a-z0-9]/gi,'_');
    return `<div class="food-card ${qty>0?'in-cart':''} ${hidden?'hidden-cat':''}" id="fc_${key}">
      <span class="food-emoji">${item.emoji}</span>
      <div class="food-name">${item.name}</div>
      <div class="food-price">₹${item.price}</div>
      <div class="food-qty-control">
        <button class="qty-btn" onclick="adjFood('${item.name}',-1)">−</button>
        <span class="qty-num" id="fq_${key}">${qty}</span>
        <button class="qty-btn" onclick="adjFood('${item.name}',1)">+</button>
      </div>
    </div>`;
  }).join('');
  updateCartDisplay();
}

function filterFood(cat) {
  state.activeFoodCat = cat;
  document.querySelectorAll('.food-cat-btn').forEach(b => b.classList.toggle('active', b.textContent===cat));
  document.querySelectorAll('.food-card').forEach(card => {
    const itemName = card.querySelector('.food-name')?.textContent;
    const item = FOOD_MENU.find(f=>f.name===itemName);
    if (item) card.classList.toggle('hidden-cat', cat!=='All' && item.cat!==cat);
  });
}

function adjFood(name, d) {
  const cur = state.foodCart[name]||0;
  const next = Math.max(0, cur+d);
  if (next===0) delete state.foodCart[name]; else state.foodCart[name]=next;
  const key = name.replace(/[^a-z0-9]/gi,'_');
  const card = document.getElementById('fc_'+key);
  const qEl  = document.getElementById('fq_'+key);
  if (qEl) qEl.textContent = next;
  if (card) card.classList.toggle('in-cart', next>0);
  updateCartDisplay();
}

function updateCartDisplay() {
  const items = Object.entries(state.foodCart);
  const el = document.getElementById('cartItems');
  if (!items.length) { el.textContent='Nothing added yet'; return; }
  const foodTotal = items.reduce((s,[n,q])=>{ const i=FOOD_MENU.find(f=>f.name===n); return s+(i?.price||0)*q; },0);
  el.innerHTML = items.map(([n,q])=>{
    const i=FOOD_MENU.find(f=>f.name===n);
    return `<div style="display:flex;justify-content:space-between;padding:.25rem 0;font-size:.82rem;">
      <span>${i?.emoji} ${n} × ${q}</span><span style="color:var(--gold)">₹${((i?.price||0)*q).toLocaleString('en-IN')}</span></div>`;
  }).join('') +
  `<div style="border-top:1px solid rgba(200,169,110,.15);margin-top:.75rem;padding-top:.75rem;display:flex;justify-content:space-between;font-weight:600;font-size:.88rem;">
    <span>Food Total</span><span style="color:var(--gold)">₹${foodTotal.toLocaleString('en-IN')}</span></div>`;
}

// ─── PAYMENT METHODS ──────────────────────────────────────────────────────────
function getPaymentFieldsHTML() {
  switch (state.paymentMethod) {
    case 'upi':
      return `
        <div class="payment-fields">
          <label class="pay-label">UPI ID</label>
          <input id="upiId" class="pay-input" type="text" placeholder="name@upi" />
        </div>
      `;

    case 'card':
      return `
        <div class="payment-fields">
          <label class="pay-label">Card Number</label>
          <input id="cardNum" class="pay-input" type="text" maxlength="19" placeholder="1234 5678 9012 3456" oninput="formatCardNumber(this)" />

          <div class="payment-row">
            <div>
              <label class="pay-label">Expiry</label>
              <input id="cardExpiry" class="pay-input" type="text" maxlength="5" placeholder="MM/YY" />
            </div>
            <div>
              <label class="pay-label">CVV</label>
              <input id="cardCvv" class="pay-input" type="password" maxlength="3" placeholder="123" />
            </div>
          </div>

          <label class="pay-label">Card Holder Name</label>
          <input id="cardName" class="pay-input" type="text" placeholder="Name on card" />
        </div>
      `;

    case 'net':
      return `
        <div class="payment-fields">
          <label class="pay-label">Select Bank</label>
          <select id="bankSelect" class="pay-input">
            <option value="">Choose your bank</option>
            <option>SBI</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
            <option>Kotak Mahindra Bank</option>
            <option>Canara Bank</option>
          </select>
        </div>
      `;

    case 'wallet':
      return `
        <div class="payment-fields">
          <label class="pay-label">Select Wallet</label>
          <div class="wallet-grid">
            ${WALLETS.map(w => `
              <button type="button"
                class="wallet-btn ${state.selectedWallet === w ? 'active' : ''}"
                onclick="selectWallet('${w}')">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>
      `;

    default:
      return `<div class="payment-fields payment-placeholder">Select a payment method</div>`;
  }
}

function renderPaymentMethods() {
  const wrap = document.getElementById('paymentMethods');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="payment-method-grid">
      ${PAYMENT_METHODS.map(m => `
        <button type="button"
          class="payment-method-card ${state.paymentMethod === m.id ? 'active' : ''}"
          onclick="selectPaymentMethod('${m.id}')">
          <span class="payment-method-icon">${m.icon}</span>
          <span class="payment-method-label">${m.label}</span>
        </button>
      `).join('')}
    </div>

    <div id="paymentDynamicFields" class="payment-dynamic-below">
      ${getPaymentFieldsHTML()}
    </div>
  `;
}

function selectPaymentMethod(methodId) {
  state.paymentMethod = methodId;
  state.selectedWallet = null;
  renderPaymentMethods();
}

function selectWallet(w) {
  state.selectedWallet = w;
  renderPaymentMethods();
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '').slice(0, 16);
  value = value.replace(/(.{4})/g, '$1 ').trim();
  input.value = value;
}

// ─── CONFIRM ─────────────────────────────────────────────────────────────────
function renderConfirm() {
  const seats = Array.from(state.selectedSeats).sort((a,b)=>a-b);
  const price = state.currentShowtime?.price || 0;
  const ticketAmt = seats.length * price;
  const foodItems = Object.entries(state.foodCart);
  const foodAmt = foodItems.reduce((s,[n,q])=>{ const i=FOOD_MENU.find(f=>f.name===n); return s+(i?.price||0)*q; },0);
  const total = ticketAmt + foodAmt;
  const seatLabels = seats.map(n=>{
    const row=String.fromCharCode(64+Math.ceil(n/10));
    const col=n%10||10;
    return `${row}${col}`;
  }).join(', ');
  const foodList = foodItems.length
    ? foodItems.map(([n,q])=>{ const i=FOOD_MENU.find(f=>f.name===n); return `${i?.emoji} ${n}×${q}`; }).join(', ')
    : 'None';
  document.getElementById('confirmSummary').innerHTML = `
    <div class="confirm-row"><span class="confirm-row-label">Film</span><span class="confirm-row-value">${state.currentMovie}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Language</span><span class="confirm-row-value">${state.currentLanguage}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Show</span><span class="confirm-row-value">${state.currentShowtime?.time}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Date</span><span class="confirm-row-value">${state.selectedDate}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Location</span><span class="confirm-row-value">${state.location}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Seats (${seats.length})</span><span class="confirm-row-value">${seatLabels}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Tickets</span><span class="confirm-row-value">₹${ticketAmt.toLocaleString('en-IN')}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">Food &amp; Drinks</span><span class="confirm-row-value" style="font-size:.75rem">${foodList}</span></div>
    <div class="confirm-row"><span class="confirm-row-label">F&amp;B Amount</span><span class="confirm-row-value">₹${foodAmt.toLocaleString('en-IN')}</span></div>
    <div class="confirm-total">
      <span class="confirm-total-label">Total Payable</span>
      <span class="confirm-total-value">₹${total.toLocaleString('en-IN')}</span>
    </div>`;
  renderPaymentMethods();
}

// ─── BOOKING ──────────────────────────────────────────────────────────────────
function confirmBooking() {
  const name  = document.getElementById('inputName').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  if (!name)  { showToast('Enter your name','error'); return; }
  if (!email||!email.includes('@')) { showToast('Enter a valid email','error'); return; }
  if (!state.paymentMethod) { showToast('Select a payment method','error'); return; }

  // Validate payment details
  if (state.paymentMethod==='upi' && !document.getElementById('upiId').value.includes('@'))
    { showToast('Enter a valid UPI ID (e.g. name@upi)','error'); return; }
  if (state.paymentMethod==='card' && document.getElementById('cardNum').value.replace(/\s/g,'').length<16)
    { showToast('Enter a valid 16-digit card number','error'); return; }
  if (state.paymentMethod==='net' && !document.getElementById('bankSelect').value)
    { showToast('Select a bank','error'); return; }
  if (state.paymentMethod==='wallet' && !state.selectedWallet)
    { showToast('Select a wallet','error'); return; }

  // Show payment processing
  showSection('payment');
  runPaymentAnimation(() => {
    // After payment animation, actually book
    const seats = Array.from(state.selectedSeats).sort((a,b)=>a-b).join(',');
    const foodParts = [];
    for (const [n,q] of Object.entries(state.foodCart)) for (let i=0;i<q;i++) foodParts.push(n);
    const food = foodParts.join('|');
    const payLabel = PAYMENT_METHODS.find(p=>p.id===state.paymentMethod)?.label || state.paymentMethod;
    const result = wasm('bookSeats', name, email, state.location, state.currentMovie,
                        state.currentLanguage, state.currentShowtime.time, state.selectedDate,
                        seats, food, payLabel);
    if (!result?.success) { showToast(result?.error||'Booking failed','error'); showSection('confirm'); return; }
    state.lastBooking = result.booking;
    renderSuccess(result.booking);
    showSection('success');
    showToast('🎬 Booking confirmed! Enjoy the show!','success');
  });
}

// ─── PAYMENT ANIMATION ────────────────────────────────────────────────────────
function runPaymentAnimation(callback) {
  const steps = [
    'Validating payment details…',
    'Connecting to payment gateway…',
    'Processing transaction…',
    'Confirming your booking…',
    'Locking your seats…',
  ];
  const stepsEl = document.getElementById('paySteps');
  const subEl   = document.getElementById('paySubText');
  stepsEl.innerHTML = steps.map((s,i)=>`
    <div class="pay-step pending" id="ps${i}">
      <div class="pay-step-icon">${i+1}</div>
      <span>${s}</span>
    </div>`).join('');
  let i = 0;
  function nextStep() {
    if (i>0) {
      const prev = document.getElementById('ps'+(i-1));
      if (prev) { prev.className='pay-step done'; prev.querySelector('.pay-step-icon').textContent='✓'; }
    }
    if (i >= steps.length) { callback(); return; }
    const cur = document.getElementById('ps'+i);
    if (cur) { cur.className='pay-step active'; }
    if (subEl) subEl.textContent = steps[i];
    i++;
    setTimeout(nextStep, 700 + Math.random()*400);
  }
  nextStep();
}

// ─── SUCCESS / TICKET ─────────────────────────────────────────────────────────
function renderSuccess(b) {
  const seats = b.seats.map(n=>{
    const row=String.fromCharCode(64+Math.ceil(n/10));
    const col=n%10||10;
    return `${row}${col}`;
  }).join(', ');
  const foodList = b.foodItems.length
    ? [...new Set(b.foodItems)].map(f=>{ const cnt=b.foodItems.filter(x=>x===f).length; const item=FOOD_MENU.find(x=>x.name===f); return `${item?.emoji||''} ${f}${cnt>1?` ×${cnt}`:''}`; }).join(', ')
    : 'None';
  document.getElementById('ticketCard').innerHTML = `
    <div class="ticket-header">
      <div><div class="ticket-cinema">LUMIÈRE</div>
        <div style="font-size:.7rem;color:var(--text-dim);margin-top:.25rem;letter-spacing:.1em">Premium Cinemas · ${b.location}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-dim)">Booking ID</div>
        <div style="font-family:var(--font-d);font-size:1.4rem;color:var(--gold);letter-spacing:.1em">${b.bookingID}</div>
      </div>
    </div>
    <div class="ticket-body">
      <div class="ticket-field"><label>Film</label><span>${b.movieName}</span></div>
      <div class="ticket-field"><label>Language</label><span>${b.language}</span></div>
      <div class="ticket-field"><label>Showtime</label><span>${b.showTime}</span></div>
      <div class="ticket-field"><label>Date</label><span>${b.showDate}</span></div>
      <div class="ticket-field"><label>Guest</label><span>${b.customerName}</span></div>
      <div class="ticket-field"><label>Payment</label><span>${b.paymentMethod}</span></div>
      <div class="ticket-field" style="grid-column:1/-1"><label>Seats</label><span>${seats}</span></div>
      <div class="ticket-field" style="grid-column:1/-1"><label>Food &amp; Drinks</label><span style="font-size:.82rem">${foodList}</span></div>
    </div>
    <div class="ticket-footer">
      <div><div style="font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-dim)">Total Paid</div>
        <div class="ticket-total">₹${b.amount.toLocaleString('en-IN')}</div>
      </div>
      <div style="font-size:.62rem;color:var(--text-dim);text-align:right;max-width:200px">
        Arrive 15 mins early. No outside food or drink permitted. Valid only on date of show.
      </div>
    </div>`;
  // QR Code
  const qr = document.getElementById('qrContainer');
  qr.innerHTML = '<div id="qrCode"></div>';
  try {
    new QRCode(document.getElementById('qrCode'), {
      text:`LUMIERE|${b.bookingID}|${b.movieName}|${b.showTime}|${b.showDate}|${b.customerName}`,
      width:120, height:120, colorDark:'#C8A96E', colorLight:'#120F08',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch(e) {
    qr.innerHTML=`<div style="width:120px;height:120px;background:var(--dark-3);border:1px solid rgba(200,169,110,.2);
      border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.7rem;
      color:var(--text-dim);text-align:center;padding:1rem">${b.bookingID}</div>`;
  }
}

// ─── DOWNLOAD PDF ─────────────────────────────────────────────────────────────
async function downloadTicket() {
  const b = state.lastBooking;
  if (!b) return;
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [200, 110] });

    // ── Background: light cream
    doc.setFillColor(252, 248, 240);
    doc.rect(0, 0, 200, 110, 'F');

    // ── Gold header band
    doc.setFillColor(200, 169, 110);
    doc.rect(0, 0, 200, 22, 'F');

    // ── Cinema name in header
    doc.setTextColor(20, 15, 8);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LUMIÈRE CINEMAS', 10, 14);

    // ── Booking ID in header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING ID', 150, 9);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(b.bookingID, 150, 17);

    // ── Dashed divider below header
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.4);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(10, 25, 190, 25);
    doc.setLineDashPattern([], 0);

    // ── Left column: movie details (x=10)
    const leftX = 10;
    let y = 32;
    const lineH = 10;

    const fields = [
      ['FILM',       b.movieName],
      ['LANGUAGE',   b.language],
      ['SHOWTIME',   b.showTime],
      ['DATE',       b.showDate],
      ['LOCATION',   b.location],
      ['GUEST',      b.customerName],
    ];

    fields.forEach(([label, value]) => {
      doc.setTextColor(140, 120, 80);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text(label, leftX, y);
      doc.setTextColor(30, 20, 10);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      // Truncate long text to avoid overflow
      const maxW = 55;
      const txt = doc.splitTextToSize(value || '', maxW)[0];
      doc.text(txt, leftX, y + 5);
      y += lineH;
    });

    // ── Middle column: seats + food + payment (x=80)
    const midX = 80;
    let y2 = 32;

    const seats = b.seats.map(n => {
      const row = String.fromCharCode(64 + Math.ceil(n / 10));
      const col = n % 10 || 10;
      return `${row}${col}`;
    }).join(', ');

    const midFields = [
      ['SEATS', seats],
      ['PAYMENT', b.paymentMethod],
      ['EMAIL', b.customerEmail],
    ];

    midFields.forEach(([label, value]) => {
      doc.setTextColor(140, 120, 80);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text(label, midX, y2);
      doc.setTextColor(30, 20, 10);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      const lines = doc.splitTextToSize(value || '', 60);
      doc.text(lines[0], midX, y2 + 5);
      if (lines[1]) doc.text(lines[1], midX, y2 + 9);
      y2 += lineH;
    });

    // Food
    if (b.foodItems && b.foodItems.length > 0) {
      const unique = [...new Set(b.foodItems)];
      const foodStr = unique.map(f => {
        const cnt = b.foodItems.filter(x => x === f).length;
        return `${f}${cnt > 1 ? ' x' + cnt : ''}`;
      }).join(', ');
      doc.setTextColor(140, 120, 80);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text('FOOD & DRINKS', midX, y2);
      doc.setTextColor(30, 20, 10);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      const foodLines = doc.splitTextToSize(foodStr, 60);
      foodLines.slice(0, 2).forEach((line, i) => doc.text(line, midX, y2 + 5 + i * 5));
      y2 += lineH + (foodLines.length > 1 ? 5 : 0);
    }

    // ── Total amount box (bottom-left area)
    doc.setFillColor(200, 169, 110);
    doc.roundedRect(10, 88, 65, 16, 2, 2, 'F');
    doc.setTextColor(20, 15, 8);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL PAID', 14, 94);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${b.amount.toLocaleString('en-IN')}`, 14, 101);

    // ── Footer note
    doc.setTextColor(140, 120, 80);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Arrive 15 mins early  ·  No outside food or drinks  ·  Valid only on date of show  ·  lumiere.in', 10, 108);

    // ── Dashed vertical separator before QR
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(158, 24, 158, 107);
    doc.setLineDashPattern([], 0);

    // ── QR Code in the right panel
    const qrEl = document.getElementById('qrCode');
    let qrDataURL = null;
    if (qrEl) {
      const canvas = qrEl.querySelector('canvas');
      const img = qrEl.querySelector('img');
      if (canvas) qrDataURL = canvas.toDataURL('image/png');
      else if (img) qrDataURL = img.src;
    }

    if (qrDataURL && qrDataURL.startsWith('data:')) {
      doc.addImage(qrDataURL, 'PNG', 163, 27, 32, 32);
    } else {
      // Fallback: draw a placeholder box
      doc.setFillColor(230, 220, 200);
      doc.rect(163, 27, 32, 32, 'F');
      doc.setTextColor(140, 120, 80);
      doc.setFontSize(7);
      doc.text('QR CODE', 167, 43);
    }

    // ── Booking ID below QR
    doc.setTextColor(140, 120, 80);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Scan to verify', 164, 63);
    doc.setTextColor(30, 20, 10);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(b.bookingID, 164, 70);

    // ── LUMIÈRE watermark text in right panel
    doc.setTextColor(200, 169, 110);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('LUMIÈRE', 164, 80);
    doc.setFontSize(6);
    doc.setTextColor(160, 140, 100);
    doc.text('Premium Cinemas', 164, 86);

    doc.save(`LUMIERE_${b.bookingID}.pdf`);
    showToast('Ticket downloaded!', 'success');
  } catch (e) {
    console.error(e);
    showToast('Download failed, opening print dialog...', 'error');
    window.print();
  }
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function doSearch() {
  const id = document.getElementById('searchInput').value.trim().toUpperCase();
  if (!id) { showToast('Enter a booking ID','error'); return; }
  const result = wasm('searchBooking', id);
  const el = document.getElementById('searchResult');
  el.classList.remove('hidden');
  if (!result?.found) {
    el.innerHTML=`<div style="color:var(--red);display:flex;align-items:center;gap:.75rem">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      Booking not found. Please check the ID.</div>`;
    return;
  }
  const b = result.booking;
  const seats = b.seats.map(n=>{const row=String.fromCharCode(64+Math.ceil(n/10));return `${row}${n%10||10}`;}).join(', ');
  el.innerHTML=`<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;color:var(--green)">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
    Booking found!
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    ${[['Booking ID',b.bookingID],['Customer',b.customerName],['Film',b.movieName],
       ['Language',b.language],['Showtime',b.showTime],['Date',b.showDate],
       ['Location',b.location],['Seats',seats],
       ['Payment',b.paymentMethod],['Total','₹'+b.amount?.toLocaleString('en-IN')]]
      .map(([l,v])=>`<div><div style="font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-dim);margin-bottom:.2rem">${l}</div>
        <div style="color:var(--cream);font-size:.88rem;font-weight:500">${v||''}</div></div>`).join('')}
  </div>`;
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function renderStats() {
  const s = wasm('getStats');
  document.getElementById('statsContent').innerHTML = `
    <div class="stats-overview">
      <div class="stat-card"><div class="stat-label">Total Bookings Made</div><div class="stat-value">${s?.totalBookings||0}</div></div>
      <div class="stat-card"><div class="stat-label">Movies Available</div><div class="stat-value">${Object.keys(MOVIE_DATA).length}</div></div>
      <div class="stat-card"><div class="stat-label">Cities</div><div class="stat-value">${LOCATIONS.length}</div></div>
      <div class="stat-card"><div class="stat-label">Daily Shows / Movie</div><div class="stat-value">5</div></div>
    </div>
    <div style="background:var(--dark-2);border:1px solid rgba(200,169,110,.1);border-radius:12px;padding:2rem">
      <div style="font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem">Now Showing — All Titles</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.75rem">
        ${Object.entries(MOVIE_DATA).map(([name,d])=>`
        <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem;background:var(--dark-3);border-radius:8px">
          <span style="font-size:1.5rem">${d.emoji}</span>
          <div><div style="font-size:.85rem;color:var(--cream)">${name}</div>
            <div style="font-size:.7rem;color:var(--text-dim)">${d.genre} · ${d.year}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>`;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent=msg; el.className=`toast ${type}`;
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.add('hidden'),3500);
}

function resetAndShowMovies() {
  state.currentMovie=null; state.currentLanguage=null; state.currentShowtime=null;
  state.selectedSeats.clear(); state.foodCart={}; state.paymentMethod=null;
  showSection('location');
}

// ─── INIT ──────────────────────────────────────────────────────────────────────
function initApp() {
  loadUsers();
  initCursor();
  initNav();
  document.getElementById('searchInput')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doSearch(); });
  document.getElementById('loginPass')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  // Pre-fill from user if logged in
  if (state.user) {
    document.getElementById('inputName').value  = state.user.fullName || '';
    document.getElementById('inputEmail').value = state.user.email || '';
  }
}
