const { app, BrowserWindow, session, powerMonitor } = require("electron");
const path = require("path");

const devMode = process.env.NODE_ENV !== "production";

const config = require("./config.json");
let win;
let isIdle = false;

function createWindow() {
  const currentSession = session.fromPartition("persist:someName").cookies;
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      session: currentSession,
      nodeIntegration: true, // enable node integration in the renderer process
    },
  });

  if (devMode) {
    win.maximize();
    win.openDevTools();
    config.ads_idle_time_sec = 3;
    config.ads_show_time_ms = 4000;
  } else {
    win.fullScreen = true;
  }

  win.loadFile(path.join(__dirname, "index.html"));

  setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    const shouldBeIdle = idleTime > config.ads_idle_time_sec;
    if (shouldBeIdle !== isIdle) {
      isIdle = shouldBeIdle;
      console.log("changing idle state", isIdle);
      win.webContents.executeJavaScript(
        shouldBeIdle ? "sleep()" : "wake()",
        (result) => console.log(result)
      );
    }
  }, 1000);

  win.webContents.on("did-finish-load", async () => {
    win.webContents.executeJavaScript(
      `init(${JSON.stringify(config)});`,
      (result) => {
        console.log(result);
      }
    );
  });
}

app.on("ready", createWindow);
