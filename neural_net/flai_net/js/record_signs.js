async function loadWebcamVideo() {
  // from https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/demo/index.js
  const video = document.querySelector("#webcamVideo");

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

// derived from https://stackoverflow.com/a/13765373/14906871
function mirrorToCanvas(video) {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let canvasContext = canvas.getContext("2d");
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function saveLabeledCapture(video, captures, label, labelNum) {
  const canvas = mirrorToCanvas(video);
  const image = canvas.toDataURL("image/jpg");
  captures[`${label}_${labelNum}`] = image;
  console.log(captures);
}

async function main() {
  const video = await loadWebcamVideo();
  const letters = [..."abcdefghiklmnopqrstuvwxy"];
  let labels = {};
  letters.forEach((letter) => {
    labels[letter] = 0;
  });
  let captures = {};
  document.addEventListener("keypress", (event) => {
    const key = event.key;
    if (letters.includes(key)) {
      saveLabeledCapture(video, captures, key, labels[key]);
      labels[key]++;
    }
  });
}

main();
