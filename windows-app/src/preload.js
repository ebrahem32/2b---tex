const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("twoBTexDesktop", {
  savePng: (payload) => ipcRenderer.invoke("2btex:save-png", payload),
  print: () => ipcRenderer.invoke("2btex:print"),
});
