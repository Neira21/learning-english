# wordlearnIA

Aplicación de escritorio para practicar inglés con textos propios o archivos PDF. Permite guardar vocabulario, escribir traducciones y consultar un modelo local Hy-MT2.

## Desarrollo

```sh
pnpm install
pnpm dev
```

En otra terminal, inicia Electron:

```sh
pnpm electron
```

## Traducción local con Hy-MT2

wordlearnIA no descarga ni incluye los pesos del modelo. Para evitar una instalación de más de un gigabyte dentro de la app, conecta un servidor local que ya tenga cargado **Tencent Hy-MT2-1.8B-GGUF** y ofrezca la API compatible de OpenAI (`/v1/models` y `/v1/chat/completions`). En **Estudiar**, configura la dirección base del servidor. El valor inicial se define en `src/ai/config.ts`; la app también funciona con otros servidores compatibles y sus respectivos puertos.

Inicia el servidor antes de pulsar **Sugerir traducción con Hy-MT2**. La app consulta qué modelo está cargado y usa su endpoint local. La sugerencia aparece en el campo para que puedas revisarla antes de guardar. Las solicitudes y la validación del endpoint están separadas en `electron/ai/`.

La distribución GGUF Q4_K_M ocupa aproximadamente 1,13 GB según la ficha del modelo. La ficha publica licencia Apache-2.0. El modelo se ejecuta en el equipo mediante el runtime que prefieras; este proyecto no contiene los pesos ni instala ese runtime.

## Datos locales

Las palabras y preferencias de tema/servidor se guardan en el almacenamiento local de la aplicación. Los PDF originales se guardan en `userData/pdfs` de Electron y aparecen en **PDF guardados** para volver a abrirlos. El modo oscuro está activado al inicio.

## Estructura del frontend

- `src/pages/`: pantallas de lectura, vocabulario y estudio.
- `src/components/`: componentes compartidos, como la navegación.
- `src/utils/`: persistencia local y extracción de texto de PDF.
- `src/ai/`: valores por defecto y puente de traducción al modelo local.
