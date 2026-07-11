# How to Run Locally

**Requirement:** Node.js 18+ and Google Chrome must be installed.

First time only — install dependencies:
```
npm install
```

---

## Mac
Double-click **`start.command`** in Finder.

> First time only: right-click → Open → Open (to allow running unsigned scripts).

## Windows
Double-click **`start.bat`**.

## Linux / Manual
```
npm run dev
```
Then open `http://localhost:3000` in Chrome.

---

The site opens automatically at `http://localhost:3000` with MIDI and audio enabled.

To stop the server, press `Ctrl+C` in the terminal, or run:
```
# Mac / Linux
kill $(lsof -ti:3000)

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
