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
    win.openDevTools();
  } else {
    win.maximize();
    win.fullScreen = true;
  }

  win.loadFile(path.join(__dirname, "index.html"));

  win.webContents.on("did-finish-load", async () => {
    win.webContents.executeJavaScript(
      `createAds(${JSON.stringify(config.ads_idle_items)})`,
      (result) => {
        console.log(result);
      }
    );
  });
}

app.on("ready", createWindow);
