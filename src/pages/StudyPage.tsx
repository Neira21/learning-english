import { useEffect, useState } from "react";
import type { Word } from "../types";
import { normalizeAnswer } from "../utils/normalizeAnswer";

type AnswerStatus = "empty" | "correct" | "incorrect";

type StudyRowProps = {
  word: Word;
};

function StudyRow({ word }: StudyRowProps) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<AnswerStatus>("empty");
  useEffect(() => {
    const normalizedAnswer = normalizeAnswer(answer);
    if (!normalizedAnswer) {
      setStatus("empty");
      return;
    }
    setStatus(normalizedAnswer === normalizeAnswer(word.translation) ? "correct" : "incorrect");
  }, [answer, word.translation]);

  return (
    <tr>
      <th className="study-table-word-cell" scope="row">
        <strong>{word.text}</strong>
      </th>
      <td>
        <div className={`study-table-answer ${status}`}>
          <input
            aria-label={`Traduce ${word.text} al español`}
            autoComplete="off"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Escribe la traducción..."
          />
          <span
            className="study-table-answer-status"
            aria-live="polite"
            aria-label={
              status === "correct"
                ? "Respuesta correcta"
                : status === "incorrect"
                  ? "Respuesta incorrecta"
                : undefined
            }
          >
            {status === "correct"
              ? "✓"
              : status === "incorrect"
                ? "×"
                : ""}
          </span>
        </div>
      </td>
    </tr>
  );
}

type Props = {
  words: Word[];
  onGoToWords: () => void;
};

export function StudyPage({
  words,
  onGoToWords,
}: Props) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <section className="page-content study-page">
      <div className="page-heading">
        <div>
          <h1>
            Vamos a <em>estudiar.</em>
          </h1>
          <p className="page-subtitle">
            Escribe en español el significado de cada palabra en inglés.
          </p>
        </div>
        {!!words.length && (
          <button
            className="subtle-button"
            onClick={() => setResetKey((current) => current + 1)}
          >
            Limpiar respuestas
          </button>
        )}
      </div>
      {words.length ? (
        <div className="study-table-container">
          <table className="study-table">
            <thead>
              <tr>
                <th scope="col">Palabra en inglés</th>
                <th scope="col">Tu traducción en español</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <StudyRow
                  key={`${word.id}-${resetKey}`}
                  word={word}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span>✳</span>
          <h3>Aún no hay palabras para estudiar</h3>
          <p>
            Escribe y guarda las traducciones en Mis palabras. Las palabras
            traducidas aparecerán aquí para repasarlas.
          </p>
          <button onClick={onGoToWords}>
            Ir a Mis palabras <span>↗</span>
          </button>
        </div>
      )}
    </section>
  );
}
