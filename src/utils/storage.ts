import type { Word } from "../types";

export const WORDS_STORAGE_KEY = "wordlearnia-words-v1";
export const THEME_STORAGE_KEY = "wordlearnia-theme-v1";
export const READING_TEXT_STORAGE_KEY = "wordlearnia-reading-text-v1";

export function readReadingText(): string {
  try {
    return localStorage.getItem(READING_TEXT_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeReadingText(text: string) {
  try {
    localStorage.setItem(READING_TEXT_STORAGE_KEY, text);
  } catch {
    // Keep typing usable if a very large document exceeds local storage capacity.
  }
}

export function readWords(): Word[] {
  try {
    return JSON.parse(localStorage.getItem(WORDS_STORAGE_KEY) ?? "[]") as Word[];
  } catch {
    return [];
  }
}

export function writeWords(words: Word[]) {
  localStorage.setItem(WORDS_STORAGE_KEY, JSON.stringify(words));
}

export function readDarkMode() {
  return localStorage.getItem(THEME_STORAGE_KEY) !== "light";
}

export function writeDarkMode(enabled: boolean) {
  localStorage.setItem(THEME_STORAGE_KEY, enabled ? "dark" : "light");
}
