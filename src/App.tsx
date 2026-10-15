import { useEffect, useMemo, useRef, useState } from "react";
import { TopNav } from "./components/TopNav";
import { readAiBaseUrl, writeAiBaseUrl } from "./ai/config";
import { translateWithLocalModel } from "./ai/translate";
import { ReadPage } from "./pages/ReadPage";
import { StudyPage } from "./pages/StudyPage";
import { WordsPage } from "./pages/WordsPage";
import { InformationPage } from "./pages/InformationPage";
import type { SavedPdf, Section, Word } from "./types";
import { extractPdfText } from "./utils/pdf";
import {
  readDarkMode,
  readWords,
  writeDarkMode,
  writeWords,
} from "./utils/storage";
import "./App.css";
import "./PdfLibrary.css";
import "./Readability.css";

const initialText = ``;

function App() {
  const [section, setSection] = useState<Section>("read");
  const [words, setWords] = useState<Word[]>(readWords);
  const [text, setText] = useState(initialText);
  const [selected, setSelected] = useState("");
  const [translatedSelection, setTranslatedSelection] = useState("");
  const [notice, setNotice] = useState("");
  const [fileName, setFileName] = useState("");
  const [activeWord, setActiveWord] = useState(0);
  const [draft, setDraft] = useState("");
  const [darkMode, setDarkMode] = useState(readDarkMode);
  const [aiEndpoint, setAiEndpoint] = useState(readAiBaseUrl);
  const [aiBusy, setAiBusy] = useState(false);
  const [translatingSelection, setTranslatingSelection] = useState(false);
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);
  const selectionTranslationRequest = useRef(0);
  const [savedPdfs, setSavedPdfs] = useState<SavedPdf[]>([]);
  const [showPdfLibrary, setShowPdfLibrary] = useState(false);

  useEffect(() => {
    void window.wordlearnIA
      ?.listPdfs()
      .then(setSavedPdfs)
      .catch(() => setNotice("No se pudo cargar la biblioteca de PDF."));
  }, []);

  const dueWords = useMemo(
    () => words.filter((word) => !word.translation.trim()),
    [words],
  );
  const saveWordList = (next: Word[]) => {
    setWords(next);
    writeWords(next);
  };
  const getSelectionDetails = (selection = selected) => {
    const value = selection
      .trim()
      .replace(/\s+/g, " ");
    const foundAt = text.toLowerCase().indexOf(value.toLowerCase());
    const context =
      foundAt >= 0
        ? text
            .slice(Math.max(0, foundAt - 65), foundAt + value.length + 75)
            .replace(/\s+/g, " ")
            .trim()
        : "";
    return { value, context };
  };

  const saveSelection = () => {
    const { value, context } = getSelectionDetails();
    if (!/^[a-z][a-z'-]*(?:\s+[a-z][a-z'-]*)*$/i.test(value)) {
      setNotice("Selecciona una o varias palabras en inglés.");
      return;
    }
    if (words.some((word) => word.text.toLowerCase() === value.toLowerCase())) {
      setNotice(`“${value}” ya está en tus palabras.`);
      return;
    }
    saveWordList([
      {
        id: crypto.randomUUID(),
        text: value,
        translation: "",
        context,
        addedAt: Date.now(),
      },
      ...words,
    ]);
    setSelected("");
    setTranslatedSelection("");
    setNotice(`“${value}” se guardó en Mis palabras.`);
  };

  const translateSelection = async (selection = selected) => {
    const requestId = ++selectionTranslationRequest.current;
    const { value, context } = getSelectionDetails(selection);
    if (!/[a-z]/i.test(value)) {
      setTranslatedSelection("");
      setTranslatingSelection(false);
      setNotice("Selecciona un texto que contenga palabras en inglés.");
      return;
    }
    setTranslatingSelection(true);
    setTranslatedSelection("");
    setNotice("Consultando Hy-MT2…");
    try {
      const translation = await translateWithLocalModel(
        aiEndpoint,
        value,
        context,
      );
      if (requestId !== selectionTranslationRequest.current) return;
      setTranslatedSelection(translation);
      setNotice(
        `Traducción de “${value}” lista. No se guardó en Mis palabras.`,
      );
    } catch (error) {
      if (requestId !== selectionTranslationRequest.current) return;
      setNotice(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con Hy-MT2.",
      );
    } finally {
      if (requestId === selectionTranslationRequest.current)
        setTranslatingSelection(false);
    }
  };

  const uploadPdf = async (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setNotice("Elige un archivo PDF.");
      return;
    }
    setFileName(file.name);
    setNotice("Leyendo el documento…");
    try {
      const data = await file.arrayBuffer();
      if (window.wordlearnIA) {
        const saved = await window.wordlearnIA.savePdf(file.name, data);
        setSavedPdfs((current) => [saved, ...current]);
      }
      const { text: extracted, pageCount } = await extractPdfText(data);
      if (!extracted) {
        setNotice(
          "PDF guardado, pero no se encontró texto seleccionable. Si es escaneado, pega aquí el texto que quieras estudiar.",
        );
        return;
      }
      setText(extracted);
      setShowPdfLibrary(false);
      setNotice(
        `${pageCount} ${pageCount === 1 ? "página leída" : "páginas leídas"}. PDF guardado en este equipo.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? `No se pudo guardar o leer el PDF: ${error.message}`
          : "No se pudo guardar o leer este PDF.",
      );
    }
  };

  const openSavedPdf = async (pdf: SavedPdf) => {
    if (!window.wordlearnIA) return;
    setFileName(pdf.name);
    setNotice(`Abriendo ${pdf.name}…`);
    try {
      const data = await window.wordlearnIA.readPdf(pdf.id);
      const { text: extracted, pageCount } = await extractPdfText(data);
      if (!extracted) {
        setNotice("Este PDF no contiene texto seleccionable.");
        return;
      }
      setText(extracted);
      setShowPdfLibrary(false);
      setNotice(
        `${pageCount} ${pageCount === 1 ? "página" : "páginas"} listas para leer.`,
      );
    } catch {
      setNotice("No se pudo abrir el PDF guardado.");
    }
  };

  const requestTranslation = async () => {
    const word = words[activeWord];
    if (!word) return;
    setAiBusy(true);
    setNotice("Consultando Hy-MT2 en tu equipo…");
    try {
      setDraft(
        await translateWithLocalModel(aiEndpoint, word.text, word.context),
      );
      setNotice(
        "Traducción sugerida por Hy-MT2. Revísala y guárdala cuando quieras.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el modelo local.",
      );
    } finally {
      setAiBusy(false);
    }
  };

  const saveStudyTranslation = () => {
    const word = words[activeWord];
    if (!word) return;
    saveWordList(
      words.map((item) =>
        item.id === word.id ? { ...item, translation: draft.trim() } : item,
      ),
    );
    setNotice("Traducción guardada.");
  };

  const navigate = (nextSection: Section) => {
    setSection(nextSection);
    if (nextSection === "study") {
      setActiveWord(0);
      setDraft(words[0]?.translation ?? "");
    }
  };

  const startNewText = () => {
    setText("");
    setFileName("");
    setSelected("");
    setTranslatedSelection("");
    setNotice("");
  };

  return (
    <div className={darkMode ? "app-shell dark-mode" : "app-shell"}>
      <main className="main-area">
        <TopNav
          section={section}
          wordCount={words.length}
          dueCount={dueWords.length}
          darkMode={darkMode}
          onNavigate={navigate}
          onToggleTheme={() => {
            const next = !darkMode;
            setDarkMode(next);
            writeDarkMode(next);
          }}
        />
        {section === "read" && (
          <ReadPage
            text={text}
            selected={selected}
            translated={translatedSelection}
            notice={notice}
            fileName={fileName}
            savedPdfs={savedPdfs}
            showPdfLibrary={showPdfLibrary}
            translating={translatingSelection}
            autoTranslateEnabled={autoTranslateEnabled}
            onTextChange={setText}
            onSelect={(value) => {
              setSelected(value);
              if (!value) {
                selectionTranslationRequest.current += 1;
                setTranslatedSelection("");
                setTranslatingSelection(false);
              }
            }}
            onTranslate={(value) => void translateSelection(value)}
            onToggleAutoTranslate={() => {
              const next = !autoTranslateEnabled;
              setAutoTranslateEnabled(next);
              if (next && selected.trim()) void translateSelection(selected);
            }}
            onSaveWord={saveSelection}
            onNewText={startNewText}
            onTextMode={() => setFileName("")}
            onClosePdf={() => setFileName("")}
            onUpload={(file) => void uploadPdf(file)}
            onOpenPdf={(pdf) => void openSavedPdf(pdf)}
            onTogglePdfLibrary={() => setShowPdfLibrary((visible) => !visible)}
            onClosePdfLibrary={() => setShowPdfLibrary(false)}
            onGoToWords={() => navigate("words")}
          />
        )}
        {section === "words" && (
          <WordsPage
            words={words}
            onDelete={(id) =>
              saveWordList(words.filter((word) => word.id !== id))
            }
            onRead={() => navigate("read")}
          />
        )}
        {section === "study" && (
          <StudyPage
            words={words}
            activeWord={activeWord}
            draft={draft}
            notice={notice}
            busy={aiBusy}
            endpoint={aiEndpoint}
            onDraftChange={setDraft}
            onEndpointChange={(value) => {
              setAiEndpoint(value);
              writeAiBaseUrl(value);
            }}
            onTranslate={() => void requestTranslation()}
            onSave={saveStudyTranslation}
            onNext={() => {
              const next = (activeWord + 1) % words.length;
              setActiveWord(next);
              setDraft(words[next]?.translation ?? "");
            }}
            onRead={() => navigate("read")}
          />
        )}
        {section === "information" && <InformationPage />}
      </main>
    </div>
  );
}

export default App;
