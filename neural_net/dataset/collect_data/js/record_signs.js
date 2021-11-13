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
const mirrorToCanvas = (video) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let canvasContext = canvas.getContext("2d");
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const saveLabeledCapture = (video, captures, label, labelNum) => {
  const canvas = mirrorToCanvas(video);
  const image = canvas.toDataURL("image/png");
  captures[`${label}_${labelNum}`] = image;
  axios({
    method: "post",
    url: "http://localhost:3000/examples",
    data: {
      label: label,
      image: image,
    },
  });
  console.log(captures);
};

const updateStatistic = (labels, statistic) => {
  statistic.innerHTML = "";
  const tr_th = document.createElement("tr");
  const tr_td = document.createElement("tr");
  for (let [label, number] of Object.entries(labels)) {
    const th = document.createElement("th");
    const td = document.createElement("td");
    th.innerText = label;
    td.innerText = number
    tr_th.appendChild(th);
    tr_td.appendChild(td);
  }
  statistic.appendChild(tr_th);
  statistic.appendChild(tr_td);
};

async function main() {
  const video = await loadWebcamVideo();
  const letters = [..."abcdefghiklmnopqrstuvwxy"];
  let labels = {};
  let captures = {};
  letters.forEach((letter) => {
    labels[letter] = 0;
  });
  let statistic = document.querySelector("#labelStatistic");
  updateStatistic(labels, statistic);
  document.addEventListener("keypress", (event) => {
    const key = event.key;
    if (letters.includes(key)) {
      saveLabeledCapture(video, captures, key, labels[key]);
      labels[key]++;
      updateStatistic(labels, statistic);
    }
  });
}

main();
