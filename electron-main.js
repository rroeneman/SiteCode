"use strict";
exports.__esModule = true;
var electron = require("electron");
// Module to control application life
var app = electron.app;
var ipcMain = electron.ipcMain;
// This should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // Squirrel event handled and app will exit in 1000ms, so don't do anything else
    app.quit();
}
var path = require("path");
var url = require("url");
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
// Get environment type (dev / prod)
var args = process.argv.slice(1);
var dev = args.some(function (arg) { return arg === '--dev'; });
// ON REQUEST OF COMPONENT, SENT ALL THE process.argv (startup things) to component
//https://electronjs.org/docs/api/ipc-main
ipcMain.on('asynchronous-message', function (event, arg) {
    event.sender.send('asynchronous-reply', process.argv);
});
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1024, height: 720 });
    mainWindow.setMenu(null);
    if (!dev) {
        // and load the index.html of the app.
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    else {
        mainWindow.loadURL('http://127.0.0.1:4200');
    }
    if (dev) {
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
function handleSquirrelEvent(app) {
    if (process.argv.length === 1) {
        return false;
    }
    var ChildProcess = require('child_process');
    var path = require('path');
    var appFolder = path.resolve(process.execPath, '..');
    var rootAtomFolder = path.resolve(appFolder, '..');
    var updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    var exeName = path.basename(process.execPath);
    var spawn = function (command, args) {
        var spawnedProcess, error;
        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        }
        catch (error) { }
        return spawnedProcess;
    };
    var spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };
    var squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return true;
    }
}
