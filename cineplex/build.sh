#!/bin/bash
# ─── LUMIÈRE CINEMA — WASM Build Script ──────────────────────────────────────
# Run this script to compile the C++ backend to WebAssembly

set -e

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     LUMIÈRE CINEMAS — WASM Build System          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check if emcc is available
if ! command -v emcc &> /dev/null; then
    echo "⚠  Emscripten not found. Please install it first:"
    echo ""
    echo "   git clone https://github.com/emscripten-core/emsdk.git"
    echo "   cd emsdk"
    echo "   ./emsdk install latest"
    echo "   ./emsdk activate latest"
    echo "   source ./emsdk_env.sh"
    echo ""
    echo "   Then re-run this script."
    exit 1
fi

echo "✓  Emscripten found: $(emcc --version | head -1)"
echo ""
echo "→  Compiling theatre.cpp to WebAssembly..."

emcc theatre.cpp \
    -o theatre.js \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS='["_getMovies","_getShow","_bookSeats","_searchBooking","_getStats","_getAllBookings","_malloc","_free"]' \
    -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","stringToUTF8","allocate","ALLOC_NORMAL"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=0 \
    -s NO_EXIT_RUNTIME=1 \
    -s ENVIRONMENT='web' \
    -O2 \
    --bind

echo "✓  Compiled successfully: theatre.js + theatre.wasm"
echo ""

# Add script tag to index.html if not already present
if grep -q "theatre.js" index.html; then
    echo "✓  index.html already references theatre.js"
else
    # Insert script tag before </body>
    sed -i 's|<script src="js/app.js"></script>|<script src="theatre.js"></script>\n<script src="js/app.js"></script>|' index.html
    echo "✓  Added theatre.js to index.html"
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Build complete! Ready to deploy.               ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "To run locally:"
echo "   python3 -m http.server 8080"
echo "   Open: http://localhost:8080"
echo ""
echo "To deploy to GitHub Pages:"
echo "   1. Push all files to a GitHub repo"
echo "   2. Go to Settings → Pages → Deploy from main branch"
echo ""
