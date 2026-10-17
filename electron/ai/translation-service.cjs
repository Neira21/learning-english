const { getLocalAiOrigin } = require("./config.cjs");

async function requestModelText(endpoint, content, options = {}) {
  const origin = getLocalAiOrigin(endpoint);
  const modelsResponse = await fetch(`${origin}/v1/models`);
  if (!modelsResponse.ok) {
    throw new Error("No se encontró el servidor local de IA. Comprueba que esté iniciado.");
  }

  const models = await modelsResponse.json();
  const model = models.data?.[0]?.id;
  if (!model) throw new Error("El servidor local no tiene un modelo cargado.");

  const response = await fetch(`${origin}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: options.temperature ?? 0.7,
      top_p: 0.6,
      max_tokens: options.maxTokens ?? 256,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) throw new Error("El modelo no pudo procesar la solicitud.");
  const result = await response.json();
  const text = result.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("El modelo no devolvió una respuesta.");
  return text;
}

async function translateWord({ endpoint, word, context }) {
  const content = `${context ? `Contexto de referencia (úsalo solo para entender el sentido; no lo traduzcas):\n${context}\n\n` : ""}Traduce del inglés al español el siguiente texto. Traduce todo el texto completo, sin omitir, resumir ni dejar palabras sin traducir. Devuelve únicamente la traducción al español, sin explicaciones.\n\nTexto que debes traducir:\n${word}`;
  try {
    return await requestModelText(endpoint, content);
  } catch {
    throw new Error("El modelo no pudo traducir este texto. Comprueba que Hy-MT2 esté iniciado.");
  }
}

module.exports = { translateWord };
