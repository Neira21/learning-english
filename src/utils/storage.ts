import type { Word } from "../types";

export const WORDS_STORAGE_KEY = "wordlearnia-words-v1";
export const THEME_STORAGE_KEY = "wordlearnia-theme-v1";

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
