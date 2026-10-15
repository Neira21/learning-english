const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wordlearnIA", {
  translateWord: (endpoint, word, context) =>
    ipcRenderer.invoke("wordlearnia:translate", { endpoint, word, context }),
  listPdfs: () => ipcRenderer.invoke("pdf:list"),
  savePdf: (name, data) => ipcRenderer.invoke("pdf:save", { name, data }),
  readPdf: (id) => ipcRenderer.invoke("pdf:read", id),
});
