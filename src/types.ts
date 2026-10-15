export type Word = {
  id: string;
  text: string;
  translation: string;
  context: string;
  addedAt: number;
};

export type Section = "read" | "words" | "study" | "information";

export type SavedPdf = {
  id: string;
  name: string;
  addedAt: number;
};
