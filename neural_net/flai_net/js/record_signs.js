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

async function main() {
    const video = await loadWebcamVideo()
    console.log(video)
}

main()
