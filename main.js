const {
  shell,
  app,
  BrowserWindow,
  session,
  powerMonitor,
} = require("electron");
const { join } = require("path");
const { readFileSync } = require("fs");

const config = require("./config.json");
const { writeFileSync } = require("original-fs");
let win;
let isIdle = false;

const appData = app.getPath("userData");

function createWindow() {
  checkConfig();

  const currentSession = session.fromPartition("persist:currentSession");
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      session: currentSession,
      contextIsolation: true,
    },
  });

  currentSession.on("will-download", (event, item, webContents) => {
    event.preventDefault();
    require("got")(item.getURL()).then((response) => {
      console.log("response", response.body);
      require("fs").writeFileSync(
        join(appData, "currentSession"),
        response.body
      );
    });
  });

  if (app.isPackaged) {
    win.fullScreen = true;
  } else {
    win.maximize();
    win.openDevTools();
    config.ads_idle_time_sec = 3;
    config.ads_show_time_ms = 4000;
  }

  win.loadFile(join(__dirname, "index.html"));

  win.webContents.on("did-finish-load", async () => {
    win.webContents.executeJavaScript(
      `init(${JSON.stringify(config)});`,
      (result) => {
        console.log(result);
      }
    );
  });

  setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    const shouldBeIdle = idleTime > config.ads_idle_time_sec;
    if (shouldBeIdle !== isIdle) {
      isIdle = shouldBeIdle;
      win.webContents.executeJavaScript(shouldBeIdle ? "sleep()" : "wake()");
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
