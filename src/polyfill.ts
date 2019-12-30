if (!window.MediaRecorder) {
  window.MediaRecorder = require("audio-recorder-polyfill");
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
