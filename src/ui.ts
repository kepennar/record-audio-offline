import { html, render } from "lit-html";

export interface AppState {
  controlLabel: string;
  audios: string[];
  onClickButton: (key: string) => void;
  downloadSound: (key: string) => void;
}

export function renderApp({
  controlLabel,
  onClickButton,
  downloadSound,
  audios
}: AppState) {
  ``;
  const audioItems = audios.map(
    audio =>
      html`
        <li><a href="#" @click=${() => downloadSound(audio)}>${audio}</a></li>
      `
  );

  const renderedHtml = html`
    <h1>Hello folks!</h1>
    <div>
      <a id="download" href="#"></a>
      <button id="control" @click=${onClickButton}>${controlLabel}</button>
      <div>
        <canvas id="visualizer" />
      </div>
      <ul>
        ${audioItems}
      </ul>
    </div>
  `;

  render(renderedHtml, document.getElementById("app"));
}

export function getCanvasRef(): HTMLCanvasElement | null {
  return document.querySelector("#visualizer") as HTMLCanvasElement;
}

export function getLinkRef(): HTMLLinkElement | null {
  return document.querySelector("#download") as HTMLLinkElement;
}
