const {
  shell,
  app,
  BrowserWindow,
  session,
  powerMonitor,
} = require("electron");
const { join } = require("path");
const { readFileSync } = require("fs");
const config = require("./base-config.json");
const { writeFileSync } = require("original-fs");

let win;
let isIdle = false;

const appData = app.getPath("userData");
console.log("working dir:\n", appData);

const lockHost = app.isPackaged || process.env.LOCK_HOST;

function createWindow() {
  checkConfig();

  const currentSession = session.fromPartition("persist:currentSession");
  win = new BrowserWindow({
    alwaysOnTop: lockHost,
    frame: false,
    thickFrame: false,
    autoHideMenuBar: true,
    kiosk: lockHost,
    width: 1080,
    height: 1920,
    webPreferences: {
      session: currentSession,
      contextIsolation: true,
    },
  });

  adWin = new BrowserWindow({
    alwaysOnTop: lockHost,
    frame: false,
    thickFrame: false,
    autoHideMenuBar: true,
    width: 1080,
    height: 1920,
  });

  adWin.hide();

  if (lockHost) {
    win.fullScreen = true;
    adWin.fullScreen = true;
  } else {
    win.maximize();
    // adWin.openDevTools();
    adWin.maximize();
  }

  adWin.loadFile(join(__dirname, "index.html"));
  win.loadURL("https://www.opinionsjeancoutu.com");

  adWin.webContents.on("did-finish-load", () => {
    adWin.webContents.executeJavaScript(`init(${JSON.stringify(config)});`);
  });

  setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    const shouldBeIdle = idleTime > config.ads_idle_time_sec;
    if (shouldBeIdle !== isIdle) {
      isIdle = shouldBeIdle;
      if (shouldBeIdle) {
        win.hide();
        win.loadURL("https://www.opinionsjeancoutu.com");
        adWin.show();
      } else {
        adWin.hide();
        win.show();
      }
    }
  }, 1000);
}

app.on("ready", createWindow);

function checkConfig() {
  try {
    const configText = readFileSync(join(appData, "config.json"), "utf8");
    Object.assign(config, JSON.parse(configText));
  } catch (e) {
    console.error(e);
    const configPath = join(appData, "config.json");
    writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    shell.showItemInFolder(configPath);
    process.exit(1);
  }
}
