const { app, BrowserWindow } = require("electron");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1080,
    height: 1920,
  });

  win.loadFile("index.html");

  // maximize if not on mac
  if (process.platform !== "darwin") {
    win.maximize();
    win.fullScreen = true;
  }

  return win;
};

console.log("test");

// app.whenReady().then(() => {
//   const mainWindow = createWindow();
// });

app.on("ready", function () {

  win = createWindow();
  console.log("test2");
  win.openDevTools();

  win.on("closed", function () {
    win = null;
  });

  win.webContents.on('did-finish-load', () => {
    // Access the DOM object in the web page
    win.webContents.executeJavaScript('global.alert("Hello from client.js");', (result) => {
      console.log(result); // Output the text content of the first h1 element in the page
    });
  });

  //   const items = require('./pubs/all.json')

  // const carrousel = document.querySelector('.carrousel');

  // const splash = document.createElement('div');
  // splash.classList.add('splash');
  // splash.innerHTML = `test2`
  // document.body.appendChild(splash);

  // console.log({items})



  // mainWindow = new BrowserWindow({width:800, height : 600});
  // mainWindow.loadUrl('file://' + __dirname + '/index.html');

  //   var authButton = document.getElementById("auth-button");
  //   authButton.addEventListener("click",function(){alert("clicked!");});
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
