const { app, BrowserWindow } = require("electron");
const path = require("path");

const devMode = process.env.NODE_ENV !== "production";

const config = require("./config.json");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      nodeIntegration: true, // enable node integration in the renderer process
    },
  });

  if (devMode) {
    win.maximize();
    win.openDevTools();
    config.ads_idle_time_ms = 5000;
    config.ads_show_time_ms = 2000;
  } else {
    win.fullScreen = true;
  }

  win.loadFile(path.join(__dirname, "index.html"));

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
