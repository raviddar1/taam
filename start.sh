#!/bin/bash
cd "$(dirname "$0")"

# Start server if not already running
if ! lsof -ti:8080 > /dev/null 2>&1; then
  python3 -m http.server 8080 &
  sleep 1
fi

# Open in Chrome (Linux)
if command -v google-chrome &>/dev/null; then
  google-chrome --autoplay-policy=no-user-gesture-required "http://localhost:8080"
elif command -v chromium-browser &>/dev/null; then
  chromium-browser --autoplay-policy=no-user-gesture-required "http://localhost:8080"
elif command -v chromium &>/dev/null; then
  chromium --autoplay-policy=no-user-gesture-required "http://localhost:8080"
else
  echo "Chrome not found. Open http://localhost:8080 manually in Chrome."
fi
