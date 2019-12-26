import localforage from "localforage";

import { renderApp, getCanvasRef, getLinkRef, AppState } from "./ui";
import { visualize } from "./visualizer";

import "./styles.css";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "KeKe POC",
  version: 1.0,
  storeName: "keke-store",
  description: "storing some audio"
});

let shouldStop = false;
let started = false;

const onClickButton = () => {
  if (started) {
    shouldStop = true;
  } else {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  }
};

const INITIAL_STATE: AppState = {
  controlLabel: "start",
  onClickButton,
  audios: [],
  downloadSound
};

renderApp(INITIAL_STATE);

displaySounds();

function handleSuccess(stream: MediaStream) {
  started = true;
  renderApp({ ...INITIAL_STATE, controlLabel: "stop" });

  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  const canvas = getCanvasRef();
  if (canvas) {
    visualize(canvas, stream);
  }

  const recordedChunks = [];

  mediaRecorder.addEventListener("start", () => {
    console.log("[DEBUG] mediaRecorder started");
  });

  mediaRecorder.addEventListener("dataavailable", (e: BlobEvent) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
    if (shouldStop === true && started === true) {
      mediaRecorder.stop();
      started = false;
      shouldStop = false;
      stream.getTracks().forEach(track => {
        track.stop();
      });
      renderApp({
        ...INITIAL_STATE,
        controlLabel: "Start"
      });
    }
  });

  mediaRecorder.addEventListener("stop", async () => {
    const link = getLinkRef();
    if (!link) {
      alert("error");
    }
    const date = new Date();
    const audioName = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;

    const blob = new Blob(recordedChunks);
    await localforage.setItem(audioName, blob);
    await displaySounds();
  });

  mediaRecorder.addEventListener("error", error => {
    console.error(error);
  });

  mediaRecorder.start(1000);
}

async function downloadSound(key: string) {
  const link = getLinkRef();
  if (!link) {
    alert("error");
  }

  const blob = await localforage.getItem(key);
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${key}.wav`);
  link.click();
}

async function displaySounds() {
  const audios = await localforage.keys();
  renderApp({
    ...INITIAL_STATE,
    audios
  });
}
