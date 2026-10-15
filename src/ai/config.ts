/** Central configuration for the local Hy-MT2 OpenAI-compatible server. */
export const AI_SERVER_HOST = "127.0.0.1";
export const AI_SERVER_PORT = 1234;
export const AI_BASE_URL_STORAGE_KEY = "wordlearnia-ai-endpoint";

export const DEFAULT_AI_BASE_URL = `http://${AI_SERVER_HOST}:${AI_SERVER_PORT}`;

export function readAiBaseUrl() {
  return localStorage.getItem(AI_BASE_URL_STORAGE_KEY) ?? DEFAULT_AI_BASE_URL;
}

export function writeAiBaseUrl(value: string) {
  localStorage.setItem(AI_BASE_URL_STORAGE_KEY, value);
}
