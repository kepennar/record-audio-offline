import { setBlob, getBlob } from "./storage";

const MIME_TYPE = "audio/webm";

type StreamCallback = (stream: MediaStream) => void;
let mediaRecorder: MediaRecorder | undefined;
let shouldStop = false;

export async function startRecording(
  startCallbacks: Array<StreamCallback> = [],
  stopCallbacks: Array<StreamCallback> = []
) {
  const date = new Date();
  const audioName = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });
  mediaRecorder = new MediaRecorder(stream, { mimeType: MIME_TYPE });

  mediaRecorder.addEventListener("start", () => {
    for (let callbacks of startCallbacks) {
      callbacks(stream);
    }
  });

  mediaRecorder.addEventListener(
    "dataavailable",
    async ({ data }: BlobEvent) => {
      if (shouldStop === true && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        shouldStop = false;
      }

      const blob = await appendAudio(audioName, data);
      await setBlob(audioName, blob);
    }
  );

  mediaRecorder.addEventListener("stop", async () => {
    stream.getTracks().forEach(track => {
      track.stop();
    });

    for (let callbacks of stopCallbacks) {
      callbacks(stream);
    }
  });
  mediaRecorder.start(1000);
}

export function requestStop() {
  shouldStop = true;
}

export function getRecorderState() {
  return mediaRecorder ? mediaRecorder.state : "inactive";
}

async function appendAudio(audioKey: string, chunk: Blob) {
  const storedBlob = await getBlob(audioKey);
  if (!storedBlob) {
    return new Blob([chunk], { type: MIME_TYPE });
  }
  return new Blob([storedBlob, chunk], { type: MIME_TYPE });
}
