import { useRef } from "react";
import type { SavedPdf } from "../types";

type Props = {
  text: string;
  selected: string;
  translated: string;
  notice: string;
  fileName: string;
  savedPdfs: SavedPdf[];
  showPdfLibrary: boolean;
  translating: boolean;
  autoTranslateEnabled: boolean;
  onTextChange: (text: string) => void;
  onSelect: (text: string) => void;
  onTranslate: (text: string) => void;
  onToggleAutoTranslate: () => void;
  onSaveWord: () => void;
  onNewText: () => void;
  onTextMode: () => void;
  onClosePdf: () => void;
  onUpload: (file?: File) => void;
  onOpenPdf: (pdf: SavedPdf) => void;
  onTogglePdfLibrary: () => void;
  onClosePdfLibrary: () => void;
  onGoToWords: () => void;
};

export function ReadPage(props: Props) {
  const readerRef = useRef<HTMLTextAreaElement>(null);
  const lastAutoTranslatedSelection = useRef("");
  const captureSelection = () => {
    const reader = readerRef.current;
    if (!reader) return;
    const selection = reader.value
      .slice(reader.selectionStart, reader.selectionEnd)
      .trim();
    props.onSelect(selection);
    if (!selection) {
      lastAutoTranslatedSelection.current = "";
      return;
    }
    if (
      props.autoTranslateEnabled &&
      selection !== lastAutoTranslatedSelection.current
    ) {
      lastAutoTranslatedSelection.current = selection;
      props.onTranslate(selection);
    }
  };

  return (
    <section className="page-content reader-page">
      <div className="page-heading">
        <div>
          <h1>
            Aprende mientras <em>lees.</em>
          </h1>
        </div>
        <div className="reader-heading-actions">
          <button
            className={`auto-translation-toggle auto-translation-toggle-heading ${props.autoTranslateEnabled ? "" : "paused"}`}
            type="button"
            aria-pressed={!props.autoTranslateEnabled}
            onClick={props.onToggleAutoTranslate}
          >
            <span className="auto-translation-indicator" />
            <span>Traducción automática</span>
            <strong>{props.autoTranslateEnabled ? "Activa" : "Pausada"}</strong>
          </button>
          <button className="subtle-button" onClick={props.onNewText}>
            ＋ Nuevo texto
          </button>
        </div>
      </div>
      <div className="reader-toolbar">
        <div className="reader-tabs">
          <button
            className={!props.fileName ? "reader-tab selected" : "reader-tab"}
            onClick={props.onTextMode}
          >
            Texto
          </button>
          <button
            className={props.fileName ? "reader-tab selected" : "reader-tab"}
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            Documento PDF
          </button>
        </div>
        <div className="pdf-toolbar-actions">
          <button
            className="saved-pdfs-toggle"
            onClick={props.onTogglePdfLibrary}
          >
            PDF guardados · {props.savedPdfs.length}
          </button>
          <label className="upload-button" htmlFor="pdf-upload">
            ↥ <span>{props.fileName || "Subir PDF"}</span>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => props.onUpload(event.target.files?.[0])}
            />
          </label>
        </div>
      </div>
      {props.showPdfLibrary && (
        <div className="pdf-library">
          <div className="pdf-library-heading">
            <strong>PDF guardados en este equipo</strong>
            <button
              onClick={props.onClosePdfLibrary}
              aria-label="Cerrar biblioteca"
            >
              ×
            </button>
          </div>
          {props.savedPdfs.length ? (
            props.savedPdfs.map((pdf) => (
              <button
                className="pdf-library-item"
                key={pdf.id}
                onClick={() => props.onOpenPdf(pdf)}
              >
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{pdf.name}</strong>
                  <small>
                    Guardado {new Date(pdf.addedAt).toLocaleDateString()}
                  </small>
                </span>
                <span className="pdf-open-arrow">↗</span>
              </button>
            ))
          ) : (
            <p className="pdf-library-empty">
              Todavía no hay documentos. Sube un PDF para guardarlo en este
              equipo.
            </p>
          )}
        </div>
      )}
      {props.fileName && (
        <div className="pdf-notice">
          PDF seleccionado: <strong>{props.fileName}</strong>
          <span>El texto está listo para leer y seleccionar.</span>
          <button onClick={props.onClosePdf}>×</button>
        </div>
      )}
      <div className="reading-layout">
        <article className="reading-card">
          <div className="reading-meta">
            <span className="reading-tag">
              {props.fileName ? "DOCUMENTO PDF" : "LECTURA BREVE"}
            </span>
            <span>
              {props.text.trim()
                ? `${props.text.trim().split(/\s+/).length} palabras`
                : "Escribe o pega un texto"}{" "}
              <i>·</i> Selecciona y traduce
            </span>
          </div>
          <textarea
            ref={readerRef}
            className="reading-text"
            aria-label="Texto en inglés para leer"
            value={props.text}
            onChange={(event) => props.onTextChange(event.target.value)}
            onMouseUp={captureSelection}
            onKeyUp={captureSelection}
            placeholder="Pega o escribe aquí un texto en inglés..."
            spellCheck={false}
          />
          <div className="reading-footer">
            <span>Selecciona una palabra o frase</span>
            <span>
              {props.text.trim() ? props.text.trim().split(/\s+/).length : 0}{" "}
              palabras
            </span>
          </div>
        </article>
        <aside className="selection-card">
          <h3>Selección</h3>
          {props.translating && (
            <div className="translated-result translating-result" role="status">
              <span>TRADUCCIÓN</span>
              <strong>Traduciendo con Hy-MT2…</strong>
            </div>
          )}
          {props.translated && !props.translating && (
            <div className="translated-result">
              <span>TRADUCCIÓN</span>
              <strong>{props.translated}</strong>
            </div>
          )}
          {props.selected ? (
            <div className="selection-preview">
              <span>TEXTO SELECCIONADO</span>
              <strong>{props.selected}</strong>
              <div className="selection-actions">
                <button
                  className="force-translate-button"
                  onClick={() => props.onTranslate(props.selected)}
                  disabled={props.translating}
                >
                  {props.translating ? "Traduciendo…" : "Traducir ahora"}
                </button>
                <button className="save-word-button" onClick={props.onSaveWord}>
                  ＋ Guardar palabra
                </button>
              </div>
            </div>
          ) : (
            <div className="selection-empty">
              <span className="selection-spark">✦</span>
              <span>
                Selecciona una palabra
                <br />o frase para empezar.
              </span>
            </div>
          )}
          {props.notice && (
            <div className="notice" role="status">
              {props.notice}
            </div>
          )}
          <button className="view-words" onClick={props.onGoToWords}>
            Ver mis palabras <span>↗</span>
          </button>
        </aside>
      </div>
    </section>
  );
}
