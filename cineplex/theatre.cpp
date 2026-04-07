
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <ctime>
#include <cstdlib>
#include <set>

using namespace std;

// ─── User Class ───────────────────────────────────────────────────────────────
class User {
private:
    string username;
    string passwordHash;
    string email;
    string fullName;

    string simpleHash(const string& pass) const {
        size_t h = 5381;
        for (char c : pass) h = ((h << 5) + h) + c;
        return to_string(h);
    }

public:
    User() {}
    User(string uname, string pass, string em, string name)
        : username(uname), email(em), fullName(name) {
        passwordHash = simpleHash(pass);
    }

    string getUsername() const { return username; }
    string getEmail()    const { return email; }
    string getFullName() const { return fullName; }

    bool checkPassword(const string& pass) const {
        size_t h = 5381;
        for (char c : pass) h = ((h << 5) + h) + c;
        return to_string(h) == passwordHash;
    }

    string toJSON() const {
        return "{\"username\":\"" + username +
               "\",\"email\":\"" + email +
               "\",\"fullName\":\"" + fullName + "\"}";
    }
};

// ─── Booking Class ────────────────────────────────────────────────────────────
class Booking {
private:
    string bookingID, customerName, customerEmail;
    string movieName, showTime, showDate, location, language;
    vector<int>    seats;
    vector<string> foodItems;
    double   amount;
    string   bookingDate, paymentMethod;

public:
    Booking() : amount(0) {}

    Booking(string id, string name, string email,
            string movie, string time, string date, string loc, string lang,
            vector<int> sl, vector<string> fl,
            double amt, string bdate, string payMethod)
        : bookingID(id), customerName(name), customerEmail(email),
          movieName(movie), showTime(time), showDate(date),
          location(loc), language(lang),
          seats(sl), foodItems(fl),
          amount(amt), bookingDate(bdate), paymentMethod(payMethod) {}

    string getBookingID()    const { return bookingID; }
    string getCustomerName() const { return customerName; }
    vector<int> getSeats()   const { return seats; }
    double getAmount()       const { return amount; }

    string toJSON() const {
        ostringstream o;
        o << "{\"bookingID\":\"" << bookingID << "\","
          << "\"customerName\":\"" << customerName << "\","
          << "\"customerEmail\":\"" << customerEmail << "\","
          << "\"movieName\":\"" << movieName << "\","
          << "\"showTime\":\"" << showTime << "\","
          << "\"showDate\":\"" << showDate << "\","
          << "\"location\":\"" << location << "\","
          << "\"language\":\"" << language << "\","
          << "\"seats\":[";
        for (size_t i = 0; i < seats.size(); i++) { if (i) o << ","; o << seats[i]; }
        o << "],\"foodItems\":[";
        for (size_t i = 0; i < foodItems.size(); i++) { if (i) o << ","; o << "\"" << foodItems[i] << "\""; }
        o << "],\"amount\":" << fixed << setprecision(2) << amount
          << ",\"bookingDate\":\"" << bookingDate << "\""
          << ",\"paymentMethod\":\"" << paymentMethod << "\"}";
        return o.str();
    }
};

// ─── Show Class ───────────────────────────────────────────────────────────────
class Show {
private:
    string movieName, showTime, language, genre;
    double ticketPrice;
    map<string, vector<bool>> seatsByDate;
    static const int N = 50;

public:
    Show() : ticketPrice(0) {}
    Show(string m, string t, string l, string g, double p)
        : movieName(m), showTime(t), language(l), genre(g), ticketPrice(p) {}

    string getMovieName()  const { return movieName; }
    string getShowTime()   const { return showTime; }
    string getLanguage()   const { return language; }
    string getGenre()      const { return genre; }
    double getTicketPrice()const { return ticketPrice; }
    int    getTotalSeats() const { return N; }

    void ensureDate(const string& d) {
        if (!seatsByDate.count(d)) seatsByDate[d] = vector<bool>(N, false);
    }

    bool isSeatAvailable(const string& d, int s) {
        ensureDate(d);
        if (s < 1 || s > N) return false;
        return !seatsByDate[d][s-1];
    }

    bool bookSeat(const string& d, int s) {
        if (!isSeatAvailable(d, s)) return false;
        seatsByDate[d][s-1] = true;
        return true;
    }

    int getAvailableCount(const string& d) {
        ensureDate(d);
        int c = 0;
        for (bool b : seatsByDate[d]) if (!b) c++;
        return c;
    }

    int getBookedCount(const string& d) { return N - getAvailableCount(d); }

    double getOccupancy(const string& d) {
        return (double)getBookedCount(d) / N * 100.0;
    }

    string getSeatMapJSON(const string& d) {
        ensureDate(d);
        ostringstream o;
        o << "[";
        for (int i = 0; i < N; i++) { if (i) o << ","; o << (seatsByDate[d][i] ? "1" : "0"); }
        o << "]";
        return o.str();
    }

    string toJSON(const string& d) {
        ostringstream o;
        o << "{\"movieName\":\"" << movieName << "\","
          << "\"showTime\":\"" << showTime << "\","
          << "\"language\":\"" << language << "\","
          << "\"genre\":\"" << genre << "\","
          << "\"ticketPrice\":" << fixed << setprecision(0) << ticketPrice << ","
          << "\"availableSeats\":" << getAvailableCount(d) << ","
          << "\"bookedSeats\":" << getBookedCount(d) << ","
          << "\"occupancy\":" << fixed << setprecision(1) << getOccupancy(d) << ","
          << "\"seatMap\":" << getSeatMapJSON(d) << "}";
        return o.str();
    }
};

// ─── TheatreSystem Class ──────────────────────────────────────────────────────
class TheatreSystem {
private:
    // key: location + "|" + movie + "|" + language  ->  time -> Show
    map<string, map<string, Show>> shows;
    map<string, Booking> bookings;
    map<string, User>    users;
    int counter;

    string genID() {
        ostringstream o;
        o << "BK" << setw(6) << setfill('0') << counter++;
        return o.str();
    }

    string todayStr() {
        time_t now = time(nullptr);
        char buf[32];
        strftime(buf, sizeof(buf), "%d %b %Y", localtime(&now));
        return string(buf);
    }

    static string esc(const string& s) { return s; }

    void addShow(const string& loc, const string& movie, const string& lang,
                 const string& genre, double basePrice) {
        // 5 time slots with price multipliers
        vector<pair<string,double>> slots = {
            {"10:00 AM", 1.0}, {"01:00 PM", 1.0},
            {"04:00 PM", 1.1}, {"07:00 PM", 1.2}, {"10:00 PM", 1.1}
        };
        string key = loc + "|" + movie + "|" + lang;
        for (auto& [t, m] : slots) {
            double p = (int)(basePrice * m / 10 + 0.5) * 10.0;
            shows[key][t] = Show(movie, t, lang, genre, p);
        }
    }

    void initData() {
        vector<string> locs = {"Chennai","Mumbai","Bangalore","Delhi","Hyderabad"};

        // Each movie: {name, genre, {{lang, basePrice}, ...}}
        struct MI { string name, genre; vector<pair<string,double>> lp; };

        vector<MI> mv = {
            // Action/Adventure English
            {"Project Hail Mary",              "Sci-Fi/Adventure",  {{"English",320}}},
            {"Avatar: Fire and Ash",           "Sci-Fi/Epic",       {{"English",400},{"Hindi",380},{"Tamil",370}}},
            {"Superman",                       "Action/Superhero",  {{"English",360},{"Hindi",340},{"Tamil",330}}},
            {"Mission: Impossible – The Final Reckoning","Action/Spy",{{"English",420}}},
            {"The Fantastic Four: First Steps","Action/Superhero",  {{"English",370},{"Hindi",350}}},
            {"Thunderbolts*",                  "Action/Superhero",  {{"English",340},{"Hindi",320}}},
            {"Ballerina",                      "Action/Thriller",   {{"English",330}}},
            {"Wolf Man",                       "Thriller/Horror",   {{"English",300}}},
            {"Final Destination: Bloodlines",  "Thriller/Horror",   {{"English",310}}},
            // Family/Animation
            {"Zootopia 2",                     "Animation/Family",  {{"English",280},{"Hindi",260},{"Tamil",250}}},
            {"Elio",                           "Animation/Family",  {{"English",260},{"Hindi",240},{"Tamil",230}}},
            {"How to Train Your Dragon",       "Action/Adventure",  {{"English",320},{"Hindi",300},{"Tamil",290}}},
            {"The Smurfs",                     "Animation/Family",  {{"English",250},{"Hindi",230},{"Tamil",220}}},
            // Live-action / Fantasy
            {"Snow White",                     "Fantasy/Musical",   {{"English",290},{"Hindi",270},{"Tamil",260}}},
            // Hindi
            {"Dhurandhar: The Revenge",        "Action/Thriller",   {{"Hindi",350}}},
            {"War 2",                          "Action/Thriller",   {{"Hindi",380},{"Tamil",360}}},
            {"Sitaare Zameen Par",             "Drama/Family",      {{"Hindi",280}}},
            {"Raid 2",                         "Action/Thriller",   {{"Hindi",300}}},
            // Tamil
            {"Good Bad Ugly",                  "Action/Comedy",     {{"Tamil",280}}},
            {"Vidaamuyarchi",                  "Action/Thriller",   {{"Tamil",300},{"Hindi",280}}},
            {"Thug Life",                      "Action/Drama",      {{"Tamil",290},{"Hindi",270}}},
            {"Dude",                           "Comedy/Drama",      {{"Tamil",260}}},
        };

        for (auto& loc : locs) {
            for (auto& m : mv) {
                for (auto& [lang, price] : m.lp) {
                    addShow(loc, m.name, lang, m.genre, price);
                }
            }
        }

        // Seed users
        users["admin"] = User("admin","admin123","admin@lumiere.com","Admin");
        users["demo"]  = User("demo","demo123","demo@lumiere.com","Demo User");
    }

public:
    TheatreSystem() : counter(1001) { initData(); }

    // ── Auth ─────────────────────────────────────────────────────────────────
    string registerUser(const string& u, const string& p, const string& e, const string& n) {
        if (users.count(u)) return "{\"success\":false,\"error\":\"Username taken\"}";
        if (u.size() < 3)   return "{\"success\":false,\"error\":\"Username too short (min 3)\"}";
        if (p.size() < 6)   return "{\"success\":false,\"error\":\"Password too short (min 6)\"}";
        users[u] = User(u, p, e, n);
        return "{\"success\":true,\"user\":" + users[u].toJSON() + "}";
    }

    string loginUser(const string& u, const string& p) {
        if (!users.count(u)) return "{\"success\":false,\"error\":\"User not found\"}";
        if (!users[u].checkPassword(p)) return "{\"success\":false,\"error\":\"Wrong password\"}";
        return "{\"success\":true,\"user\":" + users[u].toJSON() + "}";
    }

    // ── Movies ────────────────────────────────────────────────────────────────
    string getMoviesForLocation(const string& loc) {
        // Collect unique movie names, genres, languages, min prices
        map<string, map<string,double>> movieLangMinPrice; // movie -> lang -> minPrice
        map<string, string> movieGenre;

        for (auto& [key, timemap] : shows) {
            // key = loc|movie|lang
            size_t p1 = key.find('|');
            if (p1 == string::npos) continue;
            string kloc = key.substr(0, p1);
            if (kloc != loc) continue;
            size_t p2 = key.rfind('|');
            string movie = key.substr(p1+1, p2-p1-1);
            string lang  = key.substr(p2+1);
            double mp = 999999;
            for (auto& [t, show] : timemap) {
                if (show.getTicketPrice() < mp) mp = show.getTicketPrice();
                movieGenre[movie] = show.getGenre();
            }
            if (!movieLangMinPrice[movie].count(lang) || movieLangMinPrice[movie][lang] > mp)
                movieLangMinPrice[movie][lang] = mp;
        }

        ostringstream o;
        o << "[";
        bool fm = true;
        for (auto& [movie, langs] : movieLangMinPrice) {
            if (!fm) o << ",";
            fm = false;
            double minP = 999999;
            for (auto& [l, p] : langs) if (p < minP) minP = p;
            o << "{\"name\":\"" << movie << "\","
              << "\"genre\":\"" << movieGenre[movie] << "\","
              << "\"minPrice\":" << (int)minP << ","
              << "\"languages\":[";
            bool fl = true;
            for (auto& [l, p] : langs) {
                if (!fl) o << ",";
                fl = false;
                o << "\"" << l << "\"";
            }
            o << "]}";
        }
        o << "]";
        return o.str();
    }

    string getShowtimes(const string& loc, const string& movie, const string& lang, const string& date) {
        string key = loc + "|" + movie + "|" + lang;
        if (!shows.count(key)) return "[]";
        ostringstream o;
        o << "[";
        bool f = true;
        for (auto& [t, show] : shows[key]) {
            if (!f) o << ",";
            f = false;
            // Use a local copy to call non-const methods
            Show& s = shows[key][t];
            o << "{\"time\":\"" << t << "\","
              << "\"price\":" << (int)show.getTicketPrice() << ","
              << "\"available\":" << s.getAvailableCount(date) << "}";
        }
        o << "]";
        return o.str();
    }

    string getShow(const string& loc, const string& movie, const string& lang,
                   const string& time, const string& date) {
        string key = loc + "|" + movie + "|" + lang;
        if (!shows.count(key) || !shows[key].count(time)) return "{\"error\":\"Not found\"}";
        return shows[key][time].toJSON(date);
    }

    // ── Booking ───────────────────────────────────────────────────────────────
    string bookSeats(const string& name, const string& email,
                     const string& loc, const string& movie, const string& lang,
                     const string& time, const string& date,
                     const vector<int>& sel, const vector<string>& food,
                     const string& payMethod) {
        string key = loc + "|" + movie + "|" + lang;
        if (!shows.count(key) || !shows[key].count(time))
            return "{\"success\":false,\"error\":\"Show not found\"}";

        Show& show = shows[key][time];

        // Duplicate check
        vector<int> u = sel;
        sort(u.begin(), u.end());
        if (unique(u.begin(), u.end()) != u.end())
            return "{\"success\":false,\"error\":\"Duplicate seats in selection\"}";

        // Range + availability
        for (int s : sel) {
            if (s < 1 || s > 50)
                return "{\"success\":false,\"error\":\"Seat " + to_string(s) + " out of range (1-50)\"}";
            if (!show.isSeatAvailable(date, s))
                return "{\"success\":false,\"error\":\"Seat " + to_string(s) + " already booked\"}";
        }

        // Food prices
        map<string,double> fp = {
            {"Popcorn (Regular)",120}, {"Popcorn (Large)",200},
            {"Nachos with Cheese",200}, {"Nachos with Salsa",180},
            {"Soft Drink (Regular)",100}, {"Soft Drink (Large)",140},
            {"Fresh Lime Soda",90}, {"Cold Coffee",130},
            {"Combo (Popcorn+Drink)",280}, {"Mega Combo (2×Popcorn+2×Drinks)",500},
            {"Hot Dog",160}, {"Chicken Burger",240}, {"Veg Burger",200},
            {"French Fries",130}, {"Loaded Fries (Cheese+Jalapeño)",190},
            {"Chocolate Brownie",120}, {"Vanilla Ice Cream",100},
            {"Mineral Water",60}, {"Energy Drink",150},
            {"Masala Chai",80}, {"Filter Coffee",90},
            {"Samosa (2 pcs)",80}, {"Vada Pav",70},
            {"Peri-Peri Nachos",210}, {"Caramel Popcorn",180},
        };

        double ticketAmt = sel.size() * show.getTicketPrice();
        double foodAmt   = 0;
        for (auto& f : food) if (fp.count(f)) foodAmt += fp[f];
        double total = ticketAmt + foodAmt;

        for (int s : sel) show.bookSeat(date, s);

        string id = genID();
        Booking b(id, name, email, movie, time, date, loc, lang, sel, food, total, todayStr(), payMethod);
        bookings[id] = b;
        return "{\"success\":true,\"booking\":" + b.toJSON() + "}";
    }

    string searchBooking(const string& id) {
        if (bookings.count(id)) return "{\"found\":true,\"booking\":" + bookings[id].toJSON() + "}";
        return "{\"found\":false,\"error\":\"Booking not found\"}";
    }

    string getStats() {
        ostringstream o;
        o << "{\"totalBookings\":" << bookings.size() << "}";
        return o.str();
    }
};

// ─── Global ───────────────────────────────────────────────────────────────────
TheatreSystem theatre;

extern "C" {

EMSCRIPTEN_KEEPALIVE
const char* registerUser(const char* u, const char* p, const char* e, const char* n) {
    static string r; r = theatre.registerUser(u, p, e, n); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* loginUser(const char* u, const char* p) {
    static string r; r = theatre.loginUser(u, p); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* getMoviesForLocation(const char* loc) {
    static string r; r = theatre.getMoviesForLocation(loc); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* getShowtimes(const char* loc, const char* movie, const char* lang, const char* date) {
    static string r; r = theatre.getShowtimes(loc, movie, lang, date); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* getShow(const char* loc, const char* movie, const char* lang,
                    const char* time, const char* date) {
    static string r; r = theatre.getShow(loc, movie, lang, time, date); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* bookSeats(const char* name, const char* email,
                      const char* loc, const char* movie, const char* lang,
                      const char* time, const char* date,
                      const char* seatsStr, const char* foodStr, const char* payMethod) {
    static string r;
    vector<int> seats;
    stringstream ss(seatsStr); string tok;
    while (getline(ss, tok, ',')) if (!tok.empty()) try { seats.push_back(stoi(tok)); } catch(...) {}
    vector<string> food;
    stringstream sf(foodStr);
    while (getline(sf, tok, '|')) if (!tok.empty()) food.push_back(tok);
    r = theatre.bookSeats(name, email, loc, movie, lang, time, date, seats, food, payMethod);
    return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* searchBooking(const char* id) {
    static string r; r = theatre.searchBooking(id); return r.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* getStats() {
    static string r; r = theatre.getStats(); return r.c_str();
}

} // extern "C"
