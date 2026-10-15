import type { Word } from "../types";

type Props = {
  words: Word[];
  onDelete: (id: string) => void;
  onRead: () => void;
};

export function WordsPage({ words, onDelete, onRead }: Props) {
  const translatedCount = words.filter((word) =>
    word.translation.trim(),
  ).length;

  return (
    <section className="page-content collection-page">
      <div className="page-heading">
        <div>
          <h1>
            Palabras que <em>descubriste.</em>
          </h1>
        </div>
        <button className="subtle-button" onClick={onRead}>
          ＋ Añadir desde una lectura
        </button>
      </div>
      <div className="collection-summary">
        <div>
          <span className="summary-number">{words.length}</span>
          <span className="summary-label">palabras guardadas</span>
        </div>
        <div className="summary-divider" />
        <div>
          <span className="summary-number">{translatedCount}</span>
          <span className="summary-label">con traducción</span>
        </div>
      </div>
      {words.length ? (
        <div className="word-list">
          {words.map((word) => (
            <article className="word-row" key={word.id}>
              <div className="word-letter">{word.text[0]?.toUpperCase()}</div>
              <div className="word-main">
                <strong>{word.text}</strong>
                <span>{word.context || "Añadida desde tu lectura"}</span>
              </div>
              <div className="word-translation">
                {word.translation || (
                  <span className="translation-empty">Sin traducción</span>
                )}
              </div>
              <button
                className="icon-button"
                aria-label={`Eliminar ${word.text}`}
                onClick={() => onDelete(word.id)}
              >
                ×
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>◇</span>
          <h3>Aquí empieza tu colección</h3>
          <p>
            Cuando encuentres una palabra nueva en una lectura, guárdala y
            aparecerá aquí.
          </p>
          <button onClick={onRead}>
            Ir a leer <span>↗</span>
          </button>
        </div>
      )}
    </section>
  );
}
