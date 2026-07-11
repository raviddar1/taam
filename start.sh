#!/bin/bash
cd "$(dirname "$0")"

if ! lsof -ti:3000 > /dev/null 2>&1; then
  npm run dev &
  sleep 3
fi

if command -v google-chrome &>/dev/null; then
  google-chrome --autoplay-policy=no-user-gesture-required "http://localhost:3000"
elif command -v chromium-browser &>/dev/null; then
  chromium-browser --autoplay-policy=no-user-gesture-required "http://localhost:3000"
elif command -v chromium &>/dev/null; then
  chromium --autoplay-policy=no-user-gesture-required "http://localhost:3000"
else
  echo "Open http://localhost:3000 in Chrome"
fi
