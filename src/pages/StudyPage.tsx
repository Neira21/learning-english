import type { Word } from "../types";

type Props = {
  words: Word[];
  activeWord: number;
  draft: string;
  notice: string;
  busy: boolean;
  endpoint: string;
  onDraftChange: (value: string) => void;
  onEndpointChange: (value: string) => void;
  onTranslate: () => void;
  onSave: () => void;
  onNext: () => void;
  onRead: () => void;
};

export function StudyPage(props: Props) {
  const word = props.words[props.activeWord];
  const dueCount = props.words.filter(
    (item) => !item.translation.trim(),
  ).length;

  return (
    <section className="page-content study-page">
      <div className="page-heading"></div>
      {props.words.length ? (
        <div className="study-layout">
          <div className="study-card">
            <div className="study-word">{word?.text}</div>
            {word?.context && (
              <div className="study-context">“{word.context}”</div>
            )}
            <button
              className="ai-translate"
              onClick={props.onTranslate}
              disabled={props.busy}
            >
              {props.busy
                ? "Consultando Hy-MT2…"
                : "✦ Sugerir traducción con Hy-MT2"}
            </button>
            <label className="answer-label" htmlFor="translation-input">
              TU TRADUCCIÓN EN ESPAÑOL
            </label>
            <div className="answer-field">
              <input
                id="translation-input"
                value={props.draft}
                onChange={(event) => props.onDraftChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") props.onSave();
                }}
                placeholder="Escribe aquí lo que significa..."
              />
              <span>↵</span>
            </div>
            <div className="study-actions">
              <button className="skip-button" onClick={props.onNext}>
                Dejar para después
              </button>
              <button className="save-answer" onClick={props.onSave}>
                Guardar traducción <span>→</span>
              </button>
            </div>
            {props.notice && (
              <p className="study-notice" role="status">
                {props.notice}
              </p>
            )}
            <p className="ai-note">
              La sugerencia se genera en tu equipo y tú decides si guardarla.
            </p>
          </div>
          <aside className="study-side">
            <h3>Tu ritmo, tus reglas.</h3>
            <p>
              Las palabras sin traducción aparecen primero. También puedes
              completar su significado más tarde.
            </p>
            <label className="endpoint-label" htmlFor="ai-endpoint">
              SERVIDOR LOCAL COMPATIBLE
            </label>
            <input
              className="endpoint-input"
              id="ai-endpoint"
              value={props.endpoint}
              onChange={(event) => props.onEndpointChange(event.target.value)}
              placeholder="http://127.0.0.1:1234"
            />
            <p className="endpoint-hint">
              Cambia aquí la dirección o el puerto del servidor local de Hy-MT2.
            </p>
            <div className="study-stat">
              <span>Por traducir</span>
              <strong>{dueCount}</strong>
            </div>
            <div className="study-stat">
              <span>Completadas</span>
              <strong>{props.words.length - dueCount}</strong>
            </div>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <span>✳</span>
          <h3>Tu próxima sesión empieza leyendo</h3>
          <p>
            Guarda algunas palabras en la sección Leer y vuelve aquí para
            estudiarlas.
          </p>
          <button onClick={props.onRead}>
            Ir a leer <span>↗</span>
          </button>
        </div>
      )}
    </section>
  );
}
