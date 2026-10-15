export async function translateWithLocalModel(
  baseUrl: string,
  text: string,
  context = "",
) {
  if (!window.wordlearnIA) {
    throw new Error("La traducción local está disponible al abrir wordlearnIA como aplicación de escritorio.");
  }

  return window.wordlearnIA.translateWord(baseUrl, text, context);
}
