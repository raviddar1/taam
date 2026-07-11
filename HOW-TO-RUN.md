# How to Run Locally

**Requirement:** Python 3 and Google Chrome must be installed.

---

## Mac
Double-click **`start.command`** in Finder.

> First time only: right-click → Open → Open (to allow running unsigned scripts).

## Windows
Double-click **`start.bat`**.

## Linux
Run in terminal:
```
bash start.sh
```

---

The site opens automatically at `http://localhost:8080` with MIDI and audio enabled.

To stop the server, close the terminal window that opened, or run:
```
# Mac / Linux
kill $(lsof -ti:8080)

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```
