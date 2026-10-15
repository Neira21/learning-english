import type { Section } from "../types";
import "./TopNav.css";

type Props = {
  section: Section;
  wordCount: number;
  dueCount: number;
  darkMode: boolean;
  onNavigate: (section: Section) => void;
  onToggleTheme: () => void;
};

export function TopNav({
  section,
  wordCount,
  dueCount,
  darkMode,
  onNavigate,
  onToggleTheme,
}: Props) {
  return (
    <header className="topbar">
      <a
        className="brand"
        href="#inicio"
        onClick={() => onNavigate("read")}
        aria-label="wordlearnIA, inicio"
      >
        <span className="brand-mark">w.</span>
        <span>
          wordlearn<span className="brand-ai">IA</span>
          <span className="brand-dot">.</span>
        </span>
      </a>
      <nav className="main-nav" aria-label="Navegación principal">
        <button
          className={
            section === "read" ? "main-nav-item active" : "main-nav-item"
          }
          onClick={() => onNavigate("read")}
        >
          Leer
        </button>
        <button
          className={
            section === "words" ? "main-nav-item active" : "main-nav-item"
          }
          onClick={() => onNavigate("words")}
        >
          Mis palabras <span>{wordCount}</span>
        </button>
        <button
          className={
            section === "study" ? "main-nav-item active" : "main-nav-item"
          }
          onClick={() => onNavigate("study")}
        >
          Estudiar <span>{dueCount}</span>
        </button>
        <button
          className={
            section === "information" ? "main-nav-item active" : "main-nav-item"
          }
          onClick={() => onNavigate("information")}
        >
          Información
        </button>
      </nav>
      <div className="topbar-right">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
          title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {darkMode ? "☼" : "☾"}
        </button>
      </div>
    </header>
  );
}
