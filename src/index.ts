import "./polyfill";
import { renderApp, getCanvasRef, getLinkRef, AppState } from "./ui";
import { visualize } from "./visualizer";

import { getBlobAsObjectUrl, listKeys } from "./storage";
import { startRecording, requestStop, getRecorderState } from "./recorder";

import "./styles.css";

function renderAppRecordStart() {
  renderApp({ ...INITIAL_STATE, controlLabel: "stop" });
}

function renderAppRecordStop() {
  renderApp({ ...INITIAL_STATE, controlLabel: "start" });
}
function startVisualization(stream: MediaStream) {
  const canvas = getCanvasRef();
  if (canvas) {
    visualize(canvas, stream);
  }
}
const onClickButton = async () => {
  if (getRecorderState() === "recording") {
    requestStop();
  } else {
    await startRecording(
      [renderAppRecordStart, startVisualization],
      [renderAppRecordStop, displaySounds]
    );
  }
};

const INITIAL_STATE: AppState = {
  controlLabel: "start",
  onClickButton,
  audios: [],
  downloadSound
};

async function downloadSound(key: string) {
  const link = getLinkRef();
  if (!link) {
    alert("error");
  }

  const objectUrl = await getBlobAsObjectUrl(key);
  if (!objectUrl) {
    throw new Error(`Unable to found blob with key ${key}`);
  }
  link.href = objectUrl;
  link.setAttribute("download", `${key}.wav`);
  link.click();
}

async function displaySounds() {
  const audios = await listKeys();
  renderApp({
    ...INITIAL_STATE,
    audios
  });
}

renderApp(INITIAL_STATE);

displaySounds();
