const electron = require('electron')
const path = require('path')
const nativeImage = require('electron').nativeImage

const BrowserWindow = electron.BrowserWindow
const app = electron.app
const isWin = process.platform === "win32"

app.on('ready', () => {
  createWindow()
})
var phpServer = require('php-server-manager');
const PHPServer = require('php-server-manager');

const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;
const image = nativeImage.createFromPath('/icone.png');

let mainWindow
let server
function createWindow() {
  image.setTemplateImage(true);

  if (isWin) {

     server = new PHPServer({
      php: `${__dirname}/php/php.exe`,
      stdio: 'inherit',
      port: port,
      directory: `${__dirname}/www/public/`,
      directives: {
      display_errors: 1,
      expose_php: 1
      },
      config: `${__dirname}/php/php.ini`,
      script: `${__dirname}/www/server.php`,
      });
}else{
   server = new PHPServer({
    port: port,
    directory: `${__dirname}/www/public/`,
    script: `${__dirname}`+ '/www/server.php'
  });
}

server.run();

  // Create the browser window.
  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname , 'icon.ico'),
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    

  })
  

  mainWindow.loadURL(serverUrl)
  
  var splash = new BrowserWindow({ 
    width: 500, 
    height: 500, 
    transparent: true, 
    frame: false, 
    alwaysOnTop: true 
  });
  splash.loadFile('splash.html');
  splash.center();

  
  mainWindow.webContents.once('dom-ready', function () {
    
    setTimeout(function () {
      splash.close();
      mainWindow.show()
    mainWindow.maximize();
    }, 6000);
    
    // mainWindow.webContents.openDevTools()
  });

  

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    server.close();
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow) // <== this is extra so commented, enabling this can show 2 windows..

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // PHP SERVER QUIT
    server.close();
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
