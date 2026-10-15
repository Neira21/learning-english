import { useState } from "react";

const command =
  "llama serve -hf tencent/Hy-MT2-1.8B-GGUF:Q4_K_M --host 127.0.0.1 --port 1234";

export function InformationPage() {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="page-content information-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> MODELO LOCAL</span>
          <h1>Conecta <em>Hy-MT2.</em></h1>
          <p className="page-subtitle">
            Inicia el servidor local para obtener sugerencias de traducción.
          </p>
        </div>
      </div>

      <div className="terminal-window" aria-label="Comando de terminal para iniciar Hy-MT2">
        <div className="terminal-titlebar">
          <div className="terminal-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="terminal-title">PowerShell · Hy-MT2</span>
          <span className="terminal-live"><i /> LOCAL</span>
        </div>

        <div className="terminal-body">
          <div className="terminal-intro">
            <span className="terminal-label">INICIAR SERVIDOR DE TRADUCCIÓN</span>
            <p>Ejecuta este comando en PowerShell o en tu terminal:</p>
          </div>
          <div className="terminal-command">
            <span className="terminal-prompt">PS&nbsp; C:\&gt;</span>
            <code>{command}</code>
            <button onClick={() => void copyCommand()} aria-label="Copiar comando">
              {copied ? "Copiado ✓" : "Copiar"}
            </button>
          </div>
          <div className="terminal-output">
            <span className="terminal-output-mark">›</span>
            <span>
              El servidor quedará disponible en <strong>http://127.0.0.1:1234</strong>.
              Mantén esta terminal abierta mientras uses la aplicación.
            </span>
          </div>
        </div>

        <div className="terminal-statusbar">
          <span><i /> Comando listo para ejecutar</span>
          <span>Hy-MT2 · Tencent</span>
        </div>
      </div>
    </section>
  );
}
