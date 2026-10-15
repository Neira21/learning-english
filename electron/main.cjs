const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { translateWord } = require("./ai/translation-service.cjs");

const pdfDirectory = () => path.join(app.getPath("userData"), "pdfs");
const pdfIndexPath = () => path.join(pdfDirectory(), "index.json");
const safePdfId = (id) => /^[\da-f-]{36}$/i.test(id);

async function readPdfIndex() {
  try { return JSON.parse(await fs.readFile(pdfIndexPath(), "utf8")); }
  catch { return []; }
}

async function migrateLegacyUserData() {
  const legacyDirectory = path.join(app.getPath("appData"), "app-translation");
  const currentDirectory = app.getPath("userData");
  if (legacyDirectory === currentDirectory) return;

  for (const folder of ["pdfs", "Local Storage"]) {
    const source = path.join(legacyDirectory, folder);
    const destination = path.join(currentDirectory, folder);
    try {
      await fs.access(source);
      await fs.mkdir(currentDirectory, { recursive: true });
      await fs.cp(source, destination, { recursive: true, force: false, errorOnExist: false });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

ipcMain.handle("pdf:list", () => readPdfIndex());
ipcMain.handle("pdf:save", async (_event, { name, data }) => {
  const safeName = path.basename(name).replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
  if (!safeName.toLowerCase().endsWith(".pdf")) throw new Error("El archivo debe ser PDF.");
  const contents = Buffer.from(data);
  if (contents.length < 5 || contents.subarray(0, 1024).indexOf(Buffer.from("%PDF-")) < 0) {
    throw new Error("El archivo seleccionado no parece ser un PDF válido.");
  }

  const id = randomUUID();
  const directory = pdfDirectory();
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, `${id}.pdf`), contents);
  const documents = await readPdfIndex();
  const saved = { id, name: safeName, addedAt: Date.now() };
  await fs.writeFile(pdfIndexPath(), JSON.stringify([saved, ...documents], null, 2), "utf8");
  return saved;
});
ipcMain.handle("pdf:read", async (_event, id) => {
  if (!safePdfId(id)) throw new Error("Identificador de PDF no válido.");
  return new Uint8Array(await fs.readFile(path.join(pdfDirectory(), `${id}.pdf`)));
});

ipcMain.handle("wordlearnia:translate", (_event, request) => translateWord(request));

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    title: "wordlearnIA — aprende inglés a tu ritmo",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(async () => {
  await migrateLegacyUserData();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
