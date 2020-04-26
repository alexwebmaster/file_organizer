// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  electron,
  ipcMain
} = require("electron");
const path = require('path')
const fs   = require('fs')
let win;

require('electron-reload')(__dirname, {ignored: /node_modules|[\/\\]\./});

//Functions
const createWindow = () => {

  win = new BrowserWindow({ width: 1200, height: 600, show: false, webPreferences: { preload: path.join(__dirname, 'renderer.js'), nodeIntegration: true } });
  win.once("ready-to-show", () => win.show());
  win.on("closed", () => (win = null));
  win.removeMenu();
  win.webContents.openDevTools();

  win.loadFile("index.html");
};




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("asynchronous-message", (event, arg) => {
  if (arg === "tray") win.hide();
  if (arg === "quit") app.quit();
});

//changed copy method to be sync
ipcMain.on('copy_file', (event, file) => {

    // console.log(file);

    var f = path.basename(file.source);
    var source = fs.createReadStream(file.source);

    if ( !fs.existsSync( file.destination ) ) {
        fs.mkdirSync( file.destination , { recursive: true } );
    }
    var dest = fs.createWriteStream(path.resolve(file.destination, f));

    source.pipe(dest);
    source.on('end', function() { 
      event.returnValue = { status : 'success', file : file };
    });
    source.on('error', function(err) { 
      event.returnValue = { status : 'error', file : file };
      console.log(err);
     });
});
