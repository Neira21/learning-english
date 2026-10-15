interface Window {
  wordlearnIA?: {
    translateWord: (endpoint: string, word: string, context: string) => Promise<string>;
    listPdfs: () => Promise<SavedPdf[]>;
    savePdf: (name: string, data: ArrayBuffer) => Promise<SavedPdf>;
    readPdf: (id: string) => Promise<Uint8Array>;
  };
}

interface SavedPdf {
  id: string;
  name: string;
  addedAt: number;
}
