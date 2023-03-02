const { app, BrowserWindow } = require('electron');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      nodeIntegration: true // enable node integration in the renderer process
    }
  });


  if (devMode) {
    win.openDevTools();
  } else {
    win.maximize();
    win.fullScreen = true;
  }

  win.loadFile(path.join(__dirname, 'index.html'));

  win.webContents.on('did-finish-load', async () => {

    const items = require('./pubs/all.json')
    console.log({items})



    const [first] = items

    // Access the DOM object in the web page
    win.webContents.executeJavaScript(`
    const frame = document.createElement("iframe");
    document.body.appendChild(frame);
    frame.src = "./pubs/${first.file}";
    `, (result) => {
      console.log(result); // Output the text content of the first h1 element in the page
    });
  });
}

app.on('ready', createWindow);
